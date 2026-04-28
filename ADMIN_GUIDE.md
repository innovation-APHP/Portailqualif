# Guide d'Administration - Portail Qualité

## Système d'authentification

Le portail est maintenant sécurisé avec un système d'authentification administrateur.

### Mode par défaut (Grand Public)

**Accès :** Tout le monde sans mot de passe

**Permissions :**
- ✅ Voir la vue d'ensemble
- ✅ Consulter les données des applications configurées
- ✅ Naviguer entre les différentes pages
- ❌ Modifier les paramètres
- ❌ Ajouter/supprimer des applications
- ❌ Changer les configurations

### Mode Administrateur

**Accès :** Connexion requise via mot de passe

**Mot de passe par défaut :** `admin123`

**Permissions :**
- ✅ Toutes les permissions du mode public
- ✅ Accès à la page Paramètres
- ✅ Gérer les applications (ajouter, modifier, supprimer)
- ✅ Configurer les connexions API
- ✅ Paramétrer la base de données
- ✅ Modifier le mot de passe administrateur

## Comment se connecter en tant qu'administrateur

1. Cliquez sur **"Connexion Admin"** dans le menu latéral (icône cadenas)
2. Entrez le mot de passe : `admin123` (par défaut)
3. Cliquez sur **"Se connecter"**

Une fois connecté :
- Un badge **"Administrateur"** apparaît dans le menu
- Le bouton **"Paramètres"** devient accessible
- Un bouton de déconnexion (icône sortie) est disponible

## Changer le mot de passe administrateur

⚠️ **IMPORTANT** : Changez le mot de passe par défaut dès la première connexion !

1. Connectez-vous en tant qu'administrateur
2. Allez dans **Paramètres** > **Sécurité**
3. Remplissez le formulaire :
   - Mot de passe actuel : `admin123`
   - Nouveau mot de passe : (minimum 6 caractères)
   - Confirmation
4. Cliquez sur **"Modifier le mot de passe"**

## Se déconnecter

Pour revenir en mode lecture seule :
- Cliquez sur l'icône de déconnexion (↗) à côté du badge "Administrateur"
- Ou fermez simplement votre navigateur

## Persistance de la session

- La session admin est stockée dans `localStorage`
- Elle persiste même après fermeture du navigateur
- Pour forcer la déconnexion : vider le cache du navigateur ou cliquer sur déconnecter

## Sécurité

### Points importants

1. **Mot de passe stocké localement** : Le mot de passe est stocké dans le navigateur (localStorage)
2. **Pas de chiffrement côté serveur** : C'est une authentification côté client
3. **Recommandé pour** : Réseaux internes, démonstrations, prototypes
4. **Pas recommandé pour** : Applications exposées publiquement sur Internet

### Améliorer la sécurité

Pour une production avec exposition publique, considérez :
- Authentification backend avec JWT
- Chiffrement du mot de passe
- HTTPS obligatoire
- Rate limiting sur les tentatives de connexion
- Authentification à deux facteurs (2FA)

## Réinitialisation en cas de perte du mot de passe

Si vous perdez le mot de passe administrateur :

1. Ouvrez la console du navigateur (F12)
2. Exécutez :
```javascript
localStorage.removeItem('quality_portal_admin_password');
localStorage.removeItem('quality_portal_admin_token');
location.reload();
```
3. Le mot de passe revient à `admin123`

⚠️ **Attention** : Cela déconnectera l'administrateur actuel.

## Architecture

```
Mode Public (par défaut)
    ↓
    ├── Vue d'ensemble (lecture seule)
    ├── Pages applications (lecture seule)
    └── Bouton "Connexion Admin"
            ↓
            └── Page de connexion
                    ↓ (mot de passe correct)
                    └── Mode Administrateur
                            ├── Paramètres > Applications
                            ├── Paramètres > Base de données
                            └── Paramètres > Sécurité
```

## Cas d'usage

### Entreprise interne
- Un seul mot de passe admin partagé avec l'équipe DevOps
- Le grand public (développeurs) consulte les métriques
- Seuls les admins modifient les configurations

### Démonstration client
- Mode lecture seule pour présenter les données
- Accès admin pour configurer pendant la démo
- Pas de risque de modification accidentelle

### Portail self-service
- Les équipes consultent leurs propres métriques
- L'équipe plateforme gère les applications et connexions
- Séparation claire des responsabilités
