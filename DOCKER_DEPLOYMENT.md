# 🐳 Déploiement Docker - Quality Portal

Guide complet pour déployer le portail qualité avec Docker et PostgreSQL.

## 📋 Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Utilisateur → http://localhost:8080            │
│                                                 │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Container: quality-portal-web (Nginx)          │
│  - Application React buildée                    │
│  - Port: 8080 → 80                              │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Container: quality-portal-api (Node.js)        │
│  - API REST Express                             │
│  - Port: 3001                                   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Container: quality-portal-db (PostgreSQL)      │
│  - Base de données                              │
│  - Port: 5432                                   │
│  - Volume persistant                            │
└─────────────────────────────────────────────────┘
```

## 🚀 Installation rapide

### Prérequis

- Docker (≥ 20.10)
- Docker Compose (≥ 2.0)
- 2 GB RAM minimum
- 5 GB espace disque

### Étape 1 : Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

**Configuration minimale :**
```bash
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
WEB_PORT=8080
```

### Étape 2 : Démarrage

```bash
# Build et démarrage
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

### Étape 3 : Accès

- **Application Web :** http://localhost:8080
- **API Backend :** http://localhost:3001/health
- **pgAdmin (optionnel) :** http://localhost:5050

## 📦 Services disponibles

### 1. PostgreSQL (`postgres`)

**Base de données principale**

- Image : `postgres:16-alpine`
- Port : `5432` (configurable)
- Volume : `postgres_data` (persistant)
- Healthcheck : Actif

**Connexion directe :**
```bash
docker exec -it quality-portal-db psql -U quality_user -d quality_portal
```

### 2. API Backend (`api`)

**Serveur Node.js/Express**

- Port : `3001` (configurable)
- Endpoints :
  - `GET /health` - Health check
  - `GET /api/:table` - Liste des entrées
  - `POST /api/:table` - Créer une entrée
  - `PATCH /api/:table/:id` - Mettre à jour
  - `DELETE /api/:table/:id` - Supprimer
  - `GET /api/stats` - Statistiques
  - `POST /api/cleanup` - Nettoyer

**Logs :**
```bash
docker-compose logs -f api
```

### 3. Application Web (`web`)

**Frontend React servi par Nginx**

- Port : `8080` (configurable)
- Build optimisé multi-stage
- Compression Gzip activée
- Headers de sécurité

**Logs :**
```bash
docker-compose logs -f web
```

### 4. pgAdmin (`pgadmin`) - Optionnel

**Interface d'administration PostgreSQL**

- Port : `5050` (configurable)
- Activé avec : `docker-compose --profile admin up -d`

**Première connexion :**
1. Email : `admin@quality-portal.local`
2. Password : `admin` (changez-le !)
3. Ajoutez un serveur :
   - Host : `postgres`
   - Port : `5432`
   - User : `quality_user`
   - Password : Celui du `.env`

## 🔧 Configuration avancée

### Variables d'environnement

**Base de données :**
```bash
POSTGRES_DB=quality_portal          # Nom de la base
POSTGRES_USER=quality_user          # Utilisateur
POSTGRES_PASSWORD=***               # Mot de passe (OBLIGATOIRE)
POSTGRES_PORT=5432                  # Port externe
```

**Application :**
```bash
WEB_PORT=8080                       # Port web externe
API_PORT=3001                       # Port API externe
```

**APIs externes (optionnel) :**
```bash
SONARQUBE_URL=https://sonarqube.example.com
SONARQUBE_TOKEN=***
ZAP_URL=http://zap:8080
ZAP_API_KEY=***
WAZUH_URL=https://wazuh.example.com
WAZUH_USER=admin
WAZUH_PASSWORD=***
```

### Volumes persistants

**Données PostgreSQL :**
```bash
# Backup
docker run --rm -v quality-portal_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz -C /data .

# Restore
docker run --rm -v quality-portal_postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /data
```

**Lister les volumes :**
```bash
docker volume ls | grep quality-portal
```

## 🎯 Commandes utiles

### Gestion des services

```bash
# Démarrer tous les services
docker-compose up -d

# Démarrer avec pgAdmin
docker-compose --profile admin up -d

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes (⚠️ PERTE DE DONNÉES)
docker-compose down -v

# Redémarrer un service
docker-compose restart web

# Rebuild après modification du code
docker-compose up -d --build
```

### Logs et monitoring

```bash
# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f postgres

# Voir les dernières 100 lignes
docker-compose logs --tail=100 api

# Status des services
docker-compose ps

# Utilisation des ressources
docker stats
```

### Accès aux conteneurs

```bash
# Shell dans le conteneur web
docker exec -it quality-portal-web sh

# Shell dans le conteneur API
docker exec -it quality-portal-api sh

# psql dans PostgreSQL
docker exec -it quality-portal-db psql -U quality_user -d quality_portal
```

### Base de données

