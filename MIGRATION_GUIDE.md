# 🔄 Guide de Migration - localStorage vers PostgreSQL

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la migration complète de vos données depuis le **localStorage** du navigateur vers une **base de données PostgreSQL** normalisée.

### Pourquoi migrer ?

| localStorage | PostgreSQL |
|--------------|------------|
| ❌ Limité au navigateur | ✅ Centralisé |
| ❌ Données volatiles | ✅ Persistant |
| ❌ Mono-utilisateur | ✅ Multi-utilisateurs |
| ❌ Pas de requêtes complexes | ✅ SQL complet |
| ❌ ~5-10 MB max | ✅ Illimité |

---

## 🎯 Prérequis

### 1. PostgreSQL installé et accessible

**Via Docker (recommandé)** :
```bash
docker-compose up -d postgres
```

**Installation native** :
- **Ubuntu/Debian** : `sudo apt-get install postgresql`
- **macOS** : `brew install postgresql`
- **Windows** : Télécharger depuis [postgresql.org](https://www.postgresql.org/download/)

### 2. Variables d'environnement configurées

Créez un fichier `.env` à la racine :

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=quality_portal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_securise
```

### 3. Sauvegarde de vos données actuelles

**IMPORTANT** : Avant toute migration, exportez vos données !

---

## 🚀 Processus de Migration - Étape par Étape

### Étape 1 : Initialiser la Base de Données

#### Option A : Script automatique (recommandé)

```bash
cd database
chmod +x init-migration.sh
./init-migration.sh
```

Le script vous guidera pour :
- ✅ Tester la connexion PostgreSQL
- ✅ Créer la base de données
- ✅ Appliquer le schéma normalisé
- ✅ Vérifier l'installation

#### Option B : Manuelle via psql

```bash
# Se connecter à PostgreSQL
psql -h localhost -U postgres

# Créer la base de données
CREATE DATABASE quality_portal;

# Se connecter à la nouvelle base
\c quality_portal

# Appliquer le schéma
\i database/schema.sql

# Vérifier les tables créées
\dt
```

### Étape 2 : Exporter vos Données Actuelles

1. Connectez-vous en tant qu'admin
2. Allez dans **Paramètres > Migration**
3. Cliquez sur **"Exporter en JSON"**
4. Conservez le fichier téléchargé en lieu sûr

**Format du fichier exporté** :
```json
{
  "admin": {
    "username": "admin",
    "password": "votre_mot_de_passe"
  },
  "applications": [
    {
      "id": "uuid",
      "name": "SonarQube",
      "description": "Analyse de qualité du code",
      "icon": "Code",
      "enabled": true,
      "connectionType": "api",
      "configFields": [...],
      "config": {...}
    }
  ]
}
```

### Étape 3 : Vérifier le Statut de la Base de Données

Dans **Paramètres > Migration** :

1. Cliquez sur **"Vérifier le statut"**
2. Consultez les statistiques :
   - Credentials : 1 (admin par défaut)
   - Applications : 0
   - Champs Config : 0
   - Valeurs Config : 0

### Étape 4 : Lancer la Migration

⚠️ **Dernière vérification** :
- [ ] PostgreSQL est accessible
- [ ] Schéma est appliqué
- [ ] Sauvegarde JSON créée
- [ ] Backend API est démarré

**Dans l'interface** :

1. Cliquez sur **"Lancer la Migration"**
2. Attendez la fin du processus
3. Consultez le résultat détaillé

**Résultat attendu** :
```
✓ Migration réussie

Credentials    : 1
Applications   : 3
Champs Config  : 12
Valeurs Config : 15
```

### Étape 5 : Vérification Post-Migration

#### Via l'interface

Rechargez le statut de la base et comparez avec l'export JSON.

#### Via PostgreSQL

```sql
-- Vérifier les credentials
SELECT * FROM admin_credentials;

-- Vérifier les applications
SELECT id, name, enabled FROM applications;

-- Vérifier les champs de config
SELECT app.name, cf.field_key, cf.label
FROM applications app
JOIN application_config_fields cf ON app.id = cf.application_id
ORDER BY app.name, cf.field_order;

-- Vérifier les valeurs
SELECT app.name, ac.config_key, ac.config_value, ac.is_sensitive
FROM applications app
JOIN application_config ac ON app.id = ac.application_id
ORDER BY app.name, ac.config_key;

-- Vue complète (utilise la vue v_applications_full)
SELECT * FROM v_applications_full;
```

---

## 📊 Schéma de Base de Données

### Structure Normalisée

```
┌─────────────────────┐
│ admin_credentials   │
├─────────────────────┤
│ id (PK)             │
│ username (UNIQUE)   │
│ password            │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌──────────────────────────┐
│ applications             │
├──────────────────────────┤
│ id (PK, UUID)            │
│ name                     │
│ description              │
│ icon                     │
│ enabled                  │
│ connection_type          │
│ external_url             │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
         │
         │ 1:N
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌──────────────────────┐  ┌──────────────────────┐
│ application_config   │  │ application_config_  │
│ _fields              │  │                      │
├──────────────────────┤  ├──────────────────────┤
│ id (PK)              │  │ id (PK)              │
│ application_id (FK)  │  │ application_id (FK)  │
│ field_key            │  │ config_key           │
│ label                │  │ config_value         │
│ field_type           │  │ is_sensitive         │
│ required             │  │ created_at           │
│ placeholder          │  │ updated_at           │
│ help_text            │  └──────────────────────┘
│ field_order          │
│ created_at           │
└──────────────────────┘
```

### Tables et Colonnes

#### `admin_credentials`
Stockage sécurisé des identifiants administrateur.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique |
| `username` | VARCHAR(100) | Nom d'utilisateur (unique) |
| `password` | VARCHAR(255) | Mot de passe (à hasher en production) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Dernière modification |

#### `applications`
Applications configurées dans le portail.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique UUID |
| `name` | VARCHAR(255) | Nom de l'application |
| `description` | TEXT | Description |
| `icon` | VARCHAR(100) | Nom de l'icône Lucide |
| `enabled` | BOOLEAN | Application activée/désactivée |
| `connection_type` | VARCHAR(50) | 'url' ou 'api' |
| `external_url` | TEXT | URL de l'application externe |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Dernière modification |

#### `application_config_fields`
Définition des champs de configuration (schéma).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique |
| `application_id` | UUID | FK vers applications |
| `field_key` | VARCHAR(100) | Clé du champ (ex: 'apiKey') |
| `label` | VARCHAR(255) | Libellé affiché |
| `field_type` | VARCHAR(50) | Type : text, url, password, apiKey |
| `required` | BOOLEAN | Champ obligatoire ? |
| `placeholder` | TEXT | Texte d'exemple |
| `help_text` | TEXT | Aide contextuelle |
| `field_order` | INTEGER | Ordre d'affichage |
| `created_at` | TIMESTAMP | Date de création |

#### `application_config`
Valeurs de configuration réelles.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | Identifiant unique |
| `application_id` | UUID | FK vers applications |
| `config_key` | VARCHAR(100) | Clé de configuration |
| `config_value` | TEXT | Valeur |
| `is_sensitive` | BOOLEAN | Donnée sensible ? (auto-détecté) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Dernière modification |

### Vues

#### `v_applications_full`
Vue complète joignant applications + champs + valeurs.

```sql
SELECT * FROM v_applications_full WHERE enabled = true;
```

Retourne :
- Toutes les colonnes de `applications`
- `config_fields` : JSON array des champs
- `config` : JSON object des valeurs

---

## 🔧 API de Migration

### Endpoints Disponibles

#### `POST /api/migration/execute`
Exécute la migration complète.

**Body** :
```json
{
  "admin": {
    "username": "admin",
    "password": "admin123"
  },
  "applications": [...]
}
```

**Réponse** :
```json
{
  "success": true,
  "migrated": {
    "credentials": 1,
    "applications": 3,
    "configFields": 12,
    "configValues": 15
  },
  "errors": []
}
```

#### `GET /api/migration/status`
Vérifie l'état de la base de données.

**Réponse** :
```json
{
  "success": true,
  "counts": {
    "credentials": 1,
    "applications": 3,
    "configFields": 12,
    "configValues": 15
  }
}
```

#### `GET /api/migration/export`
Exporte les données depuis PostgreSQL.

**Réponse** :
```json
{
  "success": true,
  "data": {
    "admin": {...},
    "applications": [...]
  }
}
```

#### `POST /api/migration/test-connection`
Teste la connexion PostgreSQL.

**Body (optionnel)** :
```json
{
  "config": {
    "host": "localhost",
    "port": 5432,
    "database": "quality_portal",
    "user": "postgres",
    "password": "postgres"
  }
}
```

---

## ⚠️ Dépannage

### Erreur : "Connexion échouée à PostgreSQL"

**Causes possibles** :
1. PostgreSQL n'est pas démarré
2. Variables d'environnement incorrectes
3. Pare-feu bloque le port 5432
4. Permissions insuffisantes

**Solutions** :
```bash
# Vérifier que PostgreSQL tourne
docker ps | grep postgres
# ou
sudo systemctl status postgresql

# Tester la connexion manuellement
psql -h localhost -U postgres -d quality_portal

# Vérifier les logs
docker logs quality-portal-postgres
```

### Erreur : "Table does not exist"

**Solution** : Appliquer le schéma
```bash
cd database
./init-migration.sh
# Choisir option 4 : "Appliquer le schéma"
```

### Erreur : "Permission denied"

**Solution** : Vérifier les permissions
```sql
-- Accorder tous les droits (développement uniquement)
GRANT ALL PRIVILEGES ON DATABASE quality_portal TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
```

### La migration s'arrête au milieu

**Cause** : Transaction annulée par erreur.

**Solution** : Vérifier les logs dans la console et corriger les données problématiques.

### Données sensibles non masquées

Les clés API et mots de passe sont automatiquement détectés via les mots-clés :
- `password`
- `apikey`
- `token`
- `secret`
- `key`

Si un champ n'est pas détecté, il peut être marqué manuellement :
```sql
UPDATE application_config
SET is_sensitive = true
WHERE config_key = 'votre_cle';
```

---

## 🔒 Sécurité

### En Production

1. **Hasher les mots de passe** :
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Chiffrer les données sensibles** :
   ```sql
   -- Utiliser pgcrypto
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   
   UPDATE application_config
   SET config_value = pgp_sym_encrypt(config_value, 'votre_cle_chiffrement')
   WHERE is_sensitive = true;
   ```

3. **Limiter les permissions** :
   ```sql
   -- Créer un utilisateur dédié
   CREATE USER quality_portal_app WITH PASSWORD 'mot_de_passe_fort';
   
   -- Permissions minimales
   GRANT CONNECT ON DATABASE quality_portal TO quality_portal_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO quality_portal_app;
   ```

4. **SSL/TLS pour la connexion** :
   ```env
   POSTGRES_SSL=true
   POSTGRES_SSL_REJECT_UNAUTHORIZED=false
   ```

---

## 📦 Migration Inverse (PostgreSQL → localStorage)

Si vous devez revenir au localStorage :

1. **Exporter depuis PostgreSQL** :
   ```bash
   curl http://localhost:5000/api/migration/export > backup.json
   ```

2. **Importer dans le navigateur** :
   ```javascript
   // Console navigateur (F12)
   const data = /* copier le JSON */;
   
   // Restaurer admin
   localStorage.setItem('quality_portal_admin_username', data.admin.username);
   localStorage.setItem('quality_portal_admin_password', data.admin.password);
   
   // Restaurer applications
   localStorage.setItem('quality_portal_applications', JSON.stringify(data.applications));
   
   location.reload();
   ```

---

## 🎯 Checklist de Migration

- [ ] PostgreSQL installé et accessible
- [ ] Variables d'environnement configurées
- [ ] Base de données créée
- [ ] Schéma SQL appliqué
- [ ] Sauvegarde JSON des données actuelles créée
- [ ] Backend API démarré
- [ ] Test de connexion réussi
- [ ] Migration exécutée sans erreurs
- [ ] Vérification des données migrées
- [ ] Tests de l'application post-migration
- [ ] Documentation partagée avec l'équipe

---

## 📚 Ressources

- **Schéma SQL** : `database/schema.sql`
- **Script d'init** : `database/init-migration.sh`
- **Service de migration** : `api/migration.service.ts`
- **Routes API** : `api/routes/migration.ts`
- **Interface React** : `src/app/components/DataMigration.tsx`

---

**Version** : 1.0.0
**Date** : 2026-04-28
**Auteur** : Équipe Portail Qualité

✨ **Votre migration est maintenant prête !**
