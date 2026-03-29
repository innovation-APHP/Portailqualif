# Guide d'intégration des API

Ce guide explique comment intégrer les métriques réelles de vos outils de qualité.

## Configuration initiale

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# SonarQube
SONARQUBE_URL=https://votre-sonarqube.com
SONARQUBE_TOKEN=votre_token_sonarqube

# OWASP ZAP
ZAP_URL=http://localhost:8080
ZAP_API_KEY=votre_api_key_zap

# Wazuh
WAZUH_URL=https://votre-wazuh.com
WAZUH_USER=admin
WAZUH_PASSWORD=votre_mot_de_passe

# Wiki.js
WIKI_URL=https://votre-wiki.com
WIKI_API_KEY=votre_api_key_wiki
```

### 2. Obtenir les tokens et clés API

#### SonarQube
1. Connectez-vous à SonarQube
2. Allez dans **Mon compte** → **Sécurité** → **Générer des jetons**
3. Créez un token avec les permissions de lecture
4. Copiez le token dans votre `.env.local`

#### OWASP ZAP
1. Lancez ZAP en mode démon : `zap.sh -daemon -port 8080 -config api.key=votre_cle`
2. Ou récupérez la clé API dans **Outils** → **Options** → **API**
3. Copiez la clé dans votre `.env.local`

#### Wazuh
1. Utilisez vos identifiants Wazuh existants
2. L'authentification se fait automatiquement via l'API
3. Assurez-vous que l'utilisateur a les permissions nécessaires

#### Wiki.js
1. Connectez-vous à Wiki.js en tant qu'administrateur
2. Allez dans **Administration** → **API Access**
3. Créez une nouvelle clé API
4. Copiez la clé dans votre `.env.local`

## Utilisation dans les composants

### Méthode 1 : Avec les hooks (Recommandé)

Les hooks gèrent automatiquement le chargement, les erreurs et le rafraîchissement.

```tsx
import { useSonarQubeProjects } from "../hooks/useSonarQube";

export function MyComponent() {
  const { data, loading, error, refetch } = useSonarQubeProjects();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {data.map(project => (
        <div key={project.key}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Méthode 2 : Appel direct aux services

Pour plus de contrôle, appelez directement les services :

```tsx
import { sonarqubeService } from "../services/sonarqube.service";
import { useEffect, useState } from "react";

export function MyComponent() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await sonarqubeService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return <div>{/* Votre composant */}</div>;
}
```

## Hooks disponibles

### SonarQube
- `useSonarQubeProjects()` - Liste des projets avec métriques
- `useSonarQubeMetricsHistory(projectKey, days)` - Historique des métriques

### OWASP ZAP
- `useZapSummary()` - Résumé des alertes
- `useZapAlerts(baseurl?)` - Liste des alertes détaillées

### Wazuh
- `useWazuhSummary()` - Résumé des alertes et agents
- `useWazuhAlerts(limit)` - Alertes récentes
- `useWazuhAgents()` - Liste des agents

### Wiki.js
- `useWikiRecentPages(limit)` - Pages récemment modifiées
- `useWikiSearch(query)` - Recherche de pages
- `useWikiTags()` - Liste des tags/catégories

## Gestion des erreurs

Les hooks incluent une gestion d'erreur automatique. En cas d'échec de l'API, les données mockées sont utilisées comme fallback.

```tsx
const { data, loading, error } = useSonarQubeProjects();

if (error) {
  console.warn("API non disponible, utilisation des données mockées");
  // Les données mockées sont déjà chargées dans 'data'
}
```

## Rafraîchissement des données

Chaque hook supporte un rafraîchissement automatique configurable :

```tsx
// Dans le hook, vous pouvez ajuster refreshInterval
useApiData({
  fetchFn: () => sonarqubeService.getProjects(),
  initialData: mockData,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
});
```

Ou déclencher un rafraîchissement manuel :

```tsx
const { data, refetch } = useSonarQubeProjects();

// Plus tard...
<button onClick={() => refetch()}>Rafraîchir</button>
```

## CORS et sécurité

### Problèmes CORS

Si vous rencontrez des erreurs CORS en développement :

1. **SonarQube** : Configurez les CORS dans `sonar.properties`
```properties
sonar.web.cors.allowOrigin=http://localhost:5173
```

2. **ZAP** : Lancez ZAP avec l'option CORS
```bash
zap.sh -daemon -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true
```

3. **Wazuh** : Configurez nginx ou ajoutez les headers CORS

### Proxy de développement

Alternative : utilisez un proxy dans `vite.config.ts` :

```ts
export default {
  server: {
    proxy: {
      '/api/sonar': {
        target: 'https://votre-sonarqube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sonar/, '')
      },
      // Ajoutez d'autres proxies...
    }
  }
}
```

## Sécurité en production

⚠️ **Important** : Ne jamais exposer les tokens/passwords dans le code frontend en production !

### Solution recommandée : Backend intermédiaire

Créez une API backend qui :
1. Stocke les credentials de manière sécurisée
2. Fait les appels aux différentes APIs
3. Expose des endpoints sécurisés pour votre frontend

Exemple d'architecture :
```
Frontend (Make) → Votre API Backend → SonarQube/ZAP/Wazuh/Wiki
```

### Variables d'environnement en production

Si vous déployez directement le frontend, utilisez les variables d'environnement de votre plateforme :
- Vercel : Settings → Environment Variables
- Netlify : Site settings → Build & deploy → Environment
- AWS Amplify : App settings → Environment variables

## Test de l'intégration

1. Vérifiez que vos URLs et tokens sont corrects dans `.env.local`
2. Redémarrez le serveur de développement
3. Ouvrez la console du navigateur pour voir les logs d'erreur
4. Vérifiez que les données réelles apparaissent dans le dashboard

## Dépannage

### Les données ne se chargent pas
1. Vérifiez les URLs dans `.env.local`
2. Vérifiez les credentials/tokens
3. Regardez la console pour les erreurs réseau
4. Vérifiez que les services sont accessibles

### Erreur d'authentification
1. Régénérez les tokens
2. Vérifiez les permissions de l'utilisateur
3. Testez les endpoints avec curl/Postman

### Les données ne se rafraîchissent pas
1. Vérifiez le `refreshInterval` dans les hooks
2. Utilisez `refetch()` pour forcer un rafraîchissement
3. Vérifiez la console pour les erreurs

## Exemple complet

Voici un exemple d'intégration dans `Overview.tsx` :

```tsx
import { useSonarQubeProjects } from "../hooks/useSonarQube";
import { useZapSummary } from "../hooks/useZap";
import { useWazuhSummary } from "../hooks/useWazuh";

export function Overview() {
  const sonar = useSonarQubeProjects();
  const zap = useZapSummary();
  const wazuh = useWazuhSummary();

  const isLoading = sonar.loading || zap.loading || wazuh.loading;

  if (isLoading) {
    return <div>Chargement des métriques...</div>;
  }

  return (
    <div>
      <h1>Dashboard Qualité</h1>
      {/* Utilisez sonar.data, zap.data, wazuh.data */}
    </div>
  );
}
```
