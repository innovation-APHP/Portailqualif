# ⚡ Migration Rapide - localStorage → PostgreSQL

## 🎯 En 5 minutes

### 1️⃣ Prérequis (1 min)

```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d postgres

# Vérifier que c'est bien démarré
docker ps | grep postgres
```

### 2️⃣ Initialiser la Base (2 min)

```bash
# Rendre le script exécutable
chmod +x database/init-migration.sh

# Lancer le script
cd database
./init-migration.sh

# Dans le menu, choisir :
# → 1) Installation complète
```

### 3️⃣ Sauvegarder vos Données (1 min)

1. Interface Web → **Paramètres**
2. Onglet **Migration**
3. Cliquer **"Exporter en JSON"**
4. Conserver le fichier téléchargé

### 4️⃣ Migrer (1 min)

1. Toujours dans **Paramètres > Migration**
2. Cliquer **"Lancer la Migration"**
3. Vérifier le résultat : ✅ Migration réussie

### 5️⃣ Vérifier (30 sec)

Cliquer **"Vérifier le statut"** et consulter les statistiques.

---

## 📁 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `database/schema.sql` | Schéma PostgreSQL normalisé |
| `database/init-migration.sh` | Script d'initialisation interactif |
| `api/migration.service.ts` | Service de migration backend |
| `api/routes/migration.ts` | Routes API Express |
| `src/app/components/DataMigration.tsx` | Interface React de migration |
| `MIGRATION_GUIDE.md` | Guide complet (ce fichier) |

---

## 🆘 Problème ?

### PostgreSQL ne démarre pas
```bash
docker-compose logs postgres
```

### Script bash bloqué
```bash
# Alternative manuelle :
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE quality_portal;"
psql -h localhost -U postgres -d quality_portal -f database/schema.sql
```

### Migration échoue
- Vérifier que le backend est démarré
- Consulter la console navigateur (F12)
- Voir les logs backend

---

## ✅ C'est Fait !

Vos données sont maintenant dans PostgreSQL 🎉

**Prochaine étape** : Configurer votre application pour utiliser PostgreSQL au lieu du localStorage.

Voir `MIGRATION_GUIDE.md` pour plus de détails.
