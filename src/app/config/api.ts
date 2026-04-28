// Configuration des endpoints API
// Utilisez la page "Paramètres" pour configurer vos instances réelles
// Les valeurs sont stockées dans localStorage et peuvent être mises à jour via l'interface

import { ApiConfig } from "../hooks/useApiConfig";

// Configuration par défaut (utilisée si aucune configuration n'est sauvegardée)
export const API_CONFIG: ApiConfig = {
  // SonarQube Configuration
  sonarqube: {
    baseUrl: "https://sonarqube.example.com",
    token: "YOUR_SONARQUBE_TOKEN_HERE",
  },

  // OWASP ZAP Configuration
  zap: {
    baseUrl: "http://localhost:8080",
    apiKey: "YOUR_ZAP_API_KEY_HERE",
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

// NOTE: Ce fichier n'est plus utilisé avec le nouveau système d'applications dynamiques
// La configuration se fait maintenant via l'interface dans Paramètres > Applications