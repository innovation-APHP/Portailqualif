# 📦 Stockage et Réinitialisation - Portail Qualité

## Où sont stockées les données ?

### 1. Identifiants administrateur

Les identifiants sont stockés dans **localStorage** du navigateur :

| Clé | Description | Valeur par défaut |
|-----|-------------|-------------------|
| `quality_portal_admin_username` | Nom d'utilisateur admin | `admin` |
| `quality_portal_admin_password` | Mot de passe admin | `admin123` |
| `quality_portal_admin_token` | Token de session | `authenticated` (quand connecté) |

### 2. Configuration des applications

| Clé | Description |
|-----|-------------|
| `quality_portal_applications` | Liste des applications configurées (JSON) |

### 3. Autres données

| Clé | Description |
|-----|-------------|
| `quality_portal_api_config` | Configuration des APIs (ancienne, non utilisée) |
| `quality_portal_database_config` | Configuration PostgreSQL |
| `hasSeenWelcomeTutorial` | Tutorial de bienvenue affiché |

## 🔍 Voir les données stockées

Ouvrez la console du navigateur (F12) et tapez :

```javascript
// Voir tous les identifiants admin
console.log("Username:", localStorage.getItem('quality_portal_admin_username') || 'admin');
console.log("Password:", localStorage.getItem('quality_portal_admin_password') || 'admin123');
console.log("Token:", localStorage.getItem('quality_portal_admin_token'));

// Voir toutes les applications
console.log("Apps:", JSON.parse(localStorage.getItem('quality_portal_applications')));

// Voir TOUTES les clés du portail
Object.keys(localStorage).filter(k => k.includes('quality_portal')).forEach(key => {
    console.log(key + ":", localStorage.getItem(key));
});
```

## 🔄 Méthodes de réinitialisation

### Méthode 1 : Console du navigateur (RAPIDE)

Ouvrez la console (F12) et exécutez :

```javascript
// Réinitialiser SEULEMENT les identifiants admin
localStorage.removeItem('quality_portal_admin_username');
localStorage.removeItem('quality_portal_admin_password');
localStorage.removeItem('quality_portal_admin_token');
location.reload();
```

**Résultat** : Username = `admin`, Password = `admin123`

### Méthode 2 : Script Docker (RECOMMANDÉ)

Si vous utilisez Docker Compose :

```bash
# Depuis le répertoire du projet
./docker/reset-admin.sh
```

Puis suivez les instructions affichées (ouvrir `/reset-admin.html`)

### Méthode 3 : Réinitialisation TOTALE

⚠️ **ATTENTION** : Ceci supprime TOUT (applications, config, etc.)

```javascript
// Dans la console du navigateur
Object.keys(localStorage).filter(k => k.includes('quality_portal')).forEach(key => {
    localStorage.removeItem(key);
});
location.reload();
```

**Résultat** : Application complètement réinitialisée comme à l'installation.

### Méthode 4 : Vider le cache du navigateur

1. **Chrome/Edge** : Ctrl+Shift+Delete
2. Sélectionnez "Cookies et autres données de sites"
3. Cliquez sur "Effacer les données"
4. Rechargez la page

## 🐳 Commandes Docker utiles

### Réinitialiser uniquement les identifiants admin

```bash
./docker/reset-admin.sh
```

### Recréer complètement les conteneurs

```bash
# Stopper et supprimer tous les conteneurs
docker-compose down

# Supprimer les volumes (données PostgreSQL)
docker-compose down -v

# Redémarrer tout
docker-compose up -d
```

### Accéder au conteneur frontend

```bash
# Shell dans le conteneur
docker-compose exec frontend sh

# Voir les fichiers nginx
ls -la /usr/share/nginx/html/
```

### Voir les logs

```bash
# Logs du frontend
docker-compose logs -f frontend

# Logs du backend
docker-compose logs -f backend

# Logs PostgreSQL
docker-compose logs -f postgres
```

## 🔐 Modifier les identifiants depuis la base de données

Si vous utilisez PostgreSQL, les identifiants admin restent dans **localStorage** du navigateur, PAS dans PostgreSQL.

PostgreSQL stocke seulement :
- Historique des métriques
- Alertes

## 📋 Checklist de sécurité

Après installation en production :

- [ ] Changer le username admin (via Paramètres > Sécurité)
- [ ] Changer le mot de passe admin (via Paramètres > Sécurité)
- [ ] Noter les nouveaux identifiants en lieu sûr
- [ ] Configurer les URLs des applications (SonarQube, ZAP, etc.)
- [ ] Tester la connexion/déconnexion
- [ ] Vérifier que le mode public fonctionne (lecture seule)

## 🆘 Dépannage

### Problème : "Mot de passe incorrect" alors que j'utilise le bon

**Solution** :
```javascript
// Vérifier le mot de passe stocké
console.log(localStorage.getItem('quality_portal_admin_password'));

// Si différent de ce que vous pensez, réinitialisez
localStorage.removeItem('quality_portal_admin_password');
```

### Problème : Session déconnectée automatiquement

**Cause** : Le token de session a été supprimé

**Solution** :
1. Vérifiez que vous n'avez pas de nettoyage automatique du localStorage
2. Désactivez les extensions de nettoyage de cookies/cache
3. Reconnectez-vous

### Problème : Impossible d'accéder au script Docker

**Solution** :
```bash
# Vérifier que le conteneur tourne
docker-compose ps

# Redémarrer si nécessaire
docker-compose restart frontend

# Vérifier les permissions du script
chmod +x docker/reset-admin.sh
```

## 📊 Structure du localStorage

```javascript
{
  // AUTHENTIFICATION
  "quality_portal_admin_username": "admin",
  "quality_portal_admin_password": "admin123",
  "quality_portal_admin_token": "authenticated",
  
  // APPLICATIONS
  "quality_portal_applications": '[{"id":"app-1","name":"SonarQube",...},...]',
  
  // CONFIGURATION
  "quality_portal_database_config": '{"enabled":false,...}',
  
  // UI
  "hasSeenWelcomeTutorial": "true"
}
```

## 🎯 Bonnes pratiques

1. **Backupez vos identifiants** : Notez-les dans un gestionnaire de mots de passe
2. **Changez-les régulièrement** : Tous les 3-6 mois minimum
3. **Ne partagez pas le mot de passe** : Créez des comptes séparés si besoin (future feature)
4. **Testez la réinitialisation** : Vérifiez que vous savez comment récupérer l'accès
5. **Documentez vos changements** : Notez quand vous changez les identifiants

## 🔮 Futures améliorations

- [ ] Support multi-utilisateurs
- [ ] Stockage chiffré des identifiants
- [ ] Authentification backend (JWT)
- [ ] Rôles et permissions granulaires
- [ ] Historique des connexions
- [ ] 2FA (authentification à deux facteurs)