```bash
# Connexion psql
docker exec -it quality-portal-db psql -U quality_user -d quality_portal

# Lister les tables
docker exec -it quality-portal-db psql -U quality_user -d quality_portal -c "\dt"

# Compter les snapshots
docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
  -c "SELECT COUNT(*) FROM metrics_snapshots;"

# Nettoyer les vieux snapshots (> 90 jours)
docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
  -c "SELECT cleanup_old_metrics(90);"

# Statistiques
docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
  -c "SELECT * FROM get_metrics_stats();"

# Export SQL
docker exec quality-portal-db pg_dump -U quality_user quality_portal > backup.sql

# Import SQL
docker exec -i quality-portal-db psql -U quality_user quality_portal < backup.sql
```

## 🔒 Sécurité

### Checklist de production

- [ ] **Changer tous les mots de passe par défaut**
- [ ] **Utiliser HTTPS (reverse proxy)**
- [ ] **Restreindre l'accès aux ports**
- [ ] **Activer les pare-feu**
- [ ] **Configurer les sauvegardes automatiques**
- [ ] **Limiter les ressources des conteneurs**
- [ ] **Surveiller les logs**
- [ ] **Mettre à jour régulièrement**

### Reverse Proxy (Nginx/Traefik)

**Exemple avec Nginx :**

```nginx
server {
    listen 80;
    server_name quality-portal.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name quality-portal.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Limiter les ressources

**docker-compose.yml :**

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 📊 Monitoring

### Health checks

```bash
# Vérifier tous les services
curl http://localhost:8080/health    # Web
curl http://localhost:3001/health    # API

# Status Docker
docker-compose ps
```

### Prometheus + Grafana (optionnel)

Ajoutez à `docker-compose.yml` :

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier les ports
netstat -tulpn | grep -E '8080|3001|5432'

# Rebuild complet
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Erreur de connexion à PostgreSQL

```bash
# Vérifier que le conteneur est démarré
docker-compose ps postgres

# Tester la connexion
docker exec -it quality-portal-db pg_isready -U quality_user

# Voir les logs PostgreSQL
docker-compose logs postgres
```

### L'API ne répond pas

```bash
# Vérifier le health check
curl http://localhost:3001/health

# Logs de l'API
docker-compose logs -f api

# Redémarrer l'API
docker-compose restart api
```

### Problèmes de performance

```bash
# Vérifier l'utilisation des ressources
docker stats

# Augmenter les ressources PostgreSQL
# Éditer docker-compose.yml :
postgres:
  command: >
    postgres
    -c shared_buffers=256MB
    -c max_connections=100
    -c work_mem=16MB
```

## 🚀 Mise en production

### Checklist complète

1. **Sécurité :**
   - [ ] Changer tous les mots de passe
   - [ ] Activer HTTPS
   - [ ] Configurer le pare-feu
   - [ ] Limiter l'accès SSH

2. **Performance :**
   - [ ] Optimiser PostgreSQL
   - [ ] Activer la compression
   - [ ] CDN pour les assets
   - [ ] Caching

3. **Monitoring :**
   - [ ] Logs centralisés
   - [ ] Alertes
   - [ ] Métriques
   - [ ] Uptime monitoring

4. **Backup :**
   - [ ] Backup automatique PostgreSQL
   - [ ] Backup volumes Docker
   - [ ] Test de restauration
   - [ ] Backup hors-site

5. **Documentation :**
   - [ ] Procédures de déploiement
   - [ ] Contacts d'urgence
   - [ ] Runbook
   - [ ] Architecture

## 📝 Scripts utiles

### Backup automatique (crontab)

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup PostgreSQL
docker exec quality-portal-db pg_dump -U quality_user quality_portal | \
  gzip > "$BACKUP_DIR/postgres_$DATE.sql.gz"

# Backup volumes
docker run --rm -v quality-portal_postgres_data:/data -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/volumes_$DATE.tar.gz -C /data .

# Nettoyer les backups > 7 jours
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "✅ Backup terminé : $DATE"
```

**Crontab :**
```bash
# Backup tous les jours à 2h du matin
0 2 * * * /path/to/backup.sh >> /var/log/quality-portal-backup.log 2>&1
```

### Script de déploiement

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Déploiement Quality Portal..."

# Pull des dernières images
git pull origin main

# Build et redémarrage
docker-compose build --pull
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 10

# Health checks
if curl -f http://localhost:8080/health && \
   curl -f http://localhost:3001/health; then
  echo "✅ Déploiement réussi !"
else
  echo "❌ Échec du déploiement"
  docker-compose logs --tail=50
  exit 1
fi
```

## 🆘 Support

**Logs à fournir en cas de problème :**

```bash
# Générer un rapport complet
docker-compose logs > logs.txt
docker-compose ps >> logs.txt
docker stats --no-stream >> logs.txt
docker version >> logs.txt
docker-compose version >> logs.txt
```

---

**Documentation générée le :** $(date)
**Version :** 1.0.0
