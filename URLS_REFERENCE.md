# Référence des URLs et Endpoints

Ce document liste tous les URLs et endpoints configurables dans le Portail Qualité.

## 🔧 Configuration des URLs

### SonarQube

**URL de base**
```
https://sonarqube.votre-entreprise.com
```

**Exemples d'URLs valides**
- `https://sonarqube.example.com`
- `http://localhost:9000`
- `https://sonar.company.io`
- `https://sonarqube-prod.azure.com`

**Port par défaut** : 9000

**Protocole** : HTTPS recommandé en production, HTTP acceptable en développement

---

### OWASP ZAP

**URL de base**
```
http://localhost:8080
```

**Exemples d'URLs valides**
- `http://localhost:8080` (installation locale)
- `http://zap-server:8080` (Docker)
- `http://192.168.1.100:8080` (serveur réseau)
- `https://zap.company.io` (serveur distant sécurisé)

**Port par défaut** : 8080

**Protocole** : HTTP par défaut, HTTPS si configuré

---

### Wazuh

**URL de base**
```
https://wazuh.votre-entreprise.com
```

**Exemples d'URLs valides**
- `https://wazuh.example.com`
- `https://wazuh-manager.local`
- `https://10.0.0.50:55000` (avec port personnalisé)
- `https://wazuh.company.io/api`

**Port par défaut API** : 55000

**Protocole** : HTTPS obligatoire en production

---

## 📍 Endpoints API utilisés

### SonarQube API

**Base URL** : `{SONARQUBE_URL}/api/`

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/measures/component` | GET | Métriques d'un composant/projet |
| `/api/issues/search` | GET | Recherche d'issues (bugs, vulnérabilités) |
| `/api/projects/search` | GET | Liste des projets |
| `/api/project_analyses/search` | GET | Historique des analyses |
| `/api/qualitygates/project_status` | GET | Statut Quality Gate |
| `/api/metrics/search` | GET | Liste des métriques disponibles |

**Authentification** : Bearer Token

**Documentation complète** : `{SONARQUBE_URL}/web_api`

---

### OWASP ZAP API

**Base URL** : `{ZAP_URL}/`

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/JSON/core/view/alerts/` | GET | Liste des alertes de sécurité |
| `/JSON/core/view/alertsSummary/` | GET | Résumé des alertes |
| `/JSON/core/view/sites/` | GET | Sites scannés |
| `/JSON/ascan/action/scan/` | GET | Démarrer un scan actif |
| `/JSON/spider/action/scan/` | GET | Démarrer un spider |
| `/JSON/core/view/numberOfAlerts/` | GET | Nombre total d'alertes |

**Authentification** : API Key en paramètre query `?apikey=`

**Documentation complète** : `{ZAP_URL}/UI/core/other/htmlreport/`

---

### Wazuh API

**Base URL** : `{WAZUH_URL}/`

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/security/user/authenticate` | POST | Authentification (obtenir JWT) |
| `/agents` | GET | Liste des agents Wazuh |
| `/agents/summary/status` | GET | Résumé du statut des agents |
| `/security/alerts` | GET | Alertes de sécurité |
| `/security/alerts/summary` | GET | Résumé des alertes |
| `/manager/info` | GET | Informations sur le manager |
| `/syscheck/{agent_id}` | GET | Intégrité des fichiers |

**Authentification** : JWT Bearer Token (obtenu après login)

**Documentation complète** : `{WAZUH_URL}/api/docs`

---

## 🌐 URLs des interfaces web

Une fois les URLs configurées, vous pouvez accéder aux interfaces natives :

### SonarQube Web UI
```
{SONARQUBE_URL}/
```

**Pages principales**
- Projets : `{SONARQUBE_URL}/projects`
- Issues : `{SONARQUBE_URL}/issues`
- Rules : `{SONARQUBE_URL}/coding_rules`
- Quality Gates : `{SONARQUBE_URL}/quality_gates`

---

### OWASP ZAP Web UI
```
{ZAP_URL}/
```

**Pages principales**
- Dashboard : `{ZAP_URL}/UI/core/`
- Alertes : `{ZAP_URL}/UI/core/view/alerts/`
- Sites : `{ZAP_URL}/UI/core/view/sites/`
- Scans : `{ZAP_URL}/UI/ascan/`

---

### Wazuh Web UI
```
{WAZUH_URL}/app/wazuh
```

**Pages principales**
- Overview : `{WAZUH_URL}/app/wazuh#/overview`
- Agents : `{WAZUH_URL}/app/wazuh#/agents-preview`
- Security Events : `{WAZUH_URL}/app/wazuh#/security-events`
- Integrity Monitoring : `{WAZUH_URL}/app/wazuh#/fim`

