# 📚 Index de la Documentation

Bienvenue dans la documentation du Portail Qualité ! Voici un guide pour naviguer dans les différents documents.

## 🚀 Pour commencer

### [QUICKSTART.md](./QUICKSTART.md)
**Temps de lecture : 2 minutes**

Guide rapide pour configurer vos URLs et commencer à utiliser le portail immédiatement.

✅ Configuration en 3 étapes  
✅ Capture d'écran des paramètres  
✅ Solutions aux problèmes courants

**Commencez ici si vous voulez être opérationnel rapidement !**

---

## 📖 Documentation utilisateur

### [README.md](./README.md)
**Vue d'ensemble complète du projet**

- Fonctionnalités principales
- Options de configuration (Interface Web + Variables d'environnement)
- Architecture du projet
- Recommandations de sécurité
- Guide de personnalisation

**Lisez ceci pour comprendre l'ensemble du système.**

---

### [CONFIGURATION.md](./CONFIGURATION.md)
**Guide détaillé de configuration**

- Instructions pas-à-pas pour chaque outil
- Comment générer les tokens et clés API
- Où trouver les paramètres dans chaque interface
- Gestion du stockage et de la sécurité
- Variables d'environnement pour la production

**Consultez ceci si vous avez des questions sur la configuration.**

---

## 👨‍💻 Documentation développeur

### [API_INTEGRATION.md](./API_INTEGRATION.md)
**Guide d'intégration des APIs**

- Architecture des services
- Utilisation des hooks personnalisés
- Gestion des erreurs et fallbacks
- Solutions CORS et proxy
- Authentification par service
- Exemples de code

**Lisez ceci si vous développez de nouvelles fonctionnalités.**

---

### [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
**Guide d'intégration existant**

Documentation technique sur l'intégration des différentes briques du système.

---

## 📝 Fichiers de référence

### [.env.local.example](./.env.local.example)
**Modèle de fichier d'environnement**

Copiez ce fichier en `.env.local` et remplissez avec vos valeurs pour configurer via variables d'environnement.

---

### [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)
**Crédits et licences**

Liste des bibliothèques et ressources utilisées dans le projet.

---

## 🎯 Scénarios d'utilisation

### Je veux tester rapidement le portail
👉 Aucune configuration nécessaire ! Lancez l'application et naviguez. Des données d'exemple sont affichées.

### Je veux configurer mes vraies APIs
👉 [QUICKSTART.md](./QUICKSTART.md) → Allez dans Paramètres → Configurez vos outils

### Je veux déployer en production
👉 [CONFIGURATION.md](./CONFIGURATION.md) section "Variables d'environnement" + [README.md](./README.md) section "Sécurité"

### Je veux développer une nouvelle fonctionnalité
👉 [API_INTEGRATION.md](./API_INTEGRATION.md) + Code source dans `/src/app/`

### Je rencontre un problème
👉 [QUICKSTART.md](./QUICKSTART.md) section "Problèmes courants" + [README.md](./README.md) section "Dépannage"

---

## 📂 Structure du projet

```
/
├── README.md                  # Vue d'ensemble
├── QUICKSTART.md             # Démarrage rapide
├── CONFIGURATION.md          # Guide de configuration
├── API_INTEGRATION.md        # Guide d'intégration API
├── INTEGRATION_GUIDE.md      # Guide technique
├── .env.local.example        # Exemple de configuration
├── .gitignore               # Fichiers ignorés par git
│
├── src/app/
│   ├── components/          # Composants React
│   │   ├── Overview.tsx           # Vue d'ensemble
│   │   ├── SonarqubePage.tsx      # Page SonarQube
│   │   ├── ZapPage.tsx            # Page OWASP ZAP
│   │   ├── WazuhPage.tsx          # Page Wazuh
│   │   ├── SettingsPage.tsx       # Configuration
│   │   ├── ConfigStatus.tsx       # Statut de configuration
│   │   └── DashboardLayout.tsx    # Layout principal
│   │
│   ├── config/
│   │   └── api.ts           # Configuration API
│   │
│   ├── hooks/
│   │   ├── useApiConfig.ts  # Hook de configuration
│   │   ├── useSonarQube.ts  # Hook SonarQube
│   │   ├── useZap.ts        # Hook OWASP ZAP
│   │   └── useWazuh.ts      # Hook Wazuh
│   │
│   ├── services/
│   │   ├── sonarqube.service.ts  # Service SonarQube
│   │   ├── zap.service.ts        # Service OWASP ZAP
│   │   └── wazuh.service.ts      # Service Wazuh
│   │
│   └── data/
│       └── mockData.ts      # Données de démonstration
│
└── src/styles/              # Fichiers de style
```

---

## 🔗 Liens utiles

### Outils intégrés
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [Wazuh Documentation](https://documentation.wazuh.com/)

### Technologies utilisées
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)

---

## 📞 Besoin d'aide ?

1. **Consultez la documentation** correspondant à votre besoin ci-dessus
2. **Vérifiez les logs** dans la console du navigateur (F12)
3. **Recherchez dans le code source** : Les commentaires expliquent le fonctionnement
4. **Testez avec les données mockées** pour isoler les problèmes de configuration

---

## 🎓 Ordre de lecture recommandé

### Pour les utilisateurs
1. [QUICKSTART.md](./QUICKSTART.md) - Démarrage rapide
2. [README.md](./README.md) - Vue complète
3. [CONFIGURATION.md](./CONFIGURATION.md) - Si besoin de détails

### Pour les développeurs
1. [README.md](./README.md) - Comprendre le projet
2. [API_INTEGRATION.md](./API_INTEGRATION.md) - Intégration technique
3. [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Détails d'implémentation
4. Code source dans `/src/app/`

---

**Dernière mise à jour** : Mars 2026  
**Version du portail** : 1.0.0
