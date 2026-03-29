# 🗄️ Système de base de données PostgreSQL - Architecture complète

## 📋 Vue d'ensemble

Votre portail qualité dispose maintenant d'un **système de stockage flexible** qui supporte deux modes :

### Mode 1 : Frontend-only (localStorage)
- ✅ **Activé par défaut**
- ✅ Aucune configuration requise
- ✅ Données stockées localement dans le navigateur
- ⚠️ Limité à un seul utilisateur/navigateur
- ⚠️ Pas d'historique long terme

### Mode 2 : PostgreSQL via Supabase (optionnel)
- 🚀 Historique complet des métriques
- 🚀 Calcul de tendances sur 30/60/90 jours
- 🚀 Système d'alertes avancé
- 🚀 Synchronisation multi-utilisateurs
- 🚀 Analyses et rapports avancés

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Application Layer                   │
│  (Components, Pages, Hooks)                     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│            Services Layer                        │
│  • metricsHistoryService                        │
│  • alertsService                                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Storage Adapter (Factory)               │
│  Bascule automatiquement selon config           │
└─────────┬────────────────────────────┬──────────┘
          │                            │
┌─────────▼────────┐      ┌───────────▼─────────┐
│ LocalStorage     │      │  PostgreSQL         │
│ Adapter          │      │  Adapter            │
│                  │      │  (Supabase)         │
└──────────────────┘      └─────────────────────┘
```

## 📁 Structure des fichiers

```
src/app/
├── config/
│   ├── api.ts                      # Config APIs existante
│   ├── database.ts                 # ✨ Config PostgreSQL
│   └── database-schema.ts          # ✨ Schéma SQL
│
├── storage/
│   ├── adapter.ts                  # ✨ Interface commune
│   ├── localStorage.adapter.ts     # ✨ Implémentation localStorage
│   ├── postgresql.adapter.ts       # ✨ Implémentation PostgreSQL
│   └── index.ts                    # ✨ Factory
│
├── services/
│   ├── sonarqube.service.ts        # Service existant
│   ├── wazuh.service.ts            # Service existant
│   ├── zap.service.ts              # Service existant
│   ├── metrics-history.service.ts  # ✨ Historique métriques
│   └── alerts.service.ts           # ✨ Système d'alertes
│
├── hooks/
│   ├── useApiConfig.ts             # Hook existant
│   └── useDatabaseStatus.ts        # ✨ Hook statut DB
│
└── components/
    ├── SettingsPage.tsx            # ✨ Modifié (ajout section DB)
    ├── DatabaseConfigSection.tsx   # ✨ Config PostgreSQL
    ├── DatabaseStatusBadge.tsx     # ✨ Badge de statut
    ├── DatabaseExample.tsx         # ✨ Exemple d'utilisation
    └── DashboardLayout.tsx         # ✨ Modifié (badge)

Documentation/
├── DATABASE_GUIDE.md               # ✨ Guide complet utilisateur
└── DATABASE_API_REFERENCE.md       # ✨ Référence API développeur
```

## 🚀 Comment l'utiliser

### 1. Activation (Interface utilisateur)

1. Allez dans **Paramètres**
2. Section **Base de données PostgreSQL**
3. Activez le toggle
4. Suivez les instructions pour configurer Supabase
5. Collez vos credentials (URL + Anon Key)
6. ✅ C'est tout ! L'application bascule automatiquement

### 2. Utilisation dans le code

#### Créer des snapshots de métriques

```typescript
import { metricsHistoryService } from './services/metrics-history.service';

// Lors de la récupération des métriques SonarQube
const metrics = await sonarqubeService.getProjectMetrics('my-project');

// Créer un snapshot
await metricsHistoryService.createSnapshot(
  'sonarqube',
  'bugs',
  metrics.bugs,
  {
    projectKey: 'my-project',
    rating: metrics.reliability,
    metadata: { branch: 'main' }
  }
);
```

#### Afficher l'historique dans un graphique

```typescript
// Récupérer les 30 derniers jours
const history = await metricsHistoryService.getHistory('sonarqube', {
  projectKey: 'my-project',
  metricType: 'bugs',
  days: 30
});

// Utiliser dans Recharts
<LineChart data={history.map(snap => ({
  date: new Date(snap.createdAt).toLocaleDateString(),
  value: snap.value
}))}>
  <Line dataKey="value" stroke="#3b82f6" />
</LineChart>
```

#### Calculer des tendances

```typescript
const trend = await metricsHistoryService.calculateTrend(
  'sonarqube',
  'bugs',
  'my-project'
);

if (trend) {
  console.log(`Bugs : ${trend.current} (${trend.change > 0 ? '+' : ''}${trend.change}%)`);
  console.log(`Tendance : ${trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '➡️'}`);
}
```

#### Créer des alertes

```typescript
import { alertsService } from './services/alerts.service';

