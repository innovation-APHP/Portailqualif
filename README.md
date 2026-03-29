# 🏢 Portail Qualité - Quality Portal

> Plateforme de monitoring et analyse de la qualité logicielle intégrant SonarQube, OWASP ZAP et Wazuh avec base de données PostgreSQL.

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)

---

## 📋 Vue d'ensemble

Le **Portail Qualité** est une application web professionnelle qui centralise les métriques de qualité et sécurité de vos projets. Il intègre :

- 📊 **SonarQube** - Analyse de code et qualité
- 🛡️ **OWASP ZAP** - Tests de sécurité des applications
- 👁️ **Wazuh** - Monitoring de sécurité et conformité

### 🎯 Fonctionnalités

- ✅ **Dashboard unifié** avec vue d'ensemble des métriques
- ✅ **Pages dédiées** pour chaque outil avec graphiques détaillés
- ✅ **Historique des métriques** avec calcul de tendances
- ✅ **Système d'alertes** personnalisées avec seuils configurables
- ✅ **Base de données PostgreSQL** pour persistance long terme
- ✅ **Mode frontend-only** (localStorage) ou base de données
- ✅ **Déploiement Docker** clé en main

---

## 🚀 Démarrage rapide

### Option 1 : Docker (Recommandé)

```bash
# Configuration
cp .env.example .env
nano .env  # Éditer le mot de passe

# Démarrage
docker-compose up -d

# Ou avec Make
make up
```

**Accès :** http://localhost:8080

📖 **[Guide complet Docker →](DOCKER_QUICKSTART.md)**

### Option 2 : Développement local

```bash
# Installation
pnpm install

# Développement
pnpm run dev

# Build production
pnpm run build
```

---

## 📁 Structure du projet

```
quality-portal/
├── src/app/                    # Application React
│   ├── components/             # Composants UI
│   ├── config/                 # Configuration
│   │   ├── api.ts             # Config APIs externes
│   │   ├── database.ts        # Config PostgreSQL
│   │   └── database-schema.ts # Schéma SQL
│   ├── services/              # Services métier
│   │   ├── sonarqube.service.ts
│   │   ├── zap.service.ts
│   │   ├── wazuh.service.ts
│   │   ├── metrics-history.service.ts
│   │   └── alerts.service.ts
│   ├── storage/               # Couche de stockage
│   │   ├── adapter.ts         # Interface commune
│   │   ├── localStorage.adapter.ts
│   │   └── postgresql.adapter.ts
│   └── hooks/                 # Hooks React
│
├── api/                       # Backend Node.js/Express
│   ├── server.js             # Serveur API REST
│   └── Dockerfile            # Image Docker API
│
├── docker/                    # Configuration Docker
│   ├── nginx.conf            # Config Nginx
│   ├── entrypoint.sh         # Script de démarrage
│   └── init-db.sql           # Initialisation PostgreSQL
│
├── Dockerfile                 # Image Docker frontend
├── docker-compose.yml         # Orchestration Docker
├── Makefile                   # Commandes simplifiées
│
└── Documentation/
    ├── DOCKER_QUICKSTART.md   # Démarrage rapide Docker
    ├── DOCKER_DEPLOYMENT.md   # Guide complet Docker
    ├── DATABASE_README.md     # Architecture base de données
    ├── DATABASE_GUIDE.md      # Guide utilisateur
    └── DATABASE_API_REFERENCE.md  # Référence API
```

---

## 🐳 Architecture Docker

```
┌─────────────────────────────────────┐
│  Nginx (Port 8080)                  │
│  ├─ Application React               │
│  └─ Serving static files            │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Node.js API (Port 3001)            │
│  ├─ Express REST API                │
│  └─ PostgreSQL client                │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  PostgreSQL 16 (Port 5432)          │
│  ├─ metrics_snapshots               │
│  ├─ alerts                          │
│  └─ alert_triggers                  │
└─────────────────────────────────────┘
```

### Services Docker

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **web** | Custom (React) | 8080 | Interface utilisateur |
| **api** | Custom (Node.js) | 3001 | Backend REST API |
| **postgres** | postgres:16-alpine | 5432 | Base de données |
| **pgadmin** | dpage/pgadmin4 | 5050 | Admin DB (optionnel) |

---

## 🔧 Configuration

### Variables d'environnement (.env)

```bash
# Base de données
POSTGRES_DB=quality_portal
POSTGRES_USER=quality_user
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!  # ⚠️ À changer !
POSTGRES_PORT=5432

# Application
WEB_PORT=8080
API_PORT=3001

# APIs externes (optionnel)
SONARQUBE_URL=https://votre-sonarqube.com
SONARQUBE_TOKEN=votre_token
ZAP_URL=http://votre-zap:8080
ZAP_API_KEY=votre_api_key
WAZUH_URL=https://votre-wazuh.com
WAZUH_USER=admin
WAZUH_PASSWORD=votre_password
```

### Configuration via interface

1. Lancez l'application
2. Allez dans **Paramètres**
3. Configurez vos APIs (SonarQube, ZAP, Wazuh)
4. (Optionnel) Activez PostgreSQL pour l'historique

---

## 📊 Utilisation

### 1. Configuration des APIs

Dans **Paramètres**, configurez les URLs et tokens de vos outils :

- **SonarQube** : URL + Token d'authentification
- **OWASP ZAP** : URL + API Key
- **Wazuh** : URL + Credentials

