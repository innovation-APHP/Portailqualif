# 🔄 Système de Migration Complet

## 📦 Contenu du Package de Migration

Système complet de migration **localStorage → PostgreSQL** avec interface graphique, API backend, et outils en ligne de commande.

---

## 📁 Fichiers Créés

### 1. Base de Données

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| `database/schema.sql` | Schéma SQL normalisé complet | Import automatique ou manuel |
| `database/init-migration.sh` | Script bash interactif | `./init-migration.sh` |

**Schéma inclut** :
- ✅ 4 tables normalisées
- ✅ Triggers pour `updated_at`
- ✅ Indexes optimisés
- ✅ Vue agrégée `v_applications_full`
- ✅ Commentaires SQL
- ✅ Données initiales (admin par défaut)

### 2. Backend API

| Fichier | Description | Routes |
|---------|-------------|--------|
| `api/migration.service.ts` | Service de migration TypeScript | Classes et méthodes |
| `api/routes/migration.ts` | Routes Express | `/api/migration/*` |

**API Endpoints** :
- `POST /api/migration/execute` - Migrer les données
- `GET /api/migration/status` - Vérifier l'état
- `GET /api/migration/export` - Exporter depuis PostgreSQL
- `POST /api/migration/test-connection` - Tester la connexion

### 3. Interface React

| Fichier | Description | Localisation |
|---------|-------------|--------------|
| `src/app/components/DataMigration.tsx` | Interface de migration | Paramètres > Migration |
| `src/app/components/SettingsPage.tsx` | Page paramètres (modifiée) | Ajout onglet Migration |

**Fonctionnalités UI** :
- ✅ Export localStorage en JSON
- ✅ Migration vers PostgreSQL
- ✅ Vérification du statut DB
- ✅ Affichage des résultats détaillés
- ✅ Gestion des erreurs

### 4. Outils CLI

| Fichier | Description | Usage |
|---------|-------------|-------|
| `Makefile.migration` | Commandes Make | `make -f Makefile.migration help` |

**Commandes disponibles** :
```bash
make -f Makefile.migration migration-init      # Initialiser
make -f Makefile.migration migration-status    # Statistiques
make -f Makefile.migration migration-backup    # Sauvegarder
make -f Makefile.migration migration-apps      # Lister apps
make -f Makefile.migration migration-docker-start  # Démarrer Docker
```

### 5. Documentation

| Fichier | Type | Pour qui |
|---------|------|----------|
| `MIGRATION_GUIDE.md` | Guide complet | Tous (référence) |
| `QUICK_MIGRATION.md` | Guide rapide 5 min | Débutants |
| `MIGRATION_README.md` | Ce fichier | Vue d'ensemble |

---

## 🚀 Démarrage Rapide

### Option 1 : Interface Graphique (Recommandé)

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d postgres

# 2. Initialiser la base
cd database
./init-migration.sh
# Choisir : 1) Installation complète

# 3. Interface Web
# → Paramètres > Migration
# → "Exporter en JSON" (sauvegarde)
# → "Lancer la Migration"
```

### Option 2 : Ligne de Commande

```bash
# 1. Démarrer PostgreSQL
make -f Makefile.migration migration-docker-start

# 2. Initialiser
make -f Makefile.migration migration-init-auto

# 3. Vérifier
make -f Makefile.migration migration-status

# 4. Migrer via API
curl -X POST http://localhost:5000/api/migration/execute \
  -H "Content-Type: application/json" \
  -d @backup.json
```

---

## 🏗️ Architecture

### Schéma Relationnel

```
admin_credentials (1)
    └─ username, password

applications (1:N)
    ├─ id, name, icon, enabled, type
    │
    ├─→ application_config_fields (N)
    │       └─ key, label, type, required, order
    │
    └─→ application_config (N)
            └─ key, value, is_sensitive
```

### Flux de Migration

```
┌──────────────┐
│ localStorage │
└──────┬───────┘
       │ Collecte (Frontend)
       ▼