// Créer une alerte
await alertsService.createAlert({
  name: 'Bugs critiques',
  description: 'Trop de bugs dans le projet',
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
  currentBugsCount,
  'my-project'
);

if (triggered.length > 0) {
  // Envoyer des notifications
}
```

### 3. Badge de statut

Le badge en haut à droite indique le mode actif :
- 🟢 **PostgreSQL** : Base de données activée
- ⚪ **Local** : Mode localStorage

## 🔄 Migration et compatibilité

### Le système est rétro-compatible

- Si PostgreSQL n'est pas activé → **localStorage** (comme avant)
- Si PostgreSQL est activé → **PostgreSQL** automatiquement
- Vous pouvez **basculer à tout moment** sans casser l'application

### Les données ne sont pas perdues

- Les données localStorage restent accessibles
- Les données PostgreSQL sont persistantes
- Vous pouvez utiliser les deux en parallèle

## 📊 Tables PostgreSQL

### `metrics_snapshots`
Stocke les snapshots de métriques pour créer un historique

**Colonnes :**
- `id` : Identifiant unique
- `source` : 'sonarqube' | 'zap' | 'wazuh'
- `project_key` : Clé du projet (optionnel)
- `metric_type` : Type de métrique (bugs, coverage, etc.)
- `value` : Valeur numérique
- `rating` : Note (A, B, C, D, E)
- `metadata` : Données supplémentaires (JSON)
- `created_at` : Date de création

**Index :**
- Par source, projet, type, date

### `alerts`
Stocke les alertes configurées par l'utilisateur

**Colonnes :**
- `id` : Identifiant unique
- `name` : Nom de l'alerte
- `description` : Description
- `source` : Source de données
- `project_key` : Projet concerné
- `condition` : Condition de déclenchement (JSON)
- `enabled` : Activée ou non
- `notification_channels` : Canaux de notification
- `last_triggered` : Dernier déclenchement
- `trigger_count` : Nombre de déclenchements

### `alert_triggers`
Historique des déclenchements d'alertes

**Colonnes :**
- `id` : Identifiant unique
- `alert_id` : Référence à l'alerte
- `alert_name` : Nom de l'alerte
- `metric_value` : Valeur ayant déclenché l'alerte
- `threshold` : Seuil de l'alerte
- `acknowledged` : Accusé de réception
- `acknowledged_by` : Par qui
- `acknowledged_at` : Quand
- `created_at` : Date de déclenchement

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé :

```sql
ALTER TABLE metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_triggers ENABLE ROW LEVEL SECURITY;
```

**Par défaut :** Accès complet pour les utilisateurs authentifiés

**Pour la production :** Modifiez les politiques selon vos besoins

### Gestion des secrets

⚠️ **Actuellement :** Les credentials sont dans localStorage

**Pour la production :**
1. Variables d'environnement serveur
2. Backend avec gestion des secrets
3. Supabase Auth pour l'authentification

## 📈 Cas d'usage

### 1. Dashboard avec tendances
Afficher l'évolution des métriques sur 30 jours

### 2. Alertes automatiques
Recevoir des notifications quand un seuil est dépassé

### 3. Rapports périodiques
Générer des rapports hebdomadaires/mensuels

### 4. Comparaisons historiques
Comparer les performances entre différentes périodes

### 5. Monitoring continu
Exécuter des checks automatiques toutes les 15 minutes

## 🛠️ Développement

### Ajouter un nouveau type de métrique

1. Créer des snapshots dans votre service :

```typescript
await metricsHistoryService.createSnapshot(
  'sonarqube',
  'new_metric',
  value
);
```

2. Créer des alertes :

```typescript
await alertsService.createAlert({
  name: 'Ma nouvelle alerte',
  source: 'sonarqube',
  condition: {
    metric: 'new_metric',
    operator: '>',
    threshold: 100
  },
  enabled: true
});
```

### Ajouter une nouvelle source

Le système supporte déjà 3 sources :
- `sonarqube`
- `zap`
- `wazuh`

Pour en ajouter une, modifiez les types dans `metrics-history.service.ts` et `alerts.service.ts`.

## 📚 Documentation

- **[DATABASE_GUIDE.md](./DATABASE_GUIDE.md)** - Guide complet utilisateur
- **[DATABASE_API_REFERENCE.md](./DATABASE_API_REFERENCE.md)** - Référence API développeur

## ✅ Checklist d'implémentation

- [x] Architecture Storage Adapter
- [x] Implémentation localStorage
- [x] Implémentation PostgreSQL (Supabase)
- [x] Service historique métriques
- [x] Service alertes
- [x] Configuration UI
- [x] Hook useDatabaseStatus
- [x] Badge de statut
- [x] Schéma SQL complet
- [x] Documentation utilisateur
- [x] Documentation développeur
- [x] Exemple d'utilisation

## 🎯 Prochaines étapes

### Pour tester le système :

1. ✅ Activer PostgreSQL dans Paramètres
2. 📊 Créer des snapshots de test
3. 🔔 Configurer des alertes
4. 📈 Analyser les tendances
5. 🚀 Intégrer dans vos workflows

### Améliorations futures possibles :

- [ ] Interface de gestion des alertes
- [ ] Notifications par email/Slack
- [ ] Export des données en CSV/Excel
- [ ] Graphiques de tendances dans le dashboard
- [ ] Automatisation de la création de snapshots
- [ ] Système de tags pour les métriques
- [ ] Comparaison entre projets
- [ ] Rapports automatiques
- [ ] Webhooks pour les alertes
- [ ] API REST pour accès externe

## 💡 Conseils

### Performance
- Créez des snapshots périodiquement (pas en temps réel)
- Nettoyez régulièrement les vieux snapshots
- Limitez l'historique à 30-90 jours

### Sécurité
- Configurez RLS en production
- Utilisez Supabase Auth
- Ne stockez pas de données sensibles

### Maintenance
- Surveillez la taille de la base
- Archivez les vieilles données
- Testez les alertes régulièrement

---

**Système créé le :** ${new Date().toLocaleDateString('fr-FR')}
**Version :** 1.0.0
**Compatibilité :** Rétro-compatible avec le mode localStorage existant
