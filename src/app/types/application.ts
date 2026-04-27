/**
 * Type pour les champs de configuration d'une application
 */
export type AppFieldType = "text" | "password" | "url" | "apiKey";

export interface AppConfigField {
  key: string;
  label: string;
  type: AppFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
}

/**
 * Interface pour définir une application personnalisée
 */
export interface Application {
  id: string;
  name: string;
  description: string;
  icon: string; // Nom de l'icône lucide-react
  enabled: boolean;
  order: number;
  config: Record<string, string>; // Configuration dynamique (baseUrl, apiKey, etc.)
  configFields: AppConfigField[]; // Définit les champs de configuration nécessaires
  externalUrl?: string; // URL de l'interface native
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Applications prédéfinies avec leurs configurations
 */
export const PREDEFINED_APPS: Omit<Application, "id" | "createdAt" | "updatedAt" | "config">[] = [
  {
    name: "SonarQube",
    description: "Analyse de qualité du code et détection de bugs",
    icon: "Code2",
    enabled: true,
    order: 1,
    configFields: [
      {
        key: "baseUrl",
        label: "URL de l'instance SonarQube",
        type: "url",
        required: true,
        placeholder: "https://sonarqube.example.com",
      },
      {
        key: "token",
        label: "Token d'accès",
        type: "apiKey",
        required: true,
        placeholder: "squ_xxxxxxxxxxxxx",
        helpText: "Token généré depuis User > My Account > Security dans SonarQube",
      },
    ],
  },
  {
    name: "OWASP ZAP",
    description: "Scanner de sécurité des applications web",
    icon: "Shield",
    enabled: true,
    order: 2,
    configFields: [
      {
        key: "baseUrl",
        label: "URL de l'API ZAP",
        type: "url",
        required: true,
        placeholder: "http://localhost:8080",
      },
      {
        key: "apiKey",
        label: "Clé API",
        type: "apiKey",
        required: true,
        placeholder: "YOUR_ZAP_API_KEY",
        helpText: "Clé API configurée dans les options de ZAP",
      },
    ],
  },
  {
    name: "Allure Report",
    description: "Rapports de tests automatisés et résultats",
    icon: "FileCheck",
    enabled: true,
    order: 3,
    configFields: [
      {
        key: "baseUrl",
        label: "URL des rapports Allure",
        type: "url",
        required: true,
        placeholder: "http://localhost:4040",
        helpText: "URL où sont hébergés les rapports Allure",
      },
      {
        key: "apiKey",
        label: "Clé API (optionnel)",
        type: "apiKey",
        required: false,
        placeholder: "YOUR_API_KEY",
        helpText: "Clé API si l'accès aux rapports est protégé",
      },
    ],
  },
];
