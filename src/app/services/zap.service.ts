import { API_CONFIG } from "../config/api";

const { baseUrl, apiKey } = API_CONFIG.zap;

export interface ZapAlert {
  name: string;
  risk: string;
  confidence: string;
  url: string;
  description: string;
}

export interface ZapSummary {
  high: number;
  medium: number;
  low: number;
  informational: number;
}

export const zapService = {
  // Récupérer le résumé des alertes
  async getAlertsSummary(): Promise<ZapSummary> {
    try {
      const response = await fetch(
        `${baseUrl}/JSON/alert/view/alertsSummary/?apikey=${apiKey}`
      );

      if (!response.ok) throw new Error("Failed to fetch ZAP alerts summary");

      const data = await response.json();
      
      return {
        high: parseInt(data.alertsSummary.High) || 0,
        medium: parseInt(data.alertsSummary.Medium) || 0,
        low: parseInt(data.alertsSummary.Low) || 0,
        informational: parseInt(data.alertsSummary.Informational) || 0,
      };
    } catch (error) {
      console.error("ZAP Summary Error:", error);
      throw error;
    }
  },

  // Récupérer toutes les alertes
  async getAlerts(baseurl?: string): Promise<ZapAlert[]> {
    try {
      const url = baseurl
        ? `${baseUrl}/JSON/alert/view/alerts/?apikey=${apiKey}&baseurl=${baseurl}`
        : `${baseUrl}/JSON/alert/view/alerts/?apikey=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch ZAP alerts");

      const data = await response.json();

      return data.alerts.map((alert: any) => ({
        name: alert.alert,
        risk: alert.risk,
        confidence: alert.confidence,
        url: alert.url,
        description: alert.description,
      }));
    } catch (error) {
      console.error("ZAP Alerts Error:", error);
      throw error;
    }
  },

  // Lancer un scan actif (attention: peut être destructif)
  async startActiveScan(url: string): Promise<string> {
    try {
      const response = await fetch(
        `${baseUrl}/JSON/ascan/action/scan/?apikey=${apiKey}&url=${encodeURIComponent(url)}`
      );

      if (!response.ok) throw new Error("Failed to start active scan");

      const data = await response.json();
      return data.scan; // Retourne l'ID du scan
    } catch (error) {
      console.error("ZAP Scan Error:", error);
      throw error;
    }
  },

  // Vérifier le statut d'un scan
  async getScanStatus(scanId: string): Promise<number> {
    try {
      const response = await fetch(
        `${baseUrl}/JSON/ascan/view/status/?apikey=${apiKey}&scanId=${scanId}`
      );

      if (!response.ok) throw new Error("Failed to get scan status");

      const data = await response.json();
      return parseInt(data.status); // 0-100
    } catch (error) {
      console.error("ZAP Scan Status Error:", error);
      throw error;
    }
  },

  // Récupérer les URLs analysées
  async getUrls(): Promise<string[]> {
    try {
      const response = await fetch(
        `${baseUrl}/JSON/core/view/urls/?apikey=${apiKey}`
      );

      if (!response.ok) throw new Error("Failed to fetch URLs");

      const data = await response.json();
      return data.urls || [];
    } catch (error) {
      console.error("ZAP URLs Error:", error);
      throw error;
    }
  },
};
