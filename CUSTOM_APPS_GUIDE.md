# 🎨 Guide des Applications Personnalisées

## Vue d'ensemble

Le portail vous permet maintenant de créer vos **propres applications** en plus des templates prédéfinis (SonarQube, ZAP, Allure Report).

## 🆚 Deux façons d'ajouter une application

### 1. Depuis un Template (Rapide)

**Quand utiliser** : Pour les applications courantes déjà configurées

**Applications disponibles** :
- SonarQube
- OWASP ZAP
- Allure Report

**Procédure** :
1. Paramètres > Applications
2. Bouton **"Depuis template"**
3. Sélectionner l'application
4. Cliquer sur "Ajouter"

### 2. Application Personnalisée (Flexible)

**Quand utiliser** : Pour n'importe quelle autre application

**Exemples d'usage** :
- Grafana
- Jenkins
- GitLab
- Prometheus
- Kibana
- API custom de votre entreprise
- N'importe quelle interface web

**Procédure** :
1. Paramètres > Applications
2. Bouton **"✨ Application personnalisée"**
3. Remplir le formulaire
4. Cliquer sur "Créer l'application"

## 📝 Créer une Application Personnalisée

### Étape 1 : Informations de base

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom** | Nom affiché dans le portail | `Grafana`, `Jenkins` |
| **Description** | Courte description | `Tableaux de bord de monitoring` |
| **Icône** | Icône Lucide React | `BarChart`, `Activity`, `Server` |

### Étape 2 : Type de connexion

#### 🌐 URL Simple

**Utiliser pour** : Applications où vous voulez juste un lien vers l'interface web

**Configuration** :
- URL de l'application
- Pas d'API
- Simple et rapide

**Exemples** :
- Grafana → https://grafana.example.com
- Jenkins → https://jenkins.example.com
- Wiki interne → https://wiki.example.com

#### 🔌 API REST

**Utiliser pour** : Applications dont vous voulez récupérer des données via API

**Configuration** :
- URL de l'API
- Clé API / Token
- Headers personnalisés (optionnel)

**Exemples** :
- API custom d'entreprise
- Prometheus API
- API de métriques personnalisée

### Étape 3 : Champs de configuration

Définissez les champs que l'utilisateur devra remplir pour configurer l'application.

**Champs par défaut selon le type** :

**URL Simple** :
- ✅ URL de l'application (obligatoire)

**API REST** :
- ✅ URL de l'API (obligatoire)
- ✅ Clé API (optionnel)

**Vous pouvez ajouter d'autres champs** :

| Type de champ | Utilisation |
|---------------|-------------|
| **Texte** | Nom d'utilisateur, projet ID, etc. |
| **URL** | URLs d'endpoints |
| **Mot de passe** | Mots de passe (masqués) |
| **Clé API** | Tokens, API keys (masqués) |

**Propriétés d'un champ** :
- **Clé** : Nom technique (ex: `apiKey`, `projectId`)
- **Libellé** : Nom affiché (ex: "Clé API", "ID du projet")
- **Type** : text, url, password, apiKey
- **Placeholder** : Texte d'exemple
- **Aide** : Instructions pour l'utilisateur
- **Obligatoire** : Oui/Non

## 💡 Exemples d'Applications

### Exemple 1 : Grafana (URL Simple)

```
Nom: Grafana
Description: Tableaux de bord de monitoring
Icône: BarChart
Type: URL Simple

Champs de configuration:
  1. baseUrl
     - Libellé: URL Grafana
     - Type: url
     - Obligatoire: Oui
     - Placeholder: https://grafana.example.com
```

### Exemple 2 : Prometheus (API REST)

```
Nom: Prometheus
Description: Système de monitoring et alerting
Icône: Activity
Type: API REST

Champs de configuration:
  1. baseUrl
     - Libellé: URL de l'API Prometheus
     - Type: url
     - Obligatoire: Oui
     - Placeholder: http://prometheus:9090
  
  2. apiKey
     - Libellé: Token d'accès
     - Type: apiKey
     - Obligatoire: Non
     - Aide: Optionnel si Prometheus non sécurisé
```

### Exemple 3 : GitLab (API avec Token)

```
Nom: GitLab
Description: Gestion de code source et CI/CD
Icône: Code2
Type: API REST

Champs de configuration:
  1. baseUrl
     - Libellé: URL GitLab
     - Type: url
     - Obligatoire: Oui
     - Placeholder: https://gitlab.com
  
  2. apiKey
     - Libellé: Personal Access Token
     - Type: apiKey
     - Obligatoire: Oui
     - Aide: Créez un token dans Settings > Access Tokens
  
  3. projectId
     - Libellé: ID du projet
     - Type: text
     - Obligatoire: Non
     - Placeholder: 12345
```

### Exemple 4 : API Custom (Multi-champs)

