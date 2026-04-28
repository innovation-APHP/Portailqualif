#!/bin/bash
# =====================================================
# Script d'ajout des routes de migration au serveur API
# Portail Qualité - Configuration automatique
# =====================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Configuration API de Migration${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Vérifier que le fichier existe
if [ ! -f "api/server.js" ]; then
    echo -e "${RED}✗${NC} Fichier api/server.js non trouvé"
    echo -e "${YELLOW}⚠${NC}  Assurez-vous d'être à la racine du projet"
    exit 1
fi

echo -e "${GREEN}✓${NC} Fichier api/server.js trouvé"

# Vérifier si les routes sont déjà ajoutées
if grep -q "POST /api/migration/execute" api/server.js; then
    echo -e "${YELLOW}⚠${NC}  Les routes de migration semblent déjà être configurées"
    read -p "Voulez-vous continuer quand même ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}→${NC} Annulé"
        exit 0
    fi
fi

# Créer une sauvegarde
echo -e "${BLUE}→${NC} Création d'une sauvegarde..."
cp api/server.js api/server.js.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓${NC} Sauvegarde créée"

# Créer le fichier temporaire avec les routes de migration
cat > /tmp/migration_routes.js << 'EOF'

// ==========================================
// Routes de Migration localStorage -> PostgreSQL
// ==========================================

/**
 * Service de Migration
 */
class MigrationService {
  constructor(dbPool) {
    this.pool = dbPool;
  }

  async migrate(localStorageData) {
    const client = await this.pool.connect();
    const results = {
      success: false,
      migrated: { credentials: 0, applications: 0, configFields: 0, configValues: 0 },
      errors: []
    };

    try {
      await client.query('BEGIN');

      if (localStorageData.admin) {
        results.migrated.credentials = await this.migrateCredentials(client, localStorageData.admin);
      }

      if (localStorageData.applications && Array.isArray(localStorageData.applications)) {
        for (const app of localStorageData.applications) {
          try {
            const appResult = await this.migrateApplication(client, app);
            results.migrated.applications += appResult.application;
            results.migrated.configFields += appResult.configFields;
            results.migrated.configValues += appResult.configValues;
          } catch (err) {
            results.errors.push({ application: app.name, error: err.message });
          }
        }
      }

      await client.query('COMMIT');
      results.success = true;
    } catch (error) {
      await client.query('ROLLBACK');
      results.errors.push({ phase: 'transaction', error: error.message });
    } finally {
      client.release();
    }

    return results;
  }

  async migrateCredentials(client, adminData) {
    const { username, password } = adminData;
    const checkResult = await client.query('SELECT id FROM admin_credentials WHERE username = $1', [username]);

    if (checkResult.rows.length > 0) {
      await client.query('UPDATE admin_credentials SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2', [password, username]);
    } else {
      await client.query('INSERT INTO admin_credentials (username, password) VALUES ($1, $2)', [username, password]);
    }
    return 1;
  }

  async migrateApplication(client, appData) {
    const result = { application: 0, configFields: 0, configValues: 0 };
    const appId = await this.upsertApplication(client, appData);
    result.application = 1;

    if (appData.configFields && Array.isArray(appData.configFields)) {
      await client.query('DELETE FROM application_config_fields WHERE application_id = $1', [appId]);
      for (let i = 0; i < appData.configFields.length; i++) {
        await this.insertConfigField(client, appId, appData.configFields[i], i);
        result.configFields++;
      }
    }

    if (appData.config && typeof appData.config === 'object') {
      await client.query('DELETE FROM application_config WHERE application_id = $1', [appId]);
      for (const [key, value] of Object.entries(appData.config)) {
        await this.insertConfigValue(client, appId, key, value);
        result.configValues++;
      }
    }

    return result;
  }