┌──────────────┐
│  JSON Data   │
└──────┬───────┘
       │ POST /api/migration/execute
       ▼
┌──────────────┐
│ Migration    │ ◄── migration.service.ts
│ Service      │
└──────┬───────┘
       │ SQL Transactions
       ▼
┌──────────────┐
│ PostgreSQL   │
│  (Normalisé) │
└──────────────┘
```

---

## 🎯 Cas d'Usage

### 1. Migration Initiale

```bash
# Prérequis
export POSTGRES_PASSWORD=mon_mot_de_passe

# Init base
make -f Makefile.migration migration-init-auto

# Export localStorage (via UI)
# → Paramètres > Migration > Exporter en JSON

# Migrer
# → Paramètres > Migration > Lancer la Migration
```

### 2. Sauvegarde Régulière

```bash
# Sauvegarde SQL
make -f Makefile.migration migration-backup

# Export JSON via API
make -f Makefile.migration migration-export
```

### 3. Restauration

```bash
# Depuis SQL
make -f Makefile.migration migration-restore
# Entrer : backups/quality_portal_20260428_143000.sql

# Depuis JSON (console navigateur)
# Voir MIGRATION_GUIDE.md section "Migration Inverse"
```

### 4. Debugging

```bash
# Voir les stats
make -f Makefile.migration migration-status

# Lister les apps
make -f Makefile.migration migration-apps

# Voir toute la config
make -f Makefile.migration migration-config

# Logs Docker
make -f Makefile.migration migration-docker-logs
```

---

## 📊 Tables et Données

### admin_credentials
```sql
SELECT * FROM admin_credentials;
```
| id | username | password | created_at | updated_at |
|----|----------|----------|------------|------------|
| 1  | admin    | admin123 | ...        | ...        |

### applications
```sql
SELECT * FROM applications;
```
| id (UUID) | name | enabled | connection_type | ... |
|-----------|------|---------|-----------------|-----|
| abc-123   | SonarQube | true | api | ... |

### application_config_fields
```sql
SELECT app.name, cf.*
FROM application_config_fields cf
JOIN applications app ON cf.application_id = app.id;
```

### application_config
```sql
SELECT app.name, ac.*
FROM application_config ac
JOIN applications app ON ac.application_id = app.id;
```

---

## 🔧 Configuration

### Variables d'Environnement

Créer `.env` :
```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quality_portal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_securise

# API Backend
API_PORT=5000
NODE_ENV=development

# Sécurité (production)
POSTGRES_SSL=true
ENCRYPT_SECRETS=true
```

### Docker Compose

Déjà configuré dans `docker-compose.yml` :
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: quality_portal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

---

## 🛡️ Sécurité

### Développement

✅ Mots de passe en clair (localStorage)
✅ HTTP sans SSL
✅ Credentials par défaut : admin/admin123

### Production

⚠️ **À FAIRE AVANT DE DÉPLOYER** :

1. **Hasher les passwords** :
   ```typescript
   import bcrypt from 'bcrypt';
   const hash = await bcrypt.hash(password, 10);
   ```

2. **Chiffrer les valeurs sensibles** :
   ```sql
   CREATE EXTENSION pgcrypto;
   UPDATE application_config
   SET config_value = pgp_sym_encrypt(config_value, 'key')
   WHERE is_sensitive = true;
   ```

3. **SSL/TLS activé** :
   ```env
   POSTGRES_SSL=true
   ```

4. **Permissions limitées** :
   ```sql
   CREATE USER app_user WITH PASSWORD 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO app_user;
   ```

---

## 📈 Performance

### Indexes Créés

```sql
-- Recherche rapide
CREATE INDEX idx_admin_username ON admin_credentials(username);
CREATE INDEX idx_app_name ON applications(name);
CREATE INDEX idx_app_enabled ON applications(enabled);

-- Jointures optimisées
CREATE INDEX idx_config_fields_app ON application_config_fields(application_id);
CREATE INDEX idx_app_config_app ON application_config(application_id);

