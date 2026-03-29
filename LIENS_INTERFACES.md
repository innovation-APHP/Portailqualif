# 🔗 Où trouver les liens vers les interfaces ?

Ce guide visuel vous montre tous les emplacements où vous pouvez accéder aux interfaces natives de SonarQube, OWASP ZAP et Wazuh.

---

## 📍 Emplacement 1 : Barre latérale

**Quand ?** Lorsque vous êtes sur la page d'un outil configuré

**Où exactement ?**
```
┌─────────────────────┐
│ Portail Qualité     │
│ Monitoring & Sécu   │
├─────────────────────┤
│ □ Vue d'ensemble    │
│ □ SonarQube  ◄──────┼── Cliquez sur la page
│   ↳ Ouvrir l'inter. │◄── LE LIEN APPARAÎT ICI
│ □ OWASP ZAP         │
│ □ Wazuh             │
│ ─────────────────── │
│ ⚙ Paramètres        │
└─────────────────────┘
```

**Apparence** :
- Texte bleu petit : "Ouvrir l'interface"
- Icône : ↗ (ExternalLink)
- Indenté sous le nom de l'outil

**Exemple** :
```
☑ SonarQube          ← Page active (surligné en bleu)
  ↗ Ouvrir l'interface  ← Cliquez ici
```

---

## 📍 Emplacement 2 : Bannières de statut

**Quand ?** En haut de chaque page d'outil

**Bannière VERTE (configuré)** :
```
┌─────────────────────────────────────────────────────────┐
│ ✓ SonarQube configuré                                   │
│   Connecté à https://sonarqube.votreentreprise.com      │
│   ↗ Ouvrir SonarQube  ◄── CLIQUEZ ICI                   │
└─────────────────────────────────────────────────────────┘
```

**Bannière JAUNE (non configuré)** :
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ Configuration SonarQube requise                       │
│   Veuillez configurer les paramètres de connexion...   │
│   ⚙ Configurer maintenant  ◄── Va vers Paramètres      │
└─────────────────────────────────────────────────────────┘
```

**Emplacement dans la page** :
```
Analyse SonarQube
Qualité du code et métriques

[BANNIÈRE DE STATUT ICI]  ◄──────────

┌─────────────┬─────────────┬─────────────┐
│ Total Bugs  │ Vulnérab.   │ Code Smells │
│     42      │     18      │     156     │
└─────────────┴─────────────┴─────────────┘
```

---

## 📍 Emplacement 3 : Page Paramètres

**Où ?** À droite du titre de chaque section configurée

```
⚙ Configuration des APIs

┌─────────────────────────────────────────┐
│ SonarQube              Ouvrir l'interface│◄── ICI
│                                          │
│ □ URL: https://sonar...                 │
│ □ Token: ••••••••••                     │
├─────────────────────────────────────────┤
│ OWASP ZAP              Ouvrir l'interface│◄── ET ICI
│                                          │
│ □ URL: http://local...                  │
│ □ API Key: ••••••••••                   │
└─────────────────────────────────────────┘
```

**Apparence** :
- Petit lien bleu
- À droite du titre "SonarQube", "OWASP ZAP", etc.
- Icône ↗

---

## 📍 Emplacement 4 : Vue d'ensemble

**Quand ?** Au moins un outil est configuré

**Bannière en haut de page** :
```
Vue d'ensemble de la qualité
Surveillance en temps réel...

┌─────────────────────────────────────────────────────┐
│ ✓ 3 outils configurés                               │
│                                                     │
│ [SonarQube ↗]  [OWASP ZAP ↗]  [Wazuh ↗]  ◄──── ICI │
└─────────────────────────────────────────────────────┘

Chaque badge est cliquable!
```

**Apparence** :
- Badges blancs avec bordure verte
- Nom de l'outil + icône ↗
- Au survol : fond devient vert clair

---

## 🎯 Récapitulatif visuel

### Parcours utilisateur typique

```
1️⃣ JE CONFIGURE
   ↓
   Page Paramètres
   └─ Lien "Ouvrir l'interface" apparaît
      (à droite du titre)