  async upsertApplication(client, appData) {
    const { id, name, description, icon, enabled, connectionType, externalUrl } = appData;
    let checkQuery = id ? 'SELECT id FROM applications WHERE id = $1' : 'SELECT id FROM applications WHERE name = $1';
    let checkParams = [id || name];
    const checkResult = await client.query(checkQuery, checkParams);

    if (checkResult.rows.length > 0) {
      const appId = checkResult.rows[0].id;
      await client.query(
        'UPDATE applications SET name=$1, description=$2, icon=$3, enabled=$4, connection_type=$5, external_url=$6 WHERE id=$7',
        [name, description, icon, enabled, connectionType, externalUrl, appId]
      );
      return appId;
    } else {
      const result = id
        ? await client.query('INSERT INTO applications (id, name, description, icon, enabled, connection_type, external_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            [id, name, description, icon, enabled, connectionType, externalUrl])
        : await client.query('INSERT INTO applications (name, description, icon, enabled, connection_type, external_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [name, description, icon, enabled, connectionType, externalUrl]);
      return result.rows[0].id;
    }
  }

  async insertConfigField(client, appId, field, order) {
    await client.query(
      'INSERT INTO application_config_fields (application_id, field_key, label, field_type, required, placeholder, help_text, field_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [appId, field.key, field.label, field.type, field.required || false, field.placeholder || null, field.helpText || null, order]
    );
  }

  async insertConfigValue(client, appId, key, value) {
    const sensitiveKeys = ['password', 'apikey', 'token', 'secret', 'key'];
    const isSensitive = sensitiveKeys.some(k => key.toLowerCase().includes(k));
    await client.query(
      'INSERT INTO application_config (application_id, config_key, config_value, is_sensitive) VALUES ($1,$2,$3,$4)',
      [appId, key, value, isSensitive]
    );
  }

  async checkStatus() {
    const queries = {
      credentials: 'SELECT COUNT(*) FROM admin_credentials',
      applications: 'SELECT COUNT(*) FROM applications',
      configFields: 'SELECT COUNT(*) FROM application_config_fields',
      configValues: 'SELECT COUNT(*) FROM application_config'
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const result = await this.pool.query(query);
      results[key] = parseInt(result.rows[0].count);
    }
    return { success: true, counts: results };
  }

  async exportData() {
    const credResult = await this.pool.query('SELECT username, password FROM admin_credentials ORDER BY id DESC LIMIT 1');
    const appsResult = await this.pool.query('SELECT * FROM v_applications_full ORDER BY name');
    return { success: true, data: { admin: credResult.rows[0] || null, applications: appsResult.rows } };
  }
}

const migrationService = new MigrationService(pool);

app.post('/api/migration/execute', async (req, res) => {
  try {
    const localStorageData = req.body;
    if (!localStorageData) {
      return res.status(400).json({ success: false, error: 'Aucune donnée fournie' });
    }
    const result = await migrationService.migrate(localStorageData);
    res.json(result);
  } catch (error) {
    console.error('Erreur migration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/migration/status', async (req, res) => {
  try {
    const status = await migrationService.checkStatus();
    res.json(status);
  } catch (error) {
    console.error('Erreur statut migration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/migration/export', async (req, res) => {
  try {
    const data = await migrationService.exportData();
    res.json(data);
  } catch (error) {
    console.error('Erreur export:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/migration/test-connection', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Connexion réussie à PostgreSQL' });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

EOF

# Trouver la ligne où insérer (après les middlewares)
LINE_NUMBER=$(grep -n "// Health check" api/server.js | head -1 | cut -d: -f1)

if [ -z "$LINE_NUMBER" ]; then
    echo -e "${RED}✗${NC} Impossible de trouver le point d'insertion"
    echo -e "${YELLOW}⚠${NC}  Ajoutez les routes manuellement (voir API_MIGRATION_SETUP.md)"
    exit 1
fi

# Insérer les routes
echo -e "${BLUE}→${NC} Ajout des routes de migration..."
{
    head -n $((LINE_NUMBER - 1)) api/server.js
    cat /tmp/migration_routes.js
    tail -n +$LINE_NUMBER api/server.js
} > api/server.js.new

mv api/server.js.new api/server.js
rm /tmp/migration_routes.js

echo -e "${GREEN}✓${NC} Routes de migration ajoutées avec succès"

# Vérification
echo -e "\n${BLUE}→${NC} Vérification..."
if grep -q "POST /api/migration/execute" api/server.js; then
    echo -e "${GREEN}✓${NC} Routes correctement ajoutées"
else
    echo -e "${RED}✗${NC} Erreur lors de l'ajout des routes"
    echo -e "${YELLOW}⚠${NC}  Restaurez la sauvegarde et ajoutez manuellement"
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Configuration terminée !${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Prochaines étapes :${NC}"
echo -e "  1. Redémarrez le serveur backend : ${GREEN}npm run dev${NC}"
echo -e "  2. Testez la connexion : ${GREEN}curl -X POST http://localhost:3001/api/migration/test-connection${NC}"
echo -e "  3. Utilisez l'interface : ${GREEN}Paramètres > Migration${NC}\n"

echo -e "${YELLOW}Note :${NC} Une sauvegarde a été créée dans api/server.js.backup.*"
