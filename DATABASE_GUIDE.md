# Configuration de la base de données PostgreSQL

Ce portail qualité supporte deux modes de fonctionnement :

## 🎯 Modes disponibles

### 1️⃣ Mode Frontend-only (par défaut)
- ✅ **Aucune configuration requise**
- ✅ Fonctionne immédiatement
- ✅ Données stockées dans localStorage
- ✅ Parfait pour tester ou usage personnel

**Limitations :**
- Données limitées au navigateur local
- Pas d'historique long terme
- Pas de synchronisation multi-utilisateurs

### 2️⃣ Mode PostgreSQL (optionnel)
- 🚀 **Historique complet des métriques**
- 🚀 Calcul des tendances
- 🚀 Système d'alertes avancé
- 🚀 Synchronisation entre utilisateurs
- 🚀 Analyses avancées

## 📊 Données stockées en PostgreSQL

Quand activé, PostgreSQL stocke :

### 1. **Snapshots de métriques** (`metrics_snapshots`)
```typescript
{
  id: string;
  source: 'sonarqube' | 'zap' | 'wazuh';
  projectKey?: string;
  metricType: string;  // bugs, vulnerabilities, coverage, etc.
  value: number;
  rating?: string;     // A, B, C, D, E
  metadata?: object;
  createdAt: timestamp;
}
```

**Usage :**
- Créer un historique des métriques
- Calculer les tendances (hausse/baisse)
- Générer des graphiques d'évolution
- Comparer les performances

**Exemple :**
```typescript
import { metricsHistoryService } from './services/metrics-history.service';

// Enregistrer un snapshot
await metricsHistoryService.createSnapshot(
  'sonarqube',
  'bugs',
  12,
  { projectKey: 'my-project', rating: 'B' }
);

// Récupérer l'historique
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
// => { current: 12, previous: 15, change: -20, trend: 'down' }
```

### 2. **Alertes configurées** (`alerts`)
```typescript
{
  id: string;
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
  lastTriggered?: timestamp;
  triggerCount: number;
}
```

**Usage :**
- Créer des alertes personnalisées
- Surveiller les seuils critiques
- Recevoir des notifications

**Exemple :**
```typescript
import { alertsService } from './services/alerts.service';

// Créer une alerte
await alertsService.createAlert({
  name: 'Bugs critiques',
  description: 'Alerte si plus de 10 bugs',
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

// Vérifier si les alertes doivent être déclenchées
const triggered = await alertsService.checkAlerts(
  'sonarqube',
  'bugs',
  15,
  'my-project'
);
```

### 3. **Historique des déclenchements** (`alert_triggers`)
```typescript
{
  id: string;
  alertId: string;
  alertName: string;
  metricValue: number;
  threshold: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: timestamp;
  createdAt: timestamp;
}
```

**Usage :**
- Log de tous les déclenchements
- Suivi des alertes non accusées
- Audit et traçabilité

**Exemple :**
```typescript
// Récupérer les alertes non accusées
const unacked = await alertsService.getUnacknowledgedTriggers();

// Accuser réception
await alertsService.acknowledgeAlert(triggerId, 'john.doe');

// Historique récent
const recent = await alertsService.getRecentTriggers(7);
```

## 🔧 Installation et configuration

### Étape 1 : Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez le nom de votre projet

### Étape 2 : Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Ouvrez la page **Paramètres** de votre portail qualité
3. Activez l'option **Base de données PostgreSQL**
4. Cliquez sur **Afficher le schéma de base de données**
5. Copiez le script SQL complet
6. Retournez dans Supabase SQL Editor
7. Collez et exécutez le script
8. Vérifiez que les 3 tables sont créées

### Étape 3 : Récupérer les credentials

1. Dans Supabase, allez dans **Settings** → **API**
2. Copiez **Project URL** (commence par `https://xxx.supabase.co`)
3. Copiez **anon public** key (longue chaîne commençant par `eyJ...`)

### Étape 4 : Configurer le portail

1. Dans la page **Paramètres** du portail
2. Section **Base de données PostgreSQL**
3. Collez **Supabase URL**
4. Collez **Supabase Anon Key**
5. La configuration est automatiquement sauvegardée

### Étape 5 : Vérifier le fonctionnement

L'application bascule automatiquement en mode PostgreSQL !

Les services (`metricsHistoryService`, `alertsService`) utilisent maintenant la base de données au lieu de localStorage.

## 🔐 Sécurité

### Row Level Security (RLS)

Le schéma SQL active automatiquement RLS sur toutes les tables :

```sql
ALTER TABLE metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_triggers ENABLE ROW LEVEL SECURITY;
```

