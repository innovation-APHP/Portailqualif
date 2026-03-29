# 🚀 Quick Start - Docker Deployment

## ⚡ Démarrage en 3 minutes

### 1️⃣ Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer (changez au moins le mot de passe)
nano .env
```

**Minimum requis dans .env :**
```bash
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
```

### 2️⃣ Démarrage

```bash
# Avec Docker Compose
docker-compose up -d

# OU avec Make (plus simple)
make up
```

### 3️⃣ Accès

- **Application :** http://localhost:8080
- **API :** http://localhost:3001/health

---

## 📋 Commandes essentielles

### Avec Make (recommandé)

```bash
make up          # Démarrer
make down        # Arrêter
make logs        # Voir les logs
make ps          # Status
make restart     # Redémarrer
make backup      # Sauvegarder la DB
make help        # Voir toutes les commandes
```

### Avec Docker Compose

```bash
docker-compose up -d              # Démarrer
docker-compose down               # Arrêter
docker-compose logs -f            # Logs
docker-compose ps                 # Status
docker-compose restart web        # Redémarrer un service
```

---

## 🔧 Services

| Service | Port | Description |
|---------|------|-------------|
| **web** | 8080 | Application React |
| **api** | 3001 | Backend Node.js |
| **postgres** | 5432 | Base de données |
| **pgadmin** | 5050 | Admin DB (optionnel) |

---

## 🐛 Dépannage rapide

### Les services ne démarrent pas ?

```bash
# Voir les logs
docker-compose logs

# Vérifier les ports
netstat -tulpn | grep -E '8080|3001|5432'

# Rebuild
docker-compose down
docker-compose up -d --build
```

### L'application ne charge pas ?

```bash
# Vérifier le health check
curl http://localhost:8080/health
curl http://localhost:3001/health

# Redémarrer
make restart
```

### Erreur de connexion à la base ?

```bash
# Vérifier PostgreSQL
docker-compose logs postgres

# Tester la connexion
docker exec -it quality-portal-db pg_isready -U quality_user
```

---

## 📊 Base de données

### Accès direct

```bash
# Avec Make
make db-shell

# Avec Docker
docker exec -it quality-portal-db psql -U quality_user -d quality_portal
```

### Commandes utiles

```bash
\dt                    # Lister les tables
\d metrics_snapshots   # Décrire une table
SELECT * FROM alerts;  # Requête SQL
\q                     # Quitter
```

### Statistiques

```bash
# Avec Make
make db-stats
make db-count

# Manuellement
docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
  -c "SELECT * FROM get_metrics_stats();"
```

---

## 💾 Backup

### Backup manuel

```bash
# Avec Make
make backup

# Manuellement
docker exec quality-portal-db pg_dump -U quality_user quality_portal | \
  gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore

```bash
# Avec Make
make restore FILE=backup_20260329.sql.gz

# Manuellement
gunzip < backup.sql.gz | \
  docker exec -i quality-portal-db psql -U quality_user quality_portal
```

---

## 🔒 Sécurité

### Checklist minimale

- [ ] **Changer le mot de passe PostgreSQL** dans `.env`
- [ ] **Ne pas exposer les ports** sur Internet sans firewall
- [ ] **Activer HTTPS** en production (reverse proxy)
- [ ] **Sauvegarder régulièrement** (cron)

### Production

```bash
# Variables d'environnement
export POSTGRES_PASSWORD="motdepasse_securise"
export WEB_PORT=8080

# Démarrage
docker-compose up -d

# Vérifier
make health
```

---

## 📚 Documentation complète

- **Déploiement détaillé :** [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
- **Architecture système :** [DATABASE_README.md](DATABASE_README.md)
- **Référence API :** [DATABASE_API_REFERENCE.md](DATABASE_API_REFERENCE.md)

---

## 🆘 Besoin d'aide ?

```bash
# Générer un rapport
make logs > rapport.log
make ps >> rapport.log
docker version >> rapport.log
```

---

## ✅ Vérification finale

```bash
# Tout doit être vert ✅
make health

# Output attendu :
# 🏥 Health checks :
#   ✅ Web : OK
#   ✅ API : OK
```

---

**🎉 Félicitations ! Votre portail qualité est opérationnel.**

**Prochaines étapes :**
1. Configurer vos APIs (SonarQube, ZAP, Wazuh) dans Paramètres
2. Créer vos premières alertes
3. Consulter les métriques dans l'interface

---

**Support :** Consultez [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) pour plus de détails.
