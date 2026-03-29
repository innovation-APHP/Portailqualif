# 🎉 Déploiement Docker - Installation Terminée !

## ✅ Ce qui a été créé pour votre déploiement Docker

Votre portail qualité est maintenant prêt pour un déploiement Docker complet avec PostgreSQL !

### 📦 Fichiers créés

#### Configuration Docker

```
✅ Dockerfile                       - Image Docker frontend (React + Nginx)
✅ docker-compose.yml               - Orchestration des services
✅ .env.example                     - Template de configuration
✅ .dockerignore                    - Optimisation du build
✅ .gitignore                       - Fichiers à ignorer

✅ api/
   ├── Dockerfile                   - Image Docker backend (Node.js)
   ├── server.js                    - Serveur API REST Express
   └── package.json                 - Dépendances Node.js

✅ docker/
   ├── nginx.conf                   - Configuration Nginx
   ├── entrypoint.sh                - Script de démarrage
   └── init-db.sql                  - Initialisation PostgreSQL
```

#### Documentation

```
✅ README.md                        - Documentation principale
✅ DOCKER_QUICKSTART.md             - Démarrage rapide (3 min)
✅ DOCKER_DEPLOYMENT.md             - Guide complet de déploiement
✅ DATABASE_README.md               - Architecture base de données
✅ DATABASE_GUIDE.md                - Guide utilisateur
✅ DATABASE_API_REFERENCE.md        - Référence API développeur
```

#### Outils

```
✅ Makefile                         - Commandes simplifiées
✅ validate-deployment.sh           - Script de validation
```

---

## 🚀 Démarrage en 3 étapes

### 1️⃣ Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

**Minimum requis :**
```bash
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
```

### 2️⃣ Démarrage

```bash
# Avec Docker Compose
docker-compose up -d

# OU avec Make (plus simple)
make up

# OU avec le script de validation
chmod +x validate-deployment.sh
./validate-deployment.sh
```

### 3️⃣ Accès

- **Application Web :** http://localhost:8080
- **API Backend :** http://localhost:3001/health
- **pgAdmin (optionnel) :** http://localhost:5050

---

## 🏗️ Architecture déployée

```
┌─────────────────────────────────────────────────┐
│  Container: quality-portal-web                  │
│  - Nginx servant l'application React            │
│  - Port: 8080 → 80                              │
│  - Health check: /health                        │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Container: quality-portal-api                  │
│  - Node.js + Express                            │
│  - API REST pour PostgreSQL                     │
│  - Port: 3001                                   │
│  - Health check: /health                        │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│  Container: quality-portal-db                   │
│  - PostgreSQL 16                                │
│  - Port: 5432                                   │
│  - Volume persistant: postgres_data             │
│  - Tables: metrics_snapshots, alerts, triggers  │
└─────────────────────────────────────────────────┘

Optional:
┌─────────────────────────────────────────────────┐
│  Container: quality-portal-pgadmin              │
│  - pgAdmin 4                                    │
│  - Port: 5050                                   │
│  - Activé avec: --profile admin                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 Services Docker

| Service | Port | Description | Accès |
|---------|------|-------------|-------|
| **web** | 8080 | Application React + Nginx | http://localhost:8080 |
| **api** | 3001 | Backend Node.js/Express | http://localhost:3001 |
| **postgres** | 5432 | Base de données PostgreSQL | psql ou pgAdmin |
| **pgadmin** | 5050 | Interface admin PostgreSQL | http://localhost:5050 |

---

## 🔧 Configuration

### Variables d'environnement (.env)

**Base de données (requis) :**
```bash
POSTGRES_DB=quality_portal
POSTGRES_USER=quality_user
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!  # ⚠️ À CHANGER !
POSTGRES_PORT=5432
```

**Application :**
```bash
WEB_PORT=8080
API_PORT=3001
```

**APIs externes (optionnel) :**
```bash
# SonarQube
SONARQUBE_URL=https://votre-sonarqube.com
SONARQUBE_TOKEN=votre_token

# OWASP ZAP
ZAP_URL=http://votre-zap:8080
ZAP_API_KEY=votre_api_key

# Wazuh
WAZUH_URL=https://votre-wazuh.com
WAZUH_USER=admin
WAZUH_PASSWORD=votre_password
```

---

## 🎯 Commandes essentielles

### Avec Make (recommandé)

```bash
# Démarrage
make up              # Démarrer tous les services
make up-admin        # Démarrer avec pgAdmin

# Gestion
make down            # Arrêter
make restart         # Redémarrer
make logs            # Voir les logs
make ps              # Status des services

# Base de données
make db-shell        # Shell PostgreSQL
make db-stats        # Statistiques
make db-count        # Compter les entrées
make backup          # Sauvegarder

# Développement
make rebuild         # Rebuild complet
make shell-web       # Shell conteneur web
make shell-api       # Shell conteneur API

# Vérification
make health          # Health checks
make test-api        # Tester l'API

# Aide
make help            # Voir toutes les commandes
```

### Avec Docker Compose

```bash
docker-compose up -d              # Démarrer
docker-compose down               # Arrêter
docker-compose logs -f            # Logs
docker-compose ps                 # Status
docker-compose restart web        # Redémarrer un service
docker-compose --profile admin up -d  # Avec pgAdmin
```

---

## 🗄️ Base de données PostgreSQL

### Tables créées automatiquement

1. **`metrics_snapshots`** - Historique des métriques
   - Snapshots périodiques (bugs, coverage, vulnerabilities, etc.)
   - Index optimisés pour les recherches

2. **`alerts`** - Alertes configurées
   - Conditions et seuils
   - Canaux de notification

3. **`alert_triggers`** - Historique des déclenchements
   - Tracking des alertes
   - Accusé de réception

### Fonctions SQL disponibles

- `cleanup_old_metrics(days)` - Nettoie les vieux snapshots
- `get_metrics_stats()` - Statistiques par source

### Vues SQL disponibles

- `active_alerts_summary` - Résumé des alertes actives

### Accès direct

```bash
# Shell PostgreSQL
docker exec -it quality-portal-db psql -U quality_user -d quality_portal

