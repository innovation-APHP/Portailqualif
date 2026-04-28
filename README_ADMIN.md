# 🔐 Guide Administrateur - Portail Qualité

## Vue d'ensemble

Ce portail utilise un système d'authentification simple avec :
- **Mode Public** : Lecture seule pour tous
- **Mode Admin** : Accès complet aux paramètres

## 🔑 Identifiants par défaut

```
Username: admin
Password: admin123
```

⚠️ **CHANGEZ CES VALEURS dès la première connexion !**

## 📍 Où sont stockées les données ?

### localStorage du navigateur

Toutes les données admin sont dans le localStorage :

| Clé | Description | Défaut |
|-----|-------------|--------|
| `quality_portal_admin_username` | Nom d'utilisateur | `admin` |
| `quality_portal_admin_password` | Mot de passe | `admin123` |
| `quality_portal_admin_token` | Session active | `authenticated` |

### Voir les données

Console du navigateur (F12) :
```javascript
Object.keys(localStorage)
  .filter(k => k.includes('quality_portal'))
  .forEach(k => console.log(k, localStorage.getItem(k)));
```

## 🎯 Modifier les identifiants

### Via l'interface (RECOMMANDÉ)

1. Connectez-vous avec `admin / admin123`
2. Allez dans **Paramètres > Sécurité**
3. Remplissez le formulaire :
   - Mot de passe actuel
   - Nouveau nom d'utilisateur (optionnel)
   - Nouveau mot de passe (optionnel)
4. Enregistrez

### Via la console

```javascript
// Changer le username
localStorage.setItem('quality_portal_admin_username', 'superadmin');

// Changer le mot de passe
localStorage.setItem('quality_portal_admin_password', 'MonMotDePasseSécurisé123!');

// Déconnexion
localStorage.removeItem('quality_portal_admin_token');
location.reload();
```

## 🔄 Réinitialisation

### Méthode 1 : Console (RAPIDE)

```javascript
localStorage.removeItem('quality_portal_admin_username');
localStorage.removeItem('quality_portal_admin_password');
localStorage.removeItem('quality_portal_admin_token');
location.reload();
// Identifiants redeviennent: admin / admin123
```

### Méthode 2 : Script Docker

```bash
./docker/reset-admin.sh
```

Puis ouvrez : `http://localhost:3000/reset-admin.html`

### Méthode 3 : Makefile

```bash
make -f Makefile.admin reset-admin
```

## 📂 Fichiers de documentation

| Fichier | Description |
|---------|-------------|
| `README_ADMIN.md` | Ce fichier - Vue d'ensemble |
| `STORAGE_AND_RESET.md` | Documentation complète stockage/reset |
| `QUICK_ADMIN_RESET.md` | Guide rapide de réinitialisation |
| `ADMIN_GUIDE.md` | Guide détaillé d'administration |
| `AUTHENTICATION_SUMMARY.md` | Résumé du système d'auth |
| `QUICK_START_ADMIN.md` | Démarrage rapide admin |

## 🛡️ Sécurité

### Points importants

✅ Stockage local (localStorage) - simple mais limité
❌ Pas de chiffrement côté serveur
✅ Session persistante
❌ Pas de rate limiting

### Recommandations

1. **Changez les identifiants par défaut**
2. **Utilisez un mot de passe fort** (min 12 caractères)
3. **Ne partagez pas le mot de passe** publiquement
4. **Déconnectez-vous** après utilisation sur machines partagées
5. **Backupez vos identifiants** dans un gestionnaire de mots de passe

### Limitations

Ce système est adapté pour :
- ✅ Réseaux internes d'entreprise
- ✅ Démonstrations
- ✅ Prototypes
- ✅ Usage personnel

Pas recommandé pour :
- ❌ Applications publiques sur Internet
- ❌ Données hautement sensibles
- ❌ Multi-tenancy

## 🚀 Commandes rapides

```bash
# Infos admin
make -f Makefile.admin admin-info

# Reset identifiants
make -f Makefile.admin reset-admin

# Aide complète
make -f Makefile.admin help
```

## 🆘 Dépannage

### "Mot de passe incorrect"

1. Vérifiez le mot de passe stocké :
   ```javascript
   console.log(localStorage.getItem('quality_portal_admin_password'));
   ```

2. Si différent de ce que vous pensez, réinitialisez

### Session déconnectée automatiquement

- Vérifiez les extensions de nettoyage de cache
- Désactivez le mode navigation privée

### Impossible de modifier les identifiants

1. Vérifiez que vous êtes bien connecté
2. Ouvrez la console pour voir les erreurs
3. Essayez de réinitialiser complètement

## 📞 Support

Pour plus d'aide :
1. Consultez `STORAGE_AND_RESET.md`
2. Ouvrez la console du navigateur (F12)
3. Recherchez les erreurs
4. Utilisez le script de reset si besoin

---

**Version** : 1.0.0
**Dernière mise à jour** : 2026-04-28
