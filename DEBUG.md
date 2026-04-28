# Guide de dépannage - Page blanche

## Étapes de diagnostic

### 1. Ouvrir la console du navigateur
- **Chrome/Edge**: F12 ou Clic droit > Inspecter > Console
- **Firefox**: F12 > Console
- **Safari**: Cmd+Option+C

### 2. Vérifier les messages d'erreur
Recherchez dans la console:
- Messages en rouge (erreurs)
- Messages commençant par `[App]` ou `[useApplications]`
- Erreurs de type `Failed to load module`, `Cannot read property`, etc.

### 3. Mode de test simple
Si vous voyez une page blanche:

1. Éditez `/src/app/routes.tsx`
2. Changez `const DEBUG_MODE = false;` en `const DEBUG_MODE = true;`
3. Sauvegardez et rechargez

Cela activera une page de test simple. Si cette page s'affiche:
- ✅ React fonctionne
- ❌ Le problème vient du système d'applications

### 4. Vider le cache
Parfois le cache cause des problèmes:
- **Chrome/Edge**: Ctrl+Shift+Delete > Vider le cache
- **Firefox**: Ctrl+Shift+Delete > Cocher "Cache" > Effacer
- Ou faire un "Hard Refresh": Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)

### 5. Vérifier localStorage
Ouvrez la console et tapez:
```javascript
localStorage.clear()
location.reload()
```

Cela réinitialisera les données locales.

## Logs de débogage activés

L'application affiche maintenant des logs dans la console:
- `[App] Rendering App component` - L'app démarre
- `[useApplications] Starting to load applications...` - Chargement des apps
- `[useApplications] Applications loaded: [...]` - Apps chargées avec succès
- `[useApplications] Loading finished` - Chargement terminé

Si vous ne voyez AUCUN de ces messages, le problème est avant même le chargement React.

## Solutions communes

### Erreur: "Failed to load module"
**Solution**: Vérifiez que toutes les dépendances sont installées:
```bash
pnpm install
```

### Erreur: "Cannot read property 'map' of undefined"
**Solution**: Un tableau est undefined. Les corrections ont été ajoutées avec des valeurs par défaut `[]`.

### Page blanche sans erreur
**Solution**:
1. Activez le mode DEBUG dans routes.tsx
2. Vérifiez que le fichier `__figma__entrypoint__.ts` est bien généré
3. Rechargez la page avec Ctrl+F5

## Contactez-moi avec ces informations

Si le problème persiste, envoyez:
1. Le contenu complet de la console (copier/coller)
2. La valeur de DEBUG_MODE dans routes.tsx
3. Le résultat de `localStorage.getItem('quality_portal_applications')` dans la console
