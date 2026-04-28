# 🚀 COMMENCEZ ICI - Portail Qualité

## ⚡ Démarrage rapide en 5 minutes

### 1️⃣ Première connexion (1 min)

```
URL: http://localhost:3000
Mode: Public (lecture seule)
```

Pour accéder aux paramètres :
- Cliquez sur **"🔒 Connexion Admin"** dans le menu
- Username : `admin`
- Password : `admin123`
- Cliquez sur **"Se connecter"**

### 2️⃣ Sécuriser l'accès (1 min)

Une fois connecté :
- Allez dans **Paramètres > Sécurité**
- Changez username et password
- **Notez-les** quelque part !

### 3️⃣ Ajouter vos applications (2 min)

Paramètres > Applications > Au choix :

**Option A** : Template (rapide)
- Bouton **"Depuis template"**
- Choisir : SonarQube, ZAP ou Allure
- Cliquer sur **"Ajouter"**

**Option B** : Personnalisée (flexible)
- Bouton **"✨ Application personnalisée"**
- Remplir le formulaire
- Cliquer sur **"Créer"**

### 4️⃣ Configurer les applications (1 min)

Pour chaque application :
- Cliquez sur **Modifier** (✏️)
- Remplissez l'URL et les clés API
- Cliquez sur **"Sauvegarder"**
- Activez avec le **toggle**

### 5️⃣ C'est prêt ! ✅

- Les applications apparaissent dans le menu
- Déconnectez-vous pour tester le mode public
- Partagez l'URL avec votre équipe

---

## 📚 Documentation

### Débutant - Par où commencer ?

1. **Ce fichier** (`START_HERE.md`) ← Vous êtes ici
2. **Guide rapide apps** (`QUICK_CUSTOM_APP.md`) → Ajouter des applications
3. **Guide admin** (`QUICK_START_ADMIN.md`) → Utilisation admin

### Intermédiaire - Configuration

4. **Résumé fonctionnalités** (`FEATURES_SUMMARY.md`) → Toutes les fonctionnalités
5. **Guide apps custom** (`CUSTOM_APPS_GUIDE.md`) → Applications détaillées
6. **Guide admin complet** (`README_ADMIN.md`) → Admin en détail

### Avancé - Technique

7. **Déploiement Docker** (`DOCKER_DEPLOYMENT.md`) → Production
8. **Base de données** (`DATABASE_GUIDE.md`) → PostgreSQL
9. **Intégration API** (`API_INTEGRATION.md`) → Développement

### Urgence - Problèmes

10. **Reset admin** (`QUICK_ADMIN_RESET.md`) → Mot de passe perdu
11. **Stockage et reset** (`STORAGE_AND_RESET.md`) → Réinitialisation
12. **Debug** (`DEBUG.md`) → Dépannage

---

## 🎯 Cas d'usage - Exemples

### Je veux ajouter Grafana

```
1. Paramètres > Applications
2. "Application personnalisée"
3. Nom: Grafana
4. Type: URL Simple
5. Créer
6. Modifier > URL: https://grafana.mycompany.com
7. Activer
```

→ **Résultat** : Grafana dans le menu avec lien vers l'interface

### Je veux ajouter une API custom

```
1. Paramètres > Applications
2. "Application personnalisée"
3. Nom: API Métriques
4. Type: API REST
5. Ajouter champs personnalisés si besoin
6. Créer
7. Modifier > Remplir URL API + clé
8. Activer
```

→ **Résultat** : API dans le menu, configuration stockée

### J'ai perdu mon mot de passe admin

```
1. Console navigateur (F12)
2. Coller ce code:
   localStorage.removeItem('quality_portal_admin_password');
   location.reload();
3. Connexion avec: admin / admin123
```

→ **Résultat** : Accès restauré en 30 secondes

---

## 🔑 Informations essentielles

### Identifiants par défaut

```
Username: admin
Password: admin123
```

⚠️ **CHANGEZ-LES IMMÉDIATEMENT !**

### Applications par défaut

✅ SonarQube (template)
✅ OWASP ZAP (template)
✅ Allure Report (template)
➕ Ajoutez les vôtres !

### Stockage

📍 **localStorage** du navigateur (par défaut)
📍 **PostgreSQL** (optionnel, voir `DATABASE_GUIDE.md`)

### Ports Docker

- Frontend : `3000`
- Backend : `5000`
- PostgreSQL : `5432`
- PgAdmin : `5050`

---

## 🆘 Aide rapide

| Problème | Solution |
|----------|----------|
| Page blanche | `FIX_APPLIED.md` |
| Mot de passe perdu | `QUICK_ADMIN_RESET.md` |
| Ajouter une app | `QUICK_CUSTOM_APP.md` |
| Config Docker | `DOCKER_QUICKSTART.md` |
| Toute la doc | `FEATURES_SUMMARY.md` |

---

## 📊 Structure du projet

```
/
├── src/app/              # Code source React
├── docker/               # Configuration Docker
├── api/                  # Backend Node.js
├── *.md                  # Documentation (30 fichiers)
└── docker-compose.yml    # Orchestration
```

---

## ✅ Checklist première utilisation

- [ ] Connexion admin réussie
- [ ] Identifiants changés et notés
- [ ] Au moins 1 application ajoutée
- [ ] Application configurée (URL/API)
- [ ] Application activée et visible dans le menu
- [ ] Test en mode public (déconnexion)
- [ ] Équipe informée de l'URL

---

## 🎉 Vous êtes prêt !

**Prochaines étapes** :
1. Ajoutez toutes vos applications
2. Configurez les URLs et clés API
3. Partagez avec votre équipe
4. Explorez la documentation pour aller plus loin

**Questions ?**
→ Consultez `FEATURES_SUMMARY.md` pour la vue d'ensemble complète

---

**Bon démarrage ! 🚀**
