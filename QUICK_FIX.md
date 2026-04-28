# Fix rapide - Page blanche

## Solution immédiate

Si vous voyez une page blanche, exécutez ces commandes dans le terminal:

```bash
# 1. Réinstaller les dépendances
pnpm install

# 2. Vérifier qu'il n'y a pas d'erreurs de syntaxe
grep -r "export" src/app/types/application.ts

# 3. Activer le mode debug
sed -i 's/const DEBUG_MODE = false/const DEBUG_MODE = true/' src/app/routes.tsx
```

Puis rafraîchissez la page dans le navigateur.

## Si le mode debug fonctionne

Cela signifie que le problème vient du hook `useApplications`. 

**Solution**: Vérifiez la console navigateur pour voir les logs `[useApplications]`.

## Revenir au mode normal

```bash
sed -i 's/const DEBUG_MODE = true/const DEBUG_MODE = false/' src/app/routes.tsx
```
