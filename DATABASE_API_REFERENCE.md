# Référence rapide - PostgreSQL Storage

## 🚀 Activation

**Interface utilisateur :**
1. Aller dans **Paramètres**
2. Section **Base de données PostgreSQL**
3. Activer le toggle
4. Configurer Supabase URL et Anon Key

**Programmatique :**
```typescript
import { saveDatabaseConfig } from './config/database';

saveDatabaseConfig({
  enabled: true,
  supabaseUrl: 'https://xxx.supabase.co',
  supabaseAnonKey: 'eyJ...'
});
```

## 📦 Services disponibles

### 1. Historique des métriques

```typescript
import { metricsHistoryService } from './services/metrics-history.service';

// Créer un snapshot
await metricsHistoryService.createSnapshot(
  'sonarqube',          // source
  'bugs',               // type de métrique
  12,                   // valeur
  {
    projectKey: 'my-project',
    rating: 'B',
    metadata: { branch: 'main' }
  }
);

// Récupérer l'historique (30 derniers jours par défaut)
const history = await metricsHistoryService.getHistory('sonarqube', {
  projectKey: 'my-project',
  metricType: 'bugs',
  days: 30
});

// Calculer la tendance
const trend = await metricsHistoryService.calculateTrend(
  'sonarqube',
  'bugs',
  'my-project'
);
console.log(trend);
// {
//   current: 12,
//   previous: 15,
//   change: -20,        // en pourcentage
//   trend: 'down'       // 'up' | 'down' | 'stable'
// }

// Nettoyer les vieux snapshots
await metricsHistoryService.cleanup(90); // garde 90 jours
```

### 2. Système d'alertes

```typescript
import { alertsService } from './services/alerts.service';

// Créer une alerte
const alert = await alertsService.createAlert({
  name: 'Trop de bugs',
  description: 'Déclencher si > 10 bugs',
  source: 'sonarqube',
  projectKey: 'my-project',
  condition: {
    metric: 'bugs',
    operator: '>',
    threshold: 10
  },
  enabled: true,
  notificationChannels: ['email', 'slack']
});

// Récupérer toutes les alertes
const allAlerts = await alertsService.getAllAlerts();

// Récupérer les alertes actives pour une source
const activeAlerts = await alertsService.getActiveAlerts('sonarqube');

// Vérifier si une métrique déclenche des alertes
const triggered = await alertsService.checkAlerts(
  'sonarqube',
  'bugs',
  15,                    // valeur actuelle
  'my-project'
);

if (triggered.length > 0) {
  console.log(`${triggered.length} alertes déclenchées !`);
}

// Récupérer les alertes non accusées
const unacked = await alertsService.getUnacknowledgedTriggers();

// Accuser réception d'une alerte
await alertsService.acknowledgeAlert(triggerId, 'john.doe');

// Historique des déclenchements (7 derniers jours)
const recent = await alertsService.getRecentTriggers(7);

// Mettre à jour une alerte
await alertsService.updateAlert(alertId, {
  enabled: false,
  threshold: 15
});

// Supprimer une alerte
await alertsService.deleteAlert(alertId);
```

## 🔄 Mode hybride

Les services fonctionnent automatiquement en mode **localStorage** ou **PostgreSQL** selon la configuration.

**Vérifier le mode actif :**

```typescript
import { isDatabaseEnabled } from './config/database';

if (isDatabaseEnabled()) {
  console.log('Mode PostgreSQL actif');
} else {
  console.log('Mode localStorage actif');
}
```

**Hook React :**

```typescript
import { useDatabaseStatus } from './hooks/useDatabaseStatus';

function MyComponent() {
  const { mode, isPostgreSQL, isLocalStorage } = useDatabaseStatus();
  
  return (
    <div>
      Mode actif : {mode}
      {isPostgreSQL && <span>✓ Base de données connectée</span>}
    </div>
  );
}
```

## 🎯 Cas d'usage courants

### Dashboard avec historique

```typescript
import { metricsHistoryService } from './services/metrics-history.service';

async function loadDashboardData() {
  // Récupérer les métriques des 30 derniers jours
  const bugsHistory = await metricsHistoryService.getHistory('sonarqube', {
    metricType: 'bugs',
    days: 30
  });
  
  const coverageHistory = await metricsHistoryService.getHistory('sonarqube', {
    metricType: 'coverage',
    days: 30
  });
  
  // Calculer les tendances
  const bugsTrend = await metricsHistoryService.calculateTrend(
    'sonarqube',
    'bugs'
  );
  
  return {
    bugsHistory,
    coverageHistory,
    bugsTrend
  };
}
```

### Monitoring automatique

