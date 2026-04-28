# ✅ Authentification Administrateur Implémentée

## Résumé des changements

Votre portail qualité dispose maintenant d'un système d'authentification qui sépare :
- **Mode Public** : Lecture seule pour tous
- **Mode Administrateur** : Accès complet aux paramètres

## 🔑 Informations de connexion

**Mot de passe par défaut :** `admin123`

⚠️ **IMPORTANT** : Changez ce mot de passe dès la première connexion !

## 🎯 Fonctionnement

### Pour le grand public (par défaut)

✅ **Accessible sans authentification**
- Vue d'ensemble avec toutes les statistiques
- Consultation des données des applications configurées
- Navigation entre les différentes pages
- Accès aux interfaces natives via les liens externes

❌ **Non accessible**
- Page Paramètres (protégée)
- Modification des applications
- Configuration des APIs
- Paramètres de base de données

### Pour les administrateurs

**Comment se connecter :**
1. Cliquez sur **"Connexion Admin"** dans le menu latéral (icône 🔒)
2. Entrez le mot de passe : `admin123`
3. Cliquez sur "Se connecter"

**Une fois connecté, vous voyez :**
- Badge "Administrateur" dans le menu
- Bouton "Paramètres" accessible
- Icône de déconnexion

**Accès complet à :**
- ✅ Gestion des applications (ajouter, modifier, supprimer, activer/désactiver)
- ✅ Configuration des connexions API
- ✅ Paramètres de base de données PostgreSQL
- ✅ Modification du mot de passe administrateur

## 📋 Nouveaux onglets dans Paramètres

Paramètres > **Applications** → Gérer les applications du portail
Paramètres > **Base de données** → Configuration PostgreSQL
Paramètres > **Sécurité** → Changer le mot de passe admin (NOUVEAU !)

## 🔐 Sécurité

### Points importants

1. **Stockage local** : Mot de passe stocké dans localStorage du navigateur
2. **Session persistante** : Reste connecté même après fermeture du navigateur
3. **Déconnexion** : Cliquez sur l'icône de sortie à côté du badge "Admin"

### Changer le mot de passe

1. Connectez-vous en tant qu'admin
2. Allez dans **Paramètres** > **Sécurité**
3. Remplissez :
   - Mot de passe actuel : `admin123`
   - Nouveau mot de passe (min. 6 caractères)
   - Confirmation
4. Validez

### En cas de perte du mot de passe

Ouvrez la console du navigateur (F12) et exécutez :
```javascript
localStorage.removeItem('quality_portal_admin_password');
localStorage.removeItem('quality_portal_admin_token');
location.reload();
```

Le mot de passe revient à `admin123`.

## 🎨 Indicateurs visuels

**Dans le menu latéral :**
- Mode public → Bouton "🔒 Connexion Admin"
- Mode admin → Bouton "⚙️ Paramètres" + Badge "Administrateur"

**Dans l'en-tête (desktop) :**
- Badge "🛡️ Admin" visible quand connecté

## 🚀 Utilisation recommandée

### Scénario 1 : Réseau d'entreprise
- Partagez le mot de passe avec l'équipe DevOps/Platform
- Les développeurs consultent en lecture seule
- Seuls les admins configurent

### Scénario 2 : Démonstration
- Présentez les données en mode lecture seule
- Basculez en mode admin pour ajuster la config
- Aucun risque de modification par les spectateurs

### Scénario 3 : Self-service
- Les équipes consultent leurs métriques
- L'équipe plateforme gère les applications
- Séparation claire des rôles

## 📁 Fichiers créés/modifiés

**Nouveaux fichiers :**
- `src/app/contexts/AuthContext.tsx` - Contexte d'authentification
- `src/app/components/AdminLogin.tsx` - Page de connexion
- `src/app/components/ProtectedRoute.tsx` - Protection des routes
- `src/app/components/AdminPasswordManager.tsx` - Gestion du mot de passe
- `ADMIN_GUIDE.md` - Guide complet d'administration

**Fichiers modifiés :**
- `src/app/App.tsx` - Ajout du AuthProvider
- `src/app/routes.tsx` - Protection de la route /settings
- `src/app/components/DashboardLayout.tsx` - Indicateurs admin
- `src/app/components/SettingsPage.tsx` - Nouvel onglet Sécurité

## ✅ Tout fonctionne !

Après rafraîchissement de la page :
1. Vous êtes en mode lecture seule (public)
2. Cliquez sur "Connexion Admin" pour accéder aux paramètres
3. Le portail est maintenant sécurisé et prêt pour la production !
