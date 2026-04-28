# 🔧 Configuration de l'API de Migration

## ⚠️ Important

Pour que la migration fonctionne depuis l'interface d'admin, vous devez ajouter les routes de migration au serveur backend.

---

## 📝 Instructions

### Ouvrez le fichier `api/server.js`

Ajoutez le code suivant **après les imports et avant les routes existantes** (vers la ligne 42) :

```javascript
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

// Créer l'instance du service de migration
const migrationService = new MigrationService(pool);

/**
 * POST /api/migration/execute - Exécuter la migration
 */
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

/**
 * GET /api/migration/status - Vérifier l'état de la base
 */
app.get('/api/migration/status', async (req, res) => {
  try {
    const status = await migrationService.checkStatus();
    res.json(status);
  } catch (error) {
    console.error('Erreur statut migration:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/migration/export - Exporter depuis PostgreSQL
 */
app.get('/api/migration/export', async (req, res) => {
  try {
    const data = await migrationService.exportData();
    res.json(data);
  } catch (error) {
    console.error('Erreur export:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/migration/test-connection - Tester la connexion
 */
app.post('/api/migration/test-connection', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Connexion réussie à PostgreSQL' });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🎯 Emplacement dans le fichier

Ajoutez ce code **juste avant** cette section :

```javascript
// ==========================================
// Health check
// ==========================================
app.get('/health', (req, res) => {
```

Ou **juste après** les middlewares :

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// AJOUTER LE CODE ICI ⬆️
```

---

## ✅ Vérification

Après avoir ajouté le code :

1. **Redémarrez le serveur backend** :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

2. **Vérifiez que les routes sont accessibles** :
   ```bash
   # Test de connexion
   curl -X POST http://localhost:3001/api/migration/test-connection
   
   # Devrait retourner :
   # {"success":true,"message":"Connexion réussie à PostgreSQL"}
   ```

3. **Testez le statut** :
   ```bash
   curl http://localhost:3001/api/migration/status
   
   # Devrait retourner :
   # {"success":true,"counts":{"credentials":1,"applications":0,...}}
   ```

---

## 🖥️ Interface d'Admin

Une fois les routes configurées, l'interface est déjà prête :

1. Connectez-vous en tant qu'admin
2. Allez dans **Paramètres**
3. Cliquez sur l'onglet **Migration**
4. Vous verrez :
   - ✅ Export localStorage en JSON
   - ✅ Vérifier le statut PostgreSQL
   - ✅ Lancer la migration

---

## 🆘 Problèmes ?

### Erreur : "Route non trouvée"

- Vérifiez que le code est bien ajouté dans `api/server.js`
- Redémarrez le serveur backend
- Vérifiez les logs du serveur

### Erreur : "Connexion échouée"

- PostgreSQL doit être démarré :
  ```bash
  docker-compose up -d postgres
  ```

- Vérifiez les variables d'environnement dans `.env`

### Les tables n'existent pas

- Initialisez la base de données :
  ```bash
  cd database
  ./init-migration.sh
  ```

---

## 📚 Ressources

- Guide complet : `MIGRATION_GUIDE.md`
- Guide rapide : `QUICK_MIGRATION.md`
- Schéma SQL : `database/schema.sql`

---

**Une fois configuré, vous pourrez lancer la migration directement depuis l'interface d'administration ! 🎉**
