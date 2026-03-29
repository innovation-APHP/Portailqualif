// Mock data for Sonarqube
export const sonarqubeData = {
  projects: [
    {
      name: "Frontend App",
      bugs: 12,
      vulnerabilities: 3,
      codeSmells: 45,
      coverage: 78.5,
      duplications: 3.2,
      security: "A",
      reliability: "B",
      maintainability: "A",
    },
    {
      name: "Backend API",
      bugs: 8,
      vulnerabilities: 1,
      codeSmells: 32,
      coverage: 85.2,
      duplications: 2.1,
      security: "A",
      reliability: "A",
      maintainability: "A",
    },
    {
      name: "Mobile App",
      bugs: 15,
      vulnerabilities: 5,
      codeSmells: 67,
      coverage: 65.8,
      duplications: 5.4,
      security: "B",
      reliability: "C",
      maintainability: "B",
    },
  ],
  trends: [
    { date: "2026-02-21", bugs: 28, vulnerabilities: 7, coverage: 72 },
    { date: "2026-02-28", bugs: 25, vulnerabilities: 6, coverage: 74 },
    { date: "2026-03-07", bugs: 22, vulnerabilities: 5, coverage: 76 },
    { date: "2026-03-14", bugs: 18, vulnerabilities: 4, coverage: 78 },
    { date: "2026-03-21", bugs: 15, vulnerabilities: 3, coverage: 80 },
    { date: "2026-03-29", bugs: 12, vulnerabilities: 2, coverage: 82 },
  ],
};

// Mock data for OWASP ZAP
export const zapData = {
  summary: {
    high: 2,
    medium: 8,
    low: 15,
    informational: 23,
  },
  alerts: [
    {
      name: "SQL Injection",
      risk: "High",
      confidence: "Medium",
      url: "https://app.example.com/api/users",
      description: "SQL injection possible dans le paramètre 'id'",
    },
    {
      name: "Cross Site Scripting (XSS)",
      risk: "High",
      confidence: "High",
      url: "https://app.example.com/search",
      description: "XSS reflété détecté dans le champ de recherche",
    },
    {
      name: "Missing Anti-CSRF Tokens",
      risk: "Medium",
      confidence: "Medium",
      url: "https://app.example.com/profile",
      description: "Absence de protection CSRF sur les formulaires",
    },
    {
      name: "X-Frame-Options Header Not Set",
      risk: "Medium",
      confidence: "High",
      url: "https://app.example.com/",
      description: "En-tête X-Frame-Options manquant",
    },
  ],
  scanHistory: [
    { date: "2026-02-21", high: 4, medium: 12, low: 18 },
    { date: "2026-02-28", high: 3, medium: 10, low: 16 },
    { date: "2026-03-07", high: 3, medium: 9, low: 15 },
    { date: "2026-03-14", high: 2, medium: 8, low: 15 },
    { date: "2026-03-21", high: 2, medium: 8, low: 15 },
    { date: "2026-03-29", high: 2, medium: 8, low: 15 },
  ],
};

// Mock data for Wazuh
export const wazuhData = {
  summary: {
    critical: 3,
    high: 12,
    medium: 28,
    low: 45,
    agents: 24,
    activeAgents: 23,
  },
  recentAlerts: [
    {
      id: "1",
      timestamp: "2026-03-21 14:23:15",
      agent: "web-server-01",
      level: "Critical",
      rule: "Multiple authentication failures",
      description: "Tentatives d'authentification multiples échouées détectées",
    },
    {
      id: "2",
      timestamp: "2026-03-21 13:45:32",
      agent: "db-server-01",
      level: "High",
      rule: "File integrity monitoring",
      description: "Modification non autorisée de fichiers système",
    },
    {
      id: "3",
      timestamp: "2026-03-21 12:18:47",
      agent: "app-server-02",
      level: "Medium",
      rule: "Unusual network activity",
      description: "Activité réseau inhabituelle détectée",
    },
    {
      id: "4",
      timestamp: "2026-03-21 11:05:12",
      agent: "web-server-02",
      level: "High",
      rule: "Web attack attempt",
      description: "Tentative d'attaque web détectée (SQLi)",
    },
  ],
  alertsTrend: [
    { date: "2026-02-21", critical: 5, high: 15, medium: 32 },
    { date: "2026-02-28", critical: 4, high: 13, medium: 30 },
    { date: "2026-03-07", critical: 4, high: 14, medium: 29 },
    { date: "2026-03-14", critical: 3, high: 12, medium: 28 },
    { date: "2026-03-21", critical: 3, high: 12, medium: 28 },
    { date: "2026-03-29", critical: 3, high: 12, medium: 27 },
  ],
};

// Mock data for Wiki.js
export const wikiData = {
  recentPages: [
    {
      title: "Guide de sécurité",
      path: "/security/guide",
      updatedAt: "2026-03-20",
      author: "Jean Dupont",
    },
    {
      title: "Procédures de déploiement",
      path: "/ops/deployment",
      updatedAt: "2026-03-19",
      author: "Marie Martin",
    },
    {
      title: "Architecture système",
      path: "/architecture/overview",
      updatedAt: "2026-03-18",
      author: "Pierre Durant",
    },
    {
      title: "Standards de code",
      path: "/dev/coding-standards",
      updatedAt: "2026-03-17",
      author: "Sophie Bernard",
    },
  ],
  categories: [
    { name: "Sécurité", count: 15, icon: "shield" },
    { name: "Développement", count: 32, icon: "code" },
    { name: "Opérations", count: 24, icon: "server" },
    { name: "Architecture", count: 18, icon: "layout" },
  ],
};