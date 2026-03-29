# Guide Rapide - Paramétrage des URLs

## 🎯 Objectif
Connecter le Portail Qualité à vos instances SonarQube, OWASP ZAP et Wazuh.

## ⚡ Démarrage rapide (2 minutes)

### 1. Accédez aux paramètres
Cliquez sur **"Paramètres"** dans la barre latérale gauche.

### 2. Configurez vos outils

#### SonarQube
1. **URL** : `https://sonarqube.votreentreprise.com`
2. **Token** : 
   - Ouvrez SonarQube
   - Cliquez sur votre avatar → My Account
   - Allez dans l'onglet "Security"
   - Cliquez sur "Generate Tokens"
   - Copiez le token et collez-le

#### OWASP ZAP
1. **URL** : `http://localhost:8080` (par défaut) ou votre serveur ZAP
2. **API Key** :
   - Ouvrez ZAP
   - Menu : Tools → Options → API
   - Copiez la "API Key" affichée

#### Wazuh
1. **URL** : `https://wazuh.votreentreprise.com`
2. **Identifiants** : Utilisez un compte avec accès en lecture

### 3. Enregistrez
Cliquez sur **"Enregistrer la configuration"**

## 🔗 Accès aux interfaces

Une fois configuré, des liens **"Ouvrir l'interface"** apparaissent :
- ✅ Dans la barre latérale (sous chaque outil actif)
- ✅ En haut de chaque page d'outil
- ✅ Dans la page de paramètres
- ✅ Dans la vue d'ensemble

Cliquez pour ouvrir l'interface native de l'outil dans un nouvel onglet.

## 💡 Astuces

### Test sans configuration
Pas besoin de configuration pour tester ! Le portail affiche des données d'exemple.

### Configuration partielle
Configurez uniquement les outils que vous utilisez.

### Sécurité
Les identifiants sont stockés localement dans votre navigateur (localStorage).

### Réinitialisation
Bouton "Réinitialiser" dans les paramètres pour revenir aux valeurs par défaut.

## 🆘 Problèmes courants

### ❌ "Configuration requise"
→ L'URL ou le token n'est pas encore configuré. Allez dans Paramètres.

### ❌ Liens externes ne fonctionnent pas
→ Vérifiez que l'URL configurée est correcte et accessible.

### ❌ Erreur de connexion
→ Vérifiez que le token/clé API est valide et non expiré.

## 📚 Documentation complète
- [README.md](./README.md) - Vue d'ensemble
- [CONFIGURATION.md](./CONFIGURATION.md) - Guide détaillé

---

**Besoin d'aide ?** Vérifiez la console du navigateur (F12) pour les messages d'erreur.
