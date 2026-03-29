// Configuration des endpoints API
// Utilisez la page "Paramètres" pour configurer vos instances réelles
// Les valeurs sont stockées dans localStorage et peuvent être mises à jour via l'interface

import { ApiConfig } from "../hooks/useApiConfig";

// Configuration par défaut (utilisée si aucune configuration n'est sauvegardée)
export const API_CONFIG: ApiConfig = {
  // SonarQube Configuration
  sonarqube: {
    baseUrl: process.env.SONARQUBE_URL || "https://sonarqube.example.com",
    token: process.env.SONARQUBE_TOKEN || "YOUR_SONARQUBE_TOKEN_HERE",
  },

  // OWASP ZAP Configuration
  zap: {
    baseUrl: process.env.ZAP_URL || "http://localhost:8080",
    apiKey: process.env.ZAP_API_KEY || "YOUR_ZAP_API_KEY_HERE",
  },

  // Wazuh Configuration
  wazuh: {
    baseUrl: process.env.WAZUH_URL || "https://wazuh.example.com",
    username: process.env.WAZUH_USER || "admin",
    password: process.env.WAZUH_PASSWORD || "YOUR_WAZUH_PASSWORD_HERE",
  },
};

/**
 * Récupère la configuration depuis localStorage ou utilise la config par défaut
 */
export function getApiConfig(): ApiConfig {
  try {
    const stored = localStorage.getItem("quality_portal_api_config");
    if (stored) {
      return JSON.parse(stored) as ApiConfig;
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la configuration:", error);
  }
  return API_CONFIG;
}

// Pour utiliser en production, créez un fichier .env.local avec:
// SONARQUBE_URL=https://votre-sonarqube.com
// SONARQUBE_TOKEN=votre_token
// ZAP_URL=http://votre-zap:8080
// ZAP_API_KEY=votre_api_key
// WAZUH_URL=https://votre-wazuh.com
// WAZUH_USER=votre_username
// WAZUH_PASSWORD=votre_password