```
Nom: API Métriques Interne
Description: API de métriques de l'entreprise
Icône: Database
Type: API REST

Champs de configuration:
  1. baseUrl
     - Libellé: URL de l'API
     - Type: url
     - Obligatoire: Oui
  
  2. apiKey
     - Libellé: Clé API
     - Type: apiKey
     - Obligatoire: Oui
  
  3. environment
     - Libellé: Environnement
     - Type: text
     - Obligatoire: Oui
     - Placeholder: production, staging
  
  4. region
     - Libellé: Région
     - Type: text
     - Obligatoire: Non
     - Placeholder: eu-west-1
```

## 🎨 Icônes disponibles

Sélection d'icônes Lucide React :

**Généralistes** :
- Package, Box, Layers

**Code** :
- Code, Code2, Terminal, FileCode

**Sécurité** :
- Shield, ShieldCheck, Lock, Eye

**Fichiers** :
- FileText, FileCheck, File, Folder

**Infrastructure** :
- Server, Database, Cloud, Cpu, HardDrive

**Graphiques** :
- BarChart, PieChart, TrendingUp, LineChart, AreaChart

**Autres** :
- Activity, Globe, Settings, Tool

## ⚙️ Après la création

Une fois l'application créée :

1. **Elle apparaît dans la liste** avec un badge "Non configuré"
2. **Cliquez sur Modifier** (✏️) pour remplir les champs
3. **Activez-la** avec le toggle
4. **Elle apparaît dans le menu** latéral
5. **Cliquez dessus** pour voir la page de l'application

## 🔧 Configuration d'une application

1. Paramètres > Applications
2. Trouvez votre application
3. Cliquez sur **Modifier** (✏️)
4. Remplissez tous les champs obligatoires
5. Cliquez sur **Sauvegarder**

→ L'application passe en statut "Configuré" ✅

## 🗑️ Supprimer une application

1. Paramètres > Applications
2. Trouvez l'application
3. Cliquez sur **Supprimer** (🗑️)
4. Confirmez

⚠️ **Attention** : La suppression est définitive !

## 🔄 Activer/Désactiver

Utilisez le **toggle** à côté de chaque application :
- ✅ Activé → Visible dans le menu
- ❌ Désactivé → Masqué du menu (config conservée)

## 📊 Cas d'usage

### Portail DevOps complet

```
Applications:
- GitLab (API) → Statistiques repos
- Jenkins (URL) → Lien vers CI/CD
- SonarQube (Template) → Qualité code
- Grafana (URL) → Dashboards
- Prometheus (API) → Métriques
- Kibana (URL) → Logs
```

### Portail Sécurité

```
Applications:
- OWASP ZAP (Template) → Scan sécu
- SonarQube (Template) → Vulnérabilités code
- Wazuh (Custom URL) → SIEM
- Vault (Custom API) → Secrets
```

### Portail Monitoring

```
Applications:
- Grafana (Custom URL) → Dashboards
- Prometheus (Custom API) → Métriques
- Alertmanager (Custom URL) → Alertes
- Loki (Custom API) → Logs
```

## 🎯 Bonnes pratiques

1. **Nom clair** : Utilisez le nom officiel de l'outil
2. **Description précise** : Expliquez l'usage en 1 phrase
3. **Icône appropriée** : Choisissez une icône évocatrice
4. **Champs nécessaires** : Seulement ce qui est vraiment requis
5. **Aide contextuelle** : Ajoutez des helpText pour guider
6. **Type correct** : URL pour liens, API pour données

## 🚀 Prochaines étapes

Après avoir créé vos applications :

1. ✅ Configurez les URLs et clés API
2. ✅ Activez les applications souhaitées
3. ✅ Testez l'accès via le menu
4. ✅ Partagez le portail avec votre équipe

## 💾 Stockage

Les applications personnalisées sont stockées dans :
- **localStorage** : `quality_portal_applications`
- **PostgreSQL** (si activé) : Table `applications`

## ❓ FAQ

**Q: Puis-je modifier une application après création ?**
R: Pas l'application elle-même, mais vous pouvez modifier sa configuration. Pour changer les champs, supprimez et recréez.

**Q: Combien d'applications puis-je créer ?**
R: Illimité ! Mais pour la performance, restez raisonnable (< 20)

**Q: Les applications personnalisées peuvent-elles récupérer des données ?**
R: Actuellement, seule la configuration est gérée. L'intégration API complète est une future fonctionnalité.

**Q: Puis-je exporter/importer mes applications ?**
R: Oui, via localStorage :
```javascript
// Export
const apps = localStorage.getItem('quality_portal_applications');
console.log(apps);

// Import
localStorage.setItem('quality_portal_applications', appsJSON);
```

**Q: Que se passe-t-il si je supprime une application template ?**
R: Vous pouvez la rajouter depuis "Depuis template"

## 🔮 Futures améliorations

- [ ] Intégration API automatique
- [ ] Templates de dashboards personnalisés
- [ ] Import/export d'applications
- [ ] Marketplace d'applications
- [ ] Webhooks et notifications
- [ ] Édition des champs après création
