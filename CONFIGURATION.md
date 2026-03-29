# Guide de Configuration du Portail Qualité

## Vue d'ensemble

Le Portail Qualité permet de centraliser les métriques de SonarQube, OWASP ZAP et Wazuh dans une interface unifiée. Ce guide explique comment configurer les connexions aux différentes APIs.

## Accès aux Paramètres

1. Cliquez sur **"Paramètres"** dans la barre latérale
2. Vous accédez à la page de configuration des APIs

## Configuration de chaque outil

### SonarQube

**URL de l'instance**
- Entrez l'URL de votre serveur SonarQube (ex: `https://sonarqube.votre-entreprise.com`)
- Format: `https://` ou `http://` suivi du domaine

**Token d'authentification**
- Générez un token dans SonarQube:
  1. Connectez-vous à SonarQube
  2. Allez dans **My Account** → **Security**
  3. Cliquez sur **Generate Tokens**
  4. Donnez un nom au token (ex: "Portail Qualité")
  5. Copiez le token généré
  6. Collez-le dans le champ correspondant

### OWASP ZAP

**URL de l'API**
- Entrez l'URL de l'API ZAP (généralement `http://localhost:8080` ou l'URL de votre instance distante)
- Par défaut, ZAP écoute sur le port 8080

**Clé API**
- Trouvez votre clé API dans ZAP:
  1. Ouvrez ZAP
  2. Allez dans **Tools** → **Options** → **API**
  3. Copiez la clé API affichée
  4. Collez-la dans le champ correspondant

### Wazuh

**URL de l'API**
- Entrez l'URL de votre serveur Wazuh (ex: `https://wazuh.votre-entreprise.com`)
- L'API Wazuh utilise généralement le port 55000

**Nom d'utilisateur et mot de passe**
- Utilisez les identifiants d'un compte Wazuh avec les permissions appropriées
- Pour des raisons de sécurité, créez un compte dédié au portail

## Liens vers les interfaces

Une fois les URLs configurées, des liens **"Ouvrir l'interface"** apparaissent:
- Dans la **barre latérale** à côté de chaque outil (quand la page est active)
- Dans les **bannières de statut** en haut de chaque page d'outil
- Dans la **page de paramètres** pour chaque outil configuré

Ces liens vous permettent d'accéder directement aux interfaces web natives de chaque outil.

## Stockage et Sécurité

### Stockage local
- Les paramètres sont stockés dans le **localStorage** de votre navigateur
- Les données restent sur votre machine et ne sont jamais envoyées à un serveur tiers
- Si vous videz le cache de votre navigateur, vous devrez reconfigurer les paramètres

### Recommandations de sécurité

⚠️ **Important pour la production:**

1. **Variables d'environnement**: Pour un déploiement en production, utilisez plutôt des variables d'environnement:
   ```env
   SONARQUBE_URL=https://votre-sonarqube.com
   SONARQUBE_TOKEN=votre_token
   ZAP_URL=http://votre-zap:8080
   ZAP_API_KEY=votre_api_key
   WAZUH_URL=https://votre-wazuh.com
   WAZUH_USER=votre_username
   WAZUH_PASSWORD=votre_password
   ```

2. **Système de gestion des secrets**: Utilisez un gestionnaire de secrets (HashiCorp Vault, AWS Secrets Manager, etc.)

3. **Permissions restreintes**: Créez des comptes dédiés avec les permissions minimales nécessaires

4. **HTTPS obligatoire**: Utilisez toujours HTTPS pour les connexions aux APIs en production

## Réinitialisation

Pour réinitialiser la configuration:
1. Allez dans la page **Paramètres**
2. Cliquez sur le bouton **"Réinitialiser"**
3. Confirmez l'action
4. Les valeurs par défaut seront restaurées

## Données mockées vs données réelles

- **Sans configuration**: Le portail affiche des données mockées (exemples) pour la démonstration
- **Avec configuration**: Le portail tentera de se connecter aux APIs réelles et d'afficher les données en direct

Le bandeau de statut en haut de chaque page indique si l'outil est configuré ou non.

## Dépannage

### Erreurs de connexion
- Vérifiez que les URLs sont correctes
- Vérifiez que les tokens/clés API sont valides
- Vérifiez que les outils sont accessibles depuis votre réseau

### CORS (Cross-Origin Resource Sharing)
Si vous rencontrez des erreurs CORS:
- Configurez les en-têtes CORS sur vos serveurs API
- Utilisez un proxy reverse pour contourner les restrictions CORS

### Timeouts
Si les requêtes prennent trop de temps:
- Vérifiez la connectivité réseau
- Augmentez les timeouts dans le code si nécessaire