```typescript
import { sonarqubeService } from './services/sonarqube.service';
import { metricsHistoryService } from './services/metrics-history.service';
import { alertsService } from './services/alerts.service';

async function monitorProject(projectKey: string) {
  // 1. Récupérer les métriques actuelles
  const metrics = await sonarqubeService.getProjectMetrics(projectKey);
  
  // 2. Créer des snapshots
  await metricsHistoryService.createSnapshot(
    'sonarqube',
    'bugs',
    metrics.bugs,
    { projectKey, rating: metrics.reliability }
  );
  
  await metricsHistoryService.createSnapshot(
    'sonarqube',
    'coverage',
    metrics.coverage,
    { projectKey }
  );
  
  // 3. Vérifier les alertes
  const bugsAlerts = await alertsService.checkAlerts(
    'sonarqube',
    'bugs',
    metrics.bugs,
    projectKey
  );
  
  const coverageAlerts = await alertsService.checkAlerts(
    'sonarqube',
    'coverage',
    metrics.coverage,
    projectKey
  );
  
  // 4. Envoyer des notifications si nécessaire
  const allAlerts = [...bugsAlerts, ...coverageAlerts];
  if (allAlerts.length > 0) {
    console.log(`⚠️ ${allAlerts.length} alertes déclenchées pour ${projectKey}`);
    // TODO: Envoyer notifications (email, Slack, etc.)
  }
  
  return {
    metrics,
    alerts: allAlerts
  };
}

// Exécuter toutes les 15 minutes
setInterval(() => {
  monitorProject('my-project');
}, 15 * 60 * 1000);
```

### Rapport de tendances

```typescript
import { metricsHistoryService } from './services/metrics-history.service';

async function generateTrendReport(projectKey: string) {
  const metrics = ['bugs', 'vulnerabilities', 'coverage'];
  const trends = {};
  
  for (const metric of metrics) {
    const trend = await metricsHistoryService.calculateTrend(
      'sonarqube',
      metric,
      projectKey
    );
    
    if (trend) {
      trends[metric] = {
        ...trend,
        emoji: trend.trend === 'up' ? '📈' : 
               trend.trend === 'down' ? '📉' : '➡️'
      };
    }
  }
  
  return trends;
}

// Exemple de sortie :
// {
//   bugs: { current: 12, previous: 15, change: -20, trend: 'down', emoji: '📉' },
//   coverage: { current: 82, previous: 78, change: 5.13, trend: 'up', emoji: '📈' }
// }
```

## 🛠️ Créer un adapter personnalisé

Si vous voulez utiliser une autre base de données :

```typescript
import { StorageAdapter, BaseEntity, generateId, formatDate } from './storage/adapter';

export class MyCustomAdapter<T extends BaseEntity> implements StorageAdapter<T> {
  constructor(private tableName: string) {}
  
  async getAll(): Promise<T[]> {
    // Votre implémentation
  }
  
  async getById(id: string): Promise<T | null> {
    // Votre implémentation
  }
  
  async create(data: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    // Votre implémentation
  }
  
  async update(id: string, data: Partial<T>): Promise<T> {
    // Votre implémentation
  }
  
  async delete(id: string): Promise<void> {
    // Votre implémentation
  }
  
  async query(filters: Partial<T>): Promise<T[]> {
    // Votre implémentation
  }
}
```

## 📊 Types TypeScript

```typescript
// Snapshot de métrique
interface MetricSnapshot extends BaseEntity {
  source: 'sonarqube' | 'zap' | 'wazuh';
  projectKey?: string;
  metricType: string;
  value: number;
  rating?: string;
  metadata?: Record<string, any>;
}

// Alerte
interface Alert extends BaseEntity {
  name: string;
  description?: string;
  source: 'sonarqube' | 'zap' | 'wazuh';
  projectKey?: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
  };
  enabled: boolean;
  notificationChannels?: ('email' | 'slack' | 'webhook')[];
  lastTriggered?: string;
  triggerCount: number;
}

// Déclenchement d'alerte
interface AlertTrigger extends BaseEntity {
  alertId: string;
  alertName: string;
  metricValue: number;
  threshold: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}
```

## ⚡ Performances

**Opérations rapides :**
- `getAll()` - Récupère toutes les entrées
- `getById()` - Récupère une entrée par ID
- `query()` - Filtrage simple

**Opérations potentiellement lentes :**
- Calcul de tendances sur beaucoup de données
- Vérification de nombreuses alertes

**Optimisations :**
- Utiliser `days` pour limiter l'historique
- Nettoyer régulièrement avec `cleanup()`
- Créer des snapshots périodiques (pas en temps réel)

## 🔒 Sécurité

**En localStorage :**
- Données visibles dans les DevTools
- Pas de chiffrement
- Limité au navigateur

**En PostgreSQL (Supabase) :**
- Row Level Security activé
- Credentials dans localStorage (à sécuriser en prod)
- Audit logs disponibles dans Supabase

**Recommandations production :**
1. Utiliser des variables d'environnement serveur
2. Implémenter Supabase Auth
3. Configurer RLS selon vos besoins
4. Utiliser un backend pour gérer les secrets

## 📝 Logs et debugging

```typescript
// Activer les logs détaillés
localStorage.setItem('debug', 'quality-portal:*');

// Les adapters loggent automatiquement les erreurs
// Vérifier la console pour les messages d'erreur
```

---

**Documentation complète :** Voir [DATABASE_GUIDE.md](./DATABASE_GUIDE.md)
