# 🔄 Reset Rapide - Identifiants Admin

## J'ai perdu mon mot de passe !

### Solution 1 : Console navigateur (30 secondes)

1. Ouvrez votre portail dans le navigateur
2. Appuyez sur **F12** pour ouvrir la console
3. Copiez/collez ce code :

```javascript
localStorage.removeItem('quality_portal_admin_username');
localStorage.removeItem('quality_portal_admin_password');
localStorage.removeItem('quality_portal_admin_token');
alert('Identifiants réinitialisés ! Username: admin, Password: admin123');
location.reload();
```

4. Appuyez sur **Entrée**
5. La page se recharge
6. Connectez-vous avec : **admin / admin123**

### Solution 2 : Script Docker (si vous utilisez Docker)

```bash
./docker/reset-admin.sh
```

Puis ouvrez : `http://localhost:3000/reset-admin.html`

---

## Où sont stockés les identifiants ?

**Réponse** : Dans le **localStorage** de votre navigateur

**Clés utilisées** :
- `quality_portal_admin_username` → Nom d'utilisateur (défaut: `admin`)
- `quality_portal_admin_password` → Mot de passe (défaut: `admin123`)
- `quality_portal_admin_token` → Token de session (quand connecté)

---

## Comment voir mes identifiants actuels ?

Console du navigateur (F12) :

```javascript
console.log('Username:', localStorage.getItem('quality_portal_admin_username') || 'admin');
console.log('Password:', localStorage.getItem('quality_portal_admin_password') || 'admin123');
```

---

## Valeurs par défaut

| Champ | Valeur par défaut |
|-------|------------------|
| Nom d'utilisateur | `admin` |
| Mot de passe | `admin123` |

---

## Commandes utiles

### Réinitialiser seulement le mot de passe
```javascript
localStorage.removeItem('quality_portal_admin_password');
alert('Mot de passe réinitialisé à: admin123');
```

### Réinitialiser seulement le username
```javascript
localStorage.removeItem('quality_portal_admin_username');
alert('Username réinitialisé à: admin');
```

### Réinitialiser TOUT le portail
```javascript
if(confirm('Supprimer TOUTES les données ?')) {
    Object.keys(localStorage).filter(k => k.includes('quality_portal')).forEach(key => {
        localStorage.removeItem(key);
    });
    alert('Portail complètement réinitialisé !');
    location.reload();
}
```

---

## Makefile (si disponible)

```bash
# Informations admin
make -f Makefile.admin admin-info

# Reset identifiants
make -f Makefile.admin reset-admin
```

---

## 📞 Besoin d'aide ?

Consultez : `STORAGE_AND_RESET.md` pour la documentation complète