**Par défaut :** Tous les utilisateurs authentifiés ont accès complet.

**Pour la production :** Modifiez les politiques RLS selon vos besoins :

```sql
-- Exemple : Limiter aux utilisateurs de leur organisation
CREATE POLICY "org_access_metrics"
  ON metrics_snapshots
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'org_id' = org_id);
```

### Gestion des secrets

⚠️ **Important :** Le portail stocke actuellement les credentials dans localStorage.

**Pour la production :**
1. Utilisez des variables d'environnement
2. Implémentez un backend avec gestion des secrets
3. Utilisez Supabase Auth pour l'authentification

## 🛠️ Architecture technique

### Couche d'abstraction

Le système utilise une **Factory Pattern** pour basculer entre les modes :

```typescript
// storage/index.ts
export function createStorageAdapter<T>(
  key: string,
  tableName?: string
): StorageAdapter<T> {
  if (isDatabaseEnabled() && tableName) {
    return new PostgreSQLAdapter<T>(tableName);
  }
  return new LocalStorageAdapter<T>(key);
}
```

### Usage dans les services

```typescript
// services/metrics-history.service.ts
export class MetricsHistoryService {
  private adapter = createStorageAdapter<MetricSnapshot>(
    'metrics_history',    // Clé localStorage
    'metrics_snapshots'   // Nom table PostgreSQL
  );
  
  // Les méthodes utilisent automatiquement le bon adapter
  async createSnapshot(...) {
    return this.adapter.create(...);
  }
}
```

### Fonctionnalités PostgreSQL avancées

#### 1. Nettoyage automatique

```sql
-- Nettoie les métriques de plus de 90 jours
SELECT cleanup_old_metrics(90);
```

Ou via le service :

```typescript
await metricsHistoryService.cleanup(90);
```

#### 2. Statistiques

```sql
-- Vue des statistiques par source
SELECT * FROM get_metrics_stats('sonarqube');
```

#### 3. Vue récapitulative

```sql
-- Alertes actives avec stats
SELECT * FROM active_alerts_summary;
```

## 📈 Cas d'usage

### 1. Dashboard de tendances

```typescript
// Afficher l'évolution des bugs sur 30 jours
const history = await metricsHistoryService.getHistory('sonarqube', {
  metricType: 'bugs',
  days: 30
});

const chartData = history.map(snap => ({
  date: snap.createdAt,
  value: snap.value
}));
```

### 2. Système d'alertes

```typescript
// Lors de chaque analyse SonarQube
const currentBugs = await sonarqubeService.getProjectMetrics('my-project');

// Vérifier les alertes
const triggered = await alertsService.checkAlerts(
  'sonarqube',
  'bugs',
  currentBugs.bugs,
  'my-project'
);

if (triggered.length > 0) {
  // Envoyer des notifications
  triggered.forEach(alert => {
    sendNotification(alert);
  });
}
```

### 3. Comparaison historique

```typescript
// Comparer avec la même période l'année dernière
const trend = await metricsHistoryService.calculateTrend(
  'sonarqube',
  'coverage',
  'my-project'
);

console.log(`Couverture: ${trend.current}% (${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}%)`);
```

## ❓ FAQ

### Puis-je migrer de localStorage vers PostgreSQL ?

Oui ! Les données localStorage ne sont pas perdues. Vous pouvez :
1. Exporter les données localStorage
2. Les importer dans PostgreSQL via script
3. Ou simplement commencer à accumuler de nouvelles données

### Puis-je désactiver PostgreSQL plus tard ?

Oui, désactivez simplement l'option dans les paramètres. L'application rebascule automatiquement sur localStorage.

### Quelle quantité de données puis-je stocker ?

**Plan gratuit Supabase :**
- 500 MB de stockage
- 2 GB de bande passante/mois

Largement suffisant pour des milliers de snapshots !

### Puis-je utiliser une autre base PostgreSQL ?

Oui ! Le code utilise Supabase mais fonctionne avec n'importe quel PostgreSQL. Vous devrez :
1. Adapter `postgresql.adapter.ts` pour utiliser `pg` au lieu de `@supabase/supabase-js`
2. Gérer l'authentification vous-même

## 🎓 Prochaines étapes

1. ✅ Activer PostgreSQL via les paramètres
2. 📊 Créer des snapshots périodiques de vos métriques
3. 🔔 Configurer vos premières alertes
4. 📈 Analyser les tendances
5. 🚀 Intégrer des notifications (email, Slack, etc.)

---

**Besoin d'aide ?** Consultez la [documentation Supabase](https://supabase.com/docs) ou créez une issue.