# Commandes utiles
\dt                           # Lister les tables
\d metrics_snapshots          # Décrire une table
SELECT * FROM alerts;         # Requête SQL
SELECT * FROM get_metrics_stats();  # Statistiques
\q                            # Quitter
```

---

## 🔐 Sécurité

### Checklist de base

- [x] Architecture Docker multi-conteneurs
- [x] Réseau Docker isolé
- [x] Variables d'environnement pour les secrets
- [x] Health checks pour tous les services
- [ ] **À FAIRE : Changer le mot de passe PostgreSQL**
- [ ] **À FAIRE : Activer HTTPS en production**
- [ ] **À FAIRE : Configurer le pare-feu**
- [ ] **À FAIRE : Mettre en place les backups automatiques**

### Production

Pour la production, ajoutez :

1. **Reverse proxy (Nginx/Traefik) avec HTTPS**
2. **Firewall restrictif**
3. **Backup automatique (cron)**
4. **Monitoring (Prometheus/Grafana)**
5. **Logs centralisés (ELK/Loki)**

Voir **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** pour les détails.

---

## 💾 Backup

### Manuel

```bash
# Backup PostgreSQL
make backup

# Backup volumes
make backup-volumes

# Manuellement
docker exec quality-portal-db pg_dump -U quality_user quality_portal | \
  gzip > backup_$(date +%Y%m%d).sql.gz
```

### Automatique (cron)

```bash
# Éditer le crontab
crontab -e

# Ajouter (backup quotidien à 2h du matin)
0 2 * * * cd /path/to/quality-portal && make backup
```

### Restauration

```bash
# Avec Make
make restore FILE=backup_20260329.sql.gz

# Manuellement
gunzip < backup.sql.gz | \
  docker exec -i quality-portal-db psql -U quality_user quality_portal
```

---

## 🐛 Dépannage

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier les ports utilisés
netstat -tulpn | grep -E '8080|3001|5432'

# Rebuild complet
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Erreur de connexion PostgreSQL

```bash
# Vérifier PostgreSQL
docker-compose logs postgres

# Tester la connexion
docker exec -it quality-portal-db pg_isready -U quality_user

# Vérifier les credentials
source .env
echo $POSTGRES_PASSWORD
```

### L'API ne répond pas

```bash
# Logs API
docker-compose logs -f api

# Health check
curl http://localhost:3001/health

# Redémarrer
docker-compose restart api
```

### Problème de build

```bash
# Nettoyer Docker
docker system prune -f
docker volume prune -f

# Rebuild
docker-compose build --no-cache --pull
```

---

## 📈 Monitoring

### Health checks

```bash
# Tous les services
make health

# Manuellement
curl http://localhost:8080/health    # Web
curl http://localhost:3001/health    # API
```

### Logs

```bash
# Temps réel
make logs

# Par service
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f postgres
```

### Ressources

```bash
# Utilisation
docker stats

# Détails
docker-compose ps
```

---

## 🚀 Prochaines étapes

### 1. Tester le déploiement

```bash
# Validation complète
chmod +x validate-deployment.sh
./validate-deployment.sh

# Ou manuellement
docker-compose up -d
make health
```

### 2. Configurer l'application

1. Accéder à http://localhost:8080
2. Aller dans **Paramètres**
3. Configurer vos APIs :
   - SonarQube (URL + Token)
   - OWASP ZAP (URL + API Key)
   - Wazuh (URL + Credentials)

### 3. Tester la base de données

1. La base PostgreSQL est **automatiquement activée** en mode Docker
2. Créer des snapshots de test
3. Configurer des alertes
4. Vérifier l'historique

### 4. Mettre en production

- Lire **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)**
- Configurer HTTPS
- Activer les backups automatiques
- Mettre en place le monitoring

---

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| **[README.md](README.md)** | Documentation principale |
| **[DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)** | Démarrage rapide (3 min) |
| **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** | Guide complet (production) |
| **[DATABASE_README.md](DATABASE_README.md)** | Architecture BDD |
| **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** | Guide utilisateur |
| **[DATABASE_API_REFERENCE.md](DATABASE_API_REFERENCE.md)** | Référence API |

---

## 🆘 Support

**Pour obtenir de l'aide :**

1. **Consultez la documentation** (fichiers .md)
2. **Vérifiez les logs** (`make logs`)
3. **Testez les health checks** (`make health`)
4. **Générez un rapport** :
   ```bash
   make logs > rapport.log
   make ps >> rapport.log
   docker version >> rapport.log
   ```

---

## 🎊 Félicitations !

Votre **Portail Qualité** est maintenant prêt pour un déploiement Docker professionnel !

**Architecture complète :**
- ✅ Frontend React + Nginx
- ✅ Backend Node.js/Express
- ✅ Base de données PostgreSQL
- ✅ API REST complète
- ✅ Historique et tendances
- ✅ Système d'alertes
- ✅ Backup et restauration
- ✅ Documentation complète

**Commencez maintenant :**

```bash
# Configuration
cp .env.example .env
nano .env  # Éditer le mot de passe

# Démarrage
make up

# Accès
open http://localhost:8080
```

---

**Créé le :** ${new Date().toLocaleDateString('fr-FR')}  
**Version :** 1.0.0  
**Status :** ✅ Production Ready
