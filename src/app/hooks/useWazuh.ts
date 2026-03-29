import { useApiData } from "./useApiData";
import { wazuhService } from "../services/wazuh.service";
import { wazuhData } from "../data/mockData";

export function useWazuhSummary() {
  return useApiData({
    fetchFn: () => wazuhService.getAlertsSummary(),
    initialData: wazuhData.summary,
    refreshInterval: 2 * 60 * 1000, // Rafraîchir toutes les 2 minutes
  });
}

export function useWazuhAlerts(limit: number = 100) {
  return useApiData({
    fetchFn: () => wazuhService.getAlerts(limit),
    initialData: wazuhData.recentAlerts,
    refreshInterval: 2 * 60 * 1000, // Rafraîchir toutes les 2 minutes
  });
}

export function useWazuhAgents() {
  return useApiData({
    fetchFn: () => wazuhService.getAgents(),
    initialData: [],
    refreshInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
}
