# Guide d'intégration des APIs

Ce document explique comment le Portail Qualité se connecte aux APIs SonarQube, OWASP ZAP et Wazuh.

## Architecture

```
Configuration (localStorage ou env)
         ↓
    useApiConfig hook
         ↓
    API Services (/src/app/services/)
         ↓
    Custom Hooks (/src/app/hooks/)
         ↓
    React Components
```

## Configuration

### Hook `useApiConfig`

Localisation : `/src/app/hooks/useApiConfig.ts`

```typescript
import { useApiConfig } from "../hooks/useApiConfig";

function MyComponent() {
  const { config, updateConfig, resetConfig, isConfigured } = useApiConfig();
  
  // Accéder à la configuration
  console.log(config.sonarqube.baseUrl);
  
  // Vérifier si un service est configuré
  if (isConfigured('sonarqube')) {
    // Service prêt
  }
  
  // Mettre à jour la configuration
  updateConfig({
    sonarqube: {
      baseUrl: 'https://new-url.com',
      token: 'new-token'
    }
  });
}
```

## Services API

### SonarQube Service

Localisation : `/src/app/services/sonarqube.service.ts`

```typescript
import { sonarqubeService } from '../services/sonarqube.service';

// Récupérer les métriques d'un projet
const metrics = await sonarqubeService.getProjectMetrics('my-project-key');

// Récupérer les issues
const issues = await sonarqubeService.getIssues('my-project-key');

// Récupérer la couverture
const coverage = await sonarqubeService.getCoverage('my-project-key');
```

### OWASP ZAP Service

Localisation : `/src/app/services/zap.service.ts`

```typescript
import { zapService } from '../services/zap.service';

// Récupérer le résumé des alertes
const summary = await zapService.getAlertsSummary();

// Récupérer les alertes détaillées
const alerts = await zapService.getAlerts();

// Lancer un scan
await zapService.startScan('https://target-url.com');
```

### Wazuh Service

Localisation : `/src/app/services/wazuh.service.ts`

```typescript
import { wazuhService } from '../services/wazuh.service';

// S'authentifier (requis avant autres appels)
await wazuhService.authenticate();

// Récupérer les agents
const agents = await wazuhService.getAgents();

// Récupérer les alertes
const alerts = await wazuhService.getAlerts();

// Récupérer les statistiques
const stats = await wazuhService.getSecurityStats();
```

## Hooks personnalisés

### useSonarQube

```typescript
import { useSonarQube } from '../hooks/useSonarQube';

function MyComponent() {
  const { data, loading, error, refetch } = useSonarQube('project-key');
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  
  return <div>{data.metrics.bugs} bugs</div>;
}
```

### useZap

```typescript
import { useZap } from '../hooks/useZap';

function MyComponent() {
  const { alerts, summary, loading, error } = useZap();
  
  return <div>{summary.high} alertes élevées</div>;
}
```

### useWazuh

```typescript
import { useWazuh } from '../hooks/useWazuh';

function MyComponent() {
  const { agents, alerts, loading, error } = useWazuh();
  
  return <div>{agents.length} agents actifs</div>;
}
```

## Gestion des erreurs

### Erreurs réseau

```typescript
try {
  const data = await sonarqubeService.getProjectMetrics('project-key');
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Erreur d\'authentification');
  } else if (error.response?.status === 404) {
    console.error('Projet non trouvé');
  } else {
    console.error('Erreur réseau:', error.message);
  }
}
```

### Fallback vers données mockées

```typescript
import { useSonarQube } from '../hooks/useSonarQube';
import { sonarqubeData } from '../data/mockData';

function MyComponent() {
  const { data, loading, error } = useSonarQube('project-key');
  
  // Utiliser les données mockées en cas d'erreur
  const displayData = error ? sonarqubeData : data;
  
  return <div>{displayData.projects.length} projets</div>;
}
```

## CORS et Proxy

### Problème CORS

Les navigateurs bloquent les requêtes cross-origin. Solutions :

#### 1. Configuration serveur (Recommandé pour production)

Configurez les en-têtes CORS sur vos serveurs API :

```
Access-Control-Allow-Origin: https://votre-portail.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

#### 2. Proxy de développement

Dans `vite.config.ts` :

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api/sonarqube': {
        target: 'https://sonarqube.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sonarqube/, '')
      },
      '/api/zap': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/zap/, '')
      }
    }
  }
});
```

## Authentification

### SonarQube (Token)

```typescript
// En-tête automatiquement ajouté par le service
headers: {
  'Authorization': `Bearer ${config.sonarqube.token}`
}
```

### OWASP ZAP (API Key)

```typescript
// Paramètre query automatiquement ajouté
params: {
  'apikey': config.zap.apiKey
}
```

### Wazuh (Basic Auth)

```typescript
// Authentification en deux étapes
// 1. Obtenir le token JWT
const token = await wazuhService.authenticate();

// 2. Utiliser le token pour les requêtes suivantes
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Optimisations

### Cache des requêtes

```typescript
import { useQuery } from 'react-query'; // Exemple avec react-query

function useSonarQubeWithCache(projectKey: string) {
  return useQuery(
    ['sonarqube', projectKey],
    () => sonarqubeService.getProjectMetrics(projectKey),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}
```

### Requêtes parallèles

```typescript
// Charger plusieurs projets en parallèle
const projectKeys = ['project-1', 'project-2', 'project-3'];
const results = await Promise.all(
  projectKeys.map(key => sonarqubeService.getProjectMetrics(key))
);
```

### Pagination

```typescript
// Récupérer les résultats page par page
async function getAllAlerts() {
  let page = 1;
  let allAlerts = [];
  let hasMore = true;
  
  while (hasMore) {
    const response = await zapService.getAlerts({ page, pageSize: 100 });
    allAlerts = [...allAlerts, ...response.alerts];
    hasMore = response.total > page * 100;
    page++;
  }
  
  return allAlerts;
}
```

## Tests

### Test d'un service

```typescript
import { sonarqubeService } from '../services/sonarqube.service';

describe('SonarQube Service', () => {
  it('should fetch project metrics', async () => {
    const metrics = await sonarqubeService.getProjectMetrics('test-project');
    expect(metrics).toBeDefined();
    expect(metrics.bugs).toBeGreaterThanOrEqual(0);
  });
});
```

### Mock des services

```typescript
jest.mock('../services/sonarqube.service', () => ({
  sonarqubeService: {
    getProjectMetrics: jest.fn().mockResolvedValue({
      bugs: 10,
      vulnerabilities: 5,
      coverage: 80
    })
  }
}));
```

## Endpoints API

### SonarQube

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/measures/component` | GET | Métriques d'un composant |
| `/api/issues/search` | GET | Liste des issues |
| `/api/projects/search` | GET | Liste des projets |

### OWASP ZAP

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/JSON/core/view/alerts/` | GET | Liste des alertes |
| `/JSON/core/view/alertsSummary/` | GET | Résumé des alertes |
| `/JSON/ascan/action/scan/` | GET | Lancer un scan |

### Wazuh

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/security/user/authenticate` | POST | Authentification |
| `/agents` | GET | Liste des agents |
| `/security/alerts` | GET | Liste des alertes |

## Documentation API officielle

- **SonarQube** : https://docs.sonarqube.org/latest/extend/web-api/
- **OWASP ZAP** : https://www.zaproxy.org/docs/api/
- **Wazuh** : https://documentation.wazuh.com/current/user-manual/api/reference.html

---

**Note** : Les services actuels sont des squelettes. Implémentez les vraies requêtes HTTP selon vos besoins.