### 2. Historique et tendances

Avec PostgreSQL activé, créez des snapshots de métriques :

```typescript
import { metricsHistoryService } from './services/metrics-history.service';

// Créer un snapshot
await metricsHistoryService.createSnapshot(
  'sonarqube',
  'bugs',
  12,
  { projectKey: 'my-project' }
);

// Calculer la tendance
const trend = await metricsHistoryService.calculateTrend(
  'sonarqube',
  'bugs',
  'my-project'
);
```

### 3. Système d'alertes

Configurez des alertes personnalisées :

```typescript
import { alertsService } from './services/alerts.service';

// Créer une alerte
await alertsService.createAlert({
  name: 'Bugs critiques',
  source: 'sonarqube',
  condition: {
    metric: 'bugs',
    operator: '>',
    threshold: 10
  },
  enabled: true
});

// Vérifier les alertes
const triggered = await alertsService.checkAlerts(
  'sonarqube',
  'bugs',
  currentValue
);
```

---

## 🛠️ Commandes Make

```bash
make up              # Démarrer tous les services
make down            # Arrêter tous les services
make logs            # Voir les logs en temps réel
make ps              # Status des services
make restart         # Redémarrer
make health          # Vérifier la santé

# Base de données
make db-shell        # Ouvrir psql
make db-stats        # Statistiques
make db-cleanup      # Nettoyer les vieux snapshots
make backup          # Sauvegarder la DB
make restore         # Restaurer un backup

# Développement
make rebuild         # Rebuild sans cache
make shell-web       # Shell dans le conteneur web
make shell-api       # Shell dans le conteneur API

# Nettoyage
make clean           # Supprimer les conteneurs
make clean-all       # ⚠️ Tout supprimer (y compris données)

# Aide
make help            # Voir toutes les commandes
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)** | Démarrage rapide (3 min) |
| **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** | Guide complet de déploiement |
| **[DATABASE_README.md](DATABASE_README.md)** | Architecture base de données |
| **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** | Guide utilisateur complet |
| **[DATABASE_API_REFERENCE.md](DATABASE_API_REFERENCE.md)** | Référence API développeur |

---

## 🔒 Sécurité

### Checklist de production

- [ ] Changer tous les mots de passe par défaut
- [ ] Utiliser HTTPS (reverse proxy Nginx/Traefik)
- [ ] Restreindre l'accès aux ports (firewall)
- [ ] Activer les sauvegardes automatiques
- [ ] Configurer Row Level Security (RLS) dans PostgreSQL
- [ ] Utiliser des secrets management (Vault, etc.)
- [ ] Activer les logs de sécurité
- [ ] Mettre à jour régulièrement les images Docker

---

## 📈 Monitoring

### Health checks

```bash
# Vérifier tous les services
curl http://localhost:8080/health  # Web
curl http://localhost:3001/health  # API
make health                        # Tous
```

### Logs

```bash
# Logs en temps réel
make logs

# Logs par service
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f postgres
```

### Métriques

```bash
# Statistiques base de données
make db-stats

# Utilisation ressources
docker stats
```

---

## 🐛 Dépannage

### Services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier les ports
netstat -tulpn | grep -E '8080|3001|5432'

# Rebuild complet
make rebuild
```

### Erreur de connexion PostgreSQL

```bash
# Vérifier PostgreSQL
docker-compose logs postgres

# Tester la connexion
docker exec -it quality-portal-db pg_isready -U quality_user
```

### Performance lente

```bash
# Vérifier les ressources
docker stats

# Nettoyer les vieux snapshots
make db-cleanup

# Optimiser PostgreSQL (voir DOCKER_DEPLOYMENT.md)
```

---

## 🚀 Déploiement en production

### Avec Docker Compose

```bash
# 1. Configuration
cp .env.example .env
nano .env  # Éditer avec vos valeurs de production

# 2. Build
docker-compose build --pull

# 3. Démarrage
docker-compose up -d

# 4. Vérification
make health
```

### Avec Kubernetes

(Voir documentation spécifique - à venir)

---

## 💾 Backup et restauration

### Backup automatique

```bash
# Créer un cron job
crontab -e

# Ajouter (backup quotidien à 2h)
0 2 * * * cd /path/to/quality-portal && make backup
```

### Backup manuel

```bash
make backup           # Backup complet
make backup-volumes   # Backup volumes Docker
```

### Restauration

```bash
make restore FILE=backups/postgres_20260329.sql.gz
```

---

## 🔄 Mise à jour

```bash
# 1. Pull des derniers changements
git pull origin main

# 2. Rebuild
docker-compose build --pull

# 3. Redémarrage
docker-compose up -d

# 4. Vérification
make health
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🆘 Support

- **Documentation :** Voir les fichiers `*.md` dans le projet
- **Issues :** Créez une issue sur GitHub
- **Email :** support@votre-domaine.com

---

## 🎉 Remerciements

- [SonarQube](https://www.sonarqube.org/) pour l'analyse de code
- [OWASP ZAP](https://www.zaproxy.org/) pour les tests de sécurité
- [Wazuh](https://wazuh.com/) pour le monitoring de sécurité
- [PostgreSQL](https://www.postgresql.org/) pour la base de données
- [React](https://reactjs.org/) pour le frontend
- [Docker](https://www.docker.com/) pour la conteneurisation

---

**Version :** 1.0.0  
**Date :** Mars 2026  
**Statut :** ✅ Production Ready