2️⃣ JE NAVIGUE VERS UN OUTIL
   ↓
   Barre latérale
   └─ Lien "Ouvrir l'interface" apparaît
      (sous le nom de l'outil actif)

3️⃣ JE CONSULTE LA PAGE
   ↓
   Bannière de statut
   └─ Lien "Ouvrir [Outil]" en vert
      (en haut de la page)

4️⃣ JE RETOURNE À L'OVERVIEW
   ↓
   Badges cliquables
   └─ Badge par outil configuré
      (clic = ouvre l'interface)
```

---

## 🖱️ Comportement des liens

### Au clic

**Tous les liens** :
- ✅ S'ouvrent dans un **nouvel onglet**
- ✅ Utilisent `target="_blank"`
- ✅ Avec `rel="noopener noreferrer"` (sécurité)

**URL ouverte** :
- Page d'accueil de l'outil
- Exemples :
  - SonarQube : `https://sonarqube.example.com/`
  - ZAP : `http://localhost:8080/`
  - Wazuh : `https://wazuh.example.com/`

### Visibilité

**Le lien APPARAÎT** quand :
- ✅ L'URL est configurée
- ✅ L'URL n'est PAS la valeur par défaut
  - ❌ `https://sonarqube.example.com` (défaut)
  - ❌ `http://localhost:8080` (défaut ZAP)
  - ❌ `https://wazuh.example.com` (défaut)
  - ✅ `https://sonar.company.com` (RÉEL)

**Le lien N'APPARAÎT PAS** quand :
- ❌ Outil non configuré
- ❌ URL = valeur par défaut

---

## 🎨 Apparence par emplacement

### Style barre latérale
```css
Couleur: Bleu (#2563eb)
Taille: Petit (text-xs)
Au survol: Fond bleu clair
Icône: ↗ (3x3)
Indentation: 32px (ml-8)
```

### Style bannière verte
```css
Couleur: Vert foncé (#166534)
Taille: Petit (text-sm)
Au survol: Vert plus foncé
Icône: ↗ (4x4)
Format: "Ouvrir [NomOutil]"
```

### Style paramètres
```css
Couleur: Bleu (#2563eb)
Taille: Petit (text-sm)
Au survol: Bleu foncé
Icône: ↗ (4x4)
Format: "Ouvrir l'interface"
```

### Style badges Overview
```css
Fond: Blanc
Bordure: Vert (#86efac)
Au survol: Fond vert clair (#dcfce7)
Icône: ↗ (3x3)
Format: "[NomOutil] ↗"
```

---

## 💡 Astuces

### Pour accéder rapidement

**Depuis n'importe où** :
1. Cliquez sur l'outil dans la barre latérale
2. Le lien apparaît sous le nom
3. Cliquez sur "Ouvrir l'interface"

**Raccourci depuis Overview** :
1. Vue d'ensemble (page d'accueil)
2. Bannière en haut avec les badges
3. Clic direct sur le badge

### Pour vérifier la configuration

**Indicateur visuel** :
- Bannière VERTE = Configuré ✅
- Bannière JAUNE = À configurer ⚠️

**Test rapide** :
1. Allez sur la page de l'outil
2. Regardez la couleur de la bannière
3. Si verte → lien visible

---

## 🔍 Debugging : Lien invisible ?

### Checklist

- [ ] Êtes-vous dans la bonne page ?
  - Barre latérale : sur la page de l'outil
  - Bannière : en haut de la page
  
- [ ] L'outil est-il configuré ?
  - Allez dans Paramètres
  - Vérifiez que l'URL et le token sont remplis
  
- [ ] L'URL est-elle réelle ?
  - ❌ `https://sonarqube.example.com` → Pas de lien
  - ✅ `https://sonar.company.com` → Lien visible

- [ ] Avez-vous sauvegardé ?
  - Cliquez sur "Enregistrer la configuration"
  - Attendez le message "Configuration enregistrée"

### Solution

**Si le lien n'apparaît toujours pas** :

1. Ouvrez la console (F12)
2. Tapez : `localStorage.getItem('quality_portal_api_config')`
3. Vérifiez que votre URL est présente
4. Si vide → Reconfigurez dans Paramètres

---

## 📞 Besoin d'aide ?

**Bouton d'aide flottant** :
- En bas à droite de l'écran
- Icône : ? (cercle bleu)
- Cliquez pour ouvrir le centre d'aide

**Documentation** :
- [QUICKSTART.md](./QUICKSTART.md) - Démarrage rapide
- [CONFIGURATION.md](./CONFIGURATION.md) - Guide détaillé
- [README.md](./README.md) - Vue complète

---

**Rappel** : Les liens s'ouvrent toujours dans un **nouvel onglet** ! 🚀