---

## 🔑 Où trouver les identifiants

### SonarQube Token

1. Connectez-vous à `{SONARQUBE_URL}`
2. Cliquez sur votre avatar (coin supérieur droit)
3. My Account → Security
4. Generate Tokens
   - Name: "Portail Qualité"
   - Type: User Token
   - Expires in: Choisir la durée
5. Generate → Copier le token

**Format du token** : `squ_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### OWASP ZAP API Key

1. Ouvrez ZAP desktop application
2. Menu : Tools → Options
3. Section : API
4. API Key s'affiche en haut

**Format de la clé** : 32 caractères alphanumériques

**Si désactivée** : Cochez "Enable API" pour l'activer

---

### Wazuh Credentials

**Compte par défaut** (à changer en production)
- Username: `admin`
- Password: Check fichier `/etc/wazuh-indexer/opensearch-security/internal_users.yml`

**Créer un compte dédié** (recommandé)
1. Connectez-vous à l'interface Wazuh
2. Management → Security → Users
3. Create User
   - Username: `portail-qualite`
   - Role: `readonly` ou `monitoring`
4. Set Password

---

## 🔒 URLs sécurisées vs non sécurisées

### Production (HTTPS requis)
✅ `https://sonarqube.company.com`  
✅ `https://wazuh.company.com`  
✅ `https://zap.company.com`

### Développement (HTTP acceptable)
⚠️ `http://localhost:9000`  
⚠️ `http://localhost:8080`  
⚠️ `http://192.168.1.100:55000`

### À éviter en production
❌ `http://sonarqube.company.com` (non sécurisé)  
❌ URLs avec IP publiques en HTTP  
❌ URLs sans validation SSL

---

## 📝 Format des URLs dans la configuration

### Dans l'interface web (Paramètres)

**Format attendu**
```
https://domaine.com
http://localhost:port
https://ip:port
```

**Ne PAS inclure**
- ❌ Slash final : `https://domain.com/`
- ❌ Path : `https://domain.com/path`
- ❌ Query params : `https://domain.com?param=value`

**Exemples valides**
```
https://sonarqube.example.com
http://localhost:9000
https://192.168.1.50:8080
```

---

### Dans .env.local

```bash
# SonarQube
SONARQUBE_URL=https://sonarqube.company.com
SONARQUBE_TOKEN=squ_1234567890abcdef

# OWASP ZAP
ZAP_URL=http://localhost:8080
ZAP_API_KEY=abcdef1234567890

# Wazuh
WAZUH_URL=https://wazuh.company.com
WAZUH_USER=monitoring-user
WAZUH_PASSWORD=secure_password_here
```

---

## 🧪 Test des connexions

### Tester manuellement

**SonarQube**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://sonarqube.example.com/api/system/status
```

**OWASP ZAP**
```bash
curl "http://localhost:8080/JSON/core/view/version/?apikey=YOUR_KEY"
```

**Wazuh**
```bash
# 1. Authentification
curl -u username:password -k -X POST \
  https://wazuh.example.com/security/user/authenticate

# 2. Utiliser le token retourné
curl -H "Authorization: Bearer TOKEN" -k \
  https://wazuh.example.com/agents
```

---

## 🚨 Résolution de problèmes

### URL non accessible
- ✅ Vérifier que l'URL est correcte
- ✅ Ping le serveur : `ping domain.com`
- ✅ Vérifier le firewall/proxy
- ✅ Tester avec curl/wget

### Erreur CORS
- ✅ Configurer CORS sur le serveur API
- ✅ Utiliser un proxy (voir API_INTEGRATION.md)
- ✅ Vérifier les en-têtes Access-Control-Allow-Origin

### Token/API Key invalide
- ✅ Régénérer le token
- ✅ Vérifier la date d'expiration
- ✅ Vérifier les permissions du compte

### Certificat SSL invalide
- ⚠️ En développement : Accepter le certificat auto-signé
- ✅ En production : Installer un certificat valide

---

## 📚 Ressources supplémentaires

- [SonarQube Web API](https://docs.sonarqube.org/latest/extend/web-api/)
- [OWASP ZAP API Documentation](https://www.zaproxy.org/docs/api/)
- [Wazuh API Reference](https://documentation.wazuh.com/current/user-manual/api/reference.html)

---

**Dernière mise à jour** : Mars 2026
