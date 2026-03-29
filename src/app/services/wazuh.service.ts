import { API_CONFIG } from "../config/api";

const { baseUrl, username, password } = API_CONFIG.wazuh;

let authToken: string | null = null;

// Authentification Wazuh
async function getAuthToken(): Promise<string> {
  if (authToken) return authToken;

  try {
    const response = await fetch(`${baseUrl}/security/user/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });

    if (!response.ok) throw new Error("Wazuh authentication failed");

    const data = await response.json();
    authToken = data.data.token;
    return authToken!;
  } catch (error) {
    console.error("Wazuh Auth Error:", error);
    throw error;
  }
}

const getHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export interface WazuhAlert {
  id: string;
  timestamp: string;
  agent: string;
  level: string;
  rule: string;
  description: string;
}

export interface WazuhSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  agents: number;
  activeAgents: number;
}

export const wazuhService = {
  // Récupérer le résumé des agents
  async getAgentsSummary(): Promise<{ agents: number; activeAgents: number }> {
    try {
      const response = await fetch(`${baseUrl}/agents/summary/status`, {
        headers: await getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch agents summary");

      const data = await response.json();

      return {
        agents: data.data.total || 0,
        activeAgents: data.data.active || 0,
      };
    } catch (error) {
      console.error("Wazuh Agents Error:", error);
      throw error;
    }
  },

  // Récupérer les alertes récentes
  async getAlerts(limit: number = 100): Promise<WazuhAlert[]> {
    try {
      const response = await fetch(
        `${baseUrl}/security/alerts?limit=${limit}&sort=-timestamp`,
        {
          headers: await getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch alerts");

      const data = await response.json();

      return data.data.affected_items.map((alert: any) => ({
        id: alert.id,
        timestamp: alert.timestamp,
        agent: alert.agent?.name || "Unknown",
        level: this.getLevelName(alert.rule?.level || 0),
        rule: alert.rule?.description || "Unknown",
        description: alert.full_log || alert.rule?.description || "",
      }));
    } catch (error) {
      console.error("Wazuh Alerts Error:", error);
      throw error;
    }
  },

  // Récupérer le résumé des alertes par sévérité
  async getAlertsSummary(): Promise<WazuhSummary> {
    try {
      const alerts = await this.getAlerts(500);
      const agentsSummary = await this.getAgentsSummary();

      const summary: WazuhSummary = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        ...agentsSummary,
      };

      alerts.forEach((alert) => {
        switch (alert.level) {
          case "Critical":
            summary.critical++;
            break;
          case "High":
            summary.high++;
            break;
          case "Medium":
            summary.medium++;
            break;
          case "Low":
            summary.low++;
            break;
        }
      });

      return summary;
    } catch (error) {
      console.error("Wazuh Summary Error:", error);
      throw error;
    }
  },

  // Convertir le niveau numérique en texte
  getLevelName(level: number): string {
    if (level >= 12) return "Critical";
    if (level >= 7) return "High";
    if (level >= 3) return "Medium";
    return "Low";
  },

  // Récupérer les statistiques par agent
  async getAgentStats(agentId: string) {
    try {
      const response = await fetch(`${baseUrl}/agents/${agentId}/stats`, {
        headers: await getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch agent stats");

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Wazuh Agent Stats Error:", error);
      throw error;
    }
  },

  // Récupérer tous les agents
  async getAgents() {
    try {
      const response = await fetch(`${baseUrl}/agents?limit=1000`, {
        headers: await getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch agents");

      const data = await response.json();
      return data.data.affected_items;
    } catch (error) {
      console.error("Wazuh Agents List Error:", error);
      throw error;
    }
  },
};
