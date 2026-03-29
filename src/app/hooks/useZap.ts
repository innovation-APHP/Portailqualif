import { useApiData } from "./useApiData";
import { zapService } from "../services/zap.service";
import { zapData } from "../data/mockData";

export function useZapSummary() {
  return useApiData({
    fetchFn: () => zapService.getAlertsSummary(),
    initialData: zapData.summary,
    refreshInterval: 3 * 60 * 1000, // Rafraîchir toutes les 3 minutes
  });
}

export function useZapAlerts(baseurl?: string) {
  return useApiData({
    fetchFn: () => zapService.getAlerts(baseurl),
    initialData: zapData.alerts,
    refreshInterval: 3 * 60 * 1000, // Rafraîchir toutes les 3 minutes
  });
}
