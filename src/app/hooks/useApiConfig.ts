import { useState, useEffect } from "react";

// Type pour la configuration API
export interface ApiConfig {
  sonarqube: {
    baseUrl: string;
    token: string;
  };
  zap: {
    baseUrl: string;
    apiKey: string;
  };
}

// Configuration par défaut
const DEFAULT_CONFIG: ApiConfig = {
  sonarqube: {
    baseUrl: "https://sonarqube.example.com",
    token: "YOUR_SONARQUBE_TOKEN_HERE",
  },
  zap: {
    baseUrl: "http://localhost:8080",
    apiKey: "YOUR_ZAP_API_KEY_HERE",
  },
};

const STORAGE_KEY = "quality_portal_api_config";

/**
 * Hook personnalisé pour gérer la configuration des APIs
 * Permet de lire, mettre à jour et réinitialiser la configuration
 * Les données sont persistées dans localStorage
 */
export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig>(() => {
    // Charger la configuration depuis localStorage au premier rendu
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ApiConfig;
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la configuration:", error);
    }
    return DEFAULT_CONFIG;
  });

  // Sauvegarder la configuration dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error);
    }
  }, [config]);

  /**
   * Met à jour la configuration complète ou partielle
   */
  const updateConfig = (newConfig: Partial<ApiConfig> | ApiConfig) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      sonarqube: {
        ...prev.sonarqube,
        ...(newConfig.sonarqube || {}),
      },
      zap: {
        ...prev.zap,
        ...(newConfig.zap || {}),
      },
    }));
  };

  /**
   * Réinitialise la configuration aux valeurs par défaut
   */
  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Vérifie si une configuration spécifique est complète
   */
  const isConfigured = (service: keyof ApiConfig): boolean => {
    const serviceConfig = config[service];

    switch (service) {
      case "sonarqube":
        return (
          serviceConfig.baseUrl !== DEFAULT_CONFIG.sonarqube.baseUrl &&
          serviceConfig.token !== DEFAULT_CONFIG.sonarqube.token
        );
      case "zap":
        return (
          serviceConfig.baseUrl !== DEFAULT_CONFIG.zap.baseUrl &&
          serviceConfig.apiKey !== DEFAULT_CONFIG.zap.apiKey
        );
      default:
        return false;
    }
  };

  return {
    config,
    updateConfig,
    resetConfig,
    isConfigured,
  };
}
