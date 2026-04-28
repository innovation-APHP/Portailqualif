# ⚡ Guide Rapide - Créer une Application Personnalisée

## 🎯 En 3 minutes

### 1. Ouvrir le formulaire

Paramètres > Applications > **✨ Application personnalisée**

### 2. Remplir le formulaire

**Informations de base** :
- Nom : `Grafana`
- Description : `Tableaux de bord de monitoring`
- Icône : `BarChart`

**Type de connexion** :
- 🌐 **URL Simple** → Pour juste un lien vers l'interface
- 🔌 **API REST** → Pour récupérer des données via API

**Champs de configuration** :
- Ajoutés automatiquement selon le type choisi
- Cliquez sur "+ Ajouter un champ" pour en ajouter d'autres

### 3. Créer

Cliquez sur **"Créer l'application"** → ✅ Application créée !

---

## 📋 Deux types d'applications

### Type 1️⃣ : URL Simple

**Pour quoi** : Juste afficher un lien vers une interface web

**Exemples** :
- Grafana → https://grafana.example.com
- Jenkins → https://jenkins.example.com
- Wiki → https://wiki.example.com

**Champs par défaut** :
- URL de l'application

### Type 2️⃣ : API REST

**Pour quoi** : Récupérer des données via API (future intégration)

**Exemples** :
- API Prometheus
- API GitLab
- API custom d'entreprise

**Champs par défaut** :
- URL de l'API
- Clé API

---

## 🎨 Exemple complet : Grafana

```
📝 INFORMATIONS
Nom: Grafana
Description: Tableaux de bord de monitoring
Icône: BarChart

🔌 TYPE
☑ URL Simple
☐ API REST

⚙️ CONFIGURATION
Champ 1:
  Clé: baseUrl
  Libellé: URL Grafana
  Type: url
  Obligatoire: ✅
  Placeholder: https://grafana.example.com

→ Cliquer sur "Créer l'application"
```

**Résultat** :
- Application "Grafana" créée
- Visible dans la liste avec badge "Non configuré"
- Prête à être configurée

---

## 🎨 Exemple complet : Prometheus API

```
📝 INFORMATIONS
Nom: Prometheus
Description: Système de monitoring
Icône: Activity

🔌 TYPE
☐ URL Simple
☑ API REST

⚙️ CONFIGURATION
Champ 1:
  Clé: baseUrl
  Libellé: URL de l'API
  Type: url
  Obligatoire: ✅
  Placeholder: http://prometheus:9090

Champ 2:
  Clé: apiKey
  Libellé: Token d'accès
  Type: apiKey
  Obligatoire: ❌
  Aide: Optionnel si non sécurisé

→ Cliquer sur "Créer l'application"
```

---

## ⚙️ Configurer l'application après création

1. Retour sur **Paramètres > Applications**
2. Trouvez votre application dans la liste
3. Cliquez sur **Modifier** (✏️)
4. Remplissez les champs :
   - URL Grafana : `https://grafana.mycompany.com`
5. Cliquez sur **Sauvegarder**

→ Application passe en "Configuré" ✅

---

## ✅ Activer l'application

Dans la liste, utilisez le **toggle** :
- Activé → Visible dans le menu latéral
- Désactivé → Masqué (mais config conservée)

---

## 🎯 Workflow complet

```
1. Créer l'application personnalisée
   ↓
2. Configurer les URLs/clés
   ↓
3. Activer l'application
   ↓
4. Elle apparaît dans le menu
   ↓
5. Cliquer dessus pour y accéder
```

---

## 🆚 Quand utiliser quoi ?

| Situation | Solution |
|-----------|----------|
| Application courante (SonarQube, ZAP) | **Depuis template** |
| Grafana, Jenkins, autre outil | **Application personnalisée** |
| API custom de l'entreprise | **Application personnalisée (API)** |
| Lien vers wiki/doc interne | **Application personnalisée (URL)** |

---

## 💡 Astuces

✅ **Nommage** : Utilisez le nom officiel (Grafana, pas "Graff")
✅ **Description** : 1 phrase claire sur l'usage
✅ **Icône** : Choisissez une icône évocatrice
✅ **Champs** : Seulement ce qui est nécessaire
✅ **Aide** : Ajoutez des helpText pour guider

---

## 🗑️ Supprimer

Bouton **Supprimer** (🗑️) à côté de chaque application
⚠️ Suppression définitive !

---

## 📖 Documentation complète

Consultez `CUSTOM_APPS_GUIDE.md` pour :
- Liste complète des icônes
- Exemples avancés
- Cas d'usage
- FAQ

---

**C'est tout !** En 3 minutes vous pouvez ajouter n'importe quelle application à votre portail 🎉