-- Contraintes uniques
CREATE UNIQUE INDEX idx_config_fields_unique ON application_config_fields(application_id, field_key);
CREATE UNIQUE INDEX idx_app_config_unique ON application_config(application_id, config_key);
```

### Vue Optimisée

```sql
-- Vue précompilée avec agrégation JSON
CREATE VIEW v_applications_full AS
SELECT
  a.*,
  json_agg(cf.*) FILTER (WHERE cf.id IS NOT NULL) as config_fields,
  json_object_agg(ac.config_key, ac.config_value) FILTER (WHERE ac.id IS NOT NULL) as config
FROM applications a
LEFT JOIN application_config_fields cf ON a.id = cf.application_id
LEFT JOIN application_config ac ON a.id = ac.application_id
GROUP BY a.id;
```

---

## ✅ Checklist Complète

### Installation

- [ ] PostgreSQL installé (Docker ou natif)
- [ ] `psql` client disponible
- [ ] Dépendances Node.js installées (`pnpm add pg @types/pg`)
- [ ] Variables d'environnement configurées (`.env`)

### Initialisation

- [ ] Base de données créée
- [ ] Schéma SQL appliqué
- [ ] Tables vérifiées (`\dt`)
- [ ] Vue `v_applications_full` créée

### Migration

- [ ] Sauvegarde localStorage en JSON créée
- [ ] Backend API démarré
- [ ] Route `/api/migration/execute` accessible
- [ ] Migration exécutée avec succès
- [ ] Données vérifiées dans PostgreSQL

### Post-Migration

- [ ] Application fonctionne avec PostgreSQL
- [ ] Credentials admin fonctionnels
- [ ] Applications visibles et configurées
- [ ] Sauvegarde SQL créée

### Production (optionnel)

- [ ] Passwords hashés (bcrypt)
- [ ] Secrets chiffrés (pgcrypto)
- [ ] SSL activé
- [ ] Permissions utilisateur limitées
- [ ] Backups automatisés configurés

---

## 📚 Ressources et Liens

### Documentation

- Guide complet : `MIGRATION_GUIDE.md`
- Guide rapide : `QUICK_MIGRATION.md`
- Base de données : `DATABASE_GUIDE.md`

### Fichiers Techniques

- Schéma SQL : `database/schema.sql`
- Service migration : `api/migration.service.ts`
- Routes API : `api/routes/migration.ts`
- Interface UI : `src/app/components/DataMigration.tsx`

### Commandes

```bash
# Aide Make
make -f Makefile.migration help

# Script interactif
./database/init-migration.sh

# Documentation API
curl http://localhost:5000/api/migration/status
```

---

## 🆘 Support

### Problèmes Fréquents

**Q : La migration échoue avec "connection refused"**
```bash
# Vérifier PostgreSQL
docker ps | grep postgres
make -f Makefile.migration migration-test
```

**Q : Tables non créées**
```bash
# Réappliquer le schéma
make -f Makefile.migration migration-init-auto
```

**Q : Données manquantes après migration**
```bash
# Vérifier le statut
make -f Makefile.migration migration-status

# Consulter les logs
make -f Makefile.migration migration-docker-logs
```

### Logs et Debug

```bash
# Backend API logs
npm run dev  # ou pnpm dev

# PostgreSQL logs
docker-compose logs -f postgres

# Console navigateur
# F12 > Console (voir les erreurs frontend)
```

---

## 🎉 Prochaines Étapes

1. ✅ **Migration terminée**
2. → Configurer l'application pour utiliser PostgreSQL
3. → Mettre en place des backups automatiques
4. → Implémenter l'authentification JWT (optionnel)
5. → Déployer en production avec SSL

---

**Version** : 1.0.0
**Date** : 2026-04-28
**Compatibilité** : PostgreSQL 12+, Node.js 18+, React 18+

🚀 **Votre système de migration est prêt !**
