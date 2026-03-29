import { useApiData } from "./useApiData";
import { sonarqubeService } from "../services/sonarqube.service";
import { sonarqubeData } from "../data/mockData";

export function useSonarQubeProjects() {
  return useApiData({
    fetchFn: () => sonarqubeService.getProjects(),
    initialData: sonarqubeData.projects,
    refreshInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  });
}

export function useSonarQubeMetricsHistory(projectKey: string, days: number = 30) {
  return useApiData({
    fetchFn: () => sonarqubeService.getMetricsHistory(projectKey, days),
    initialData: sonarqubeData.trends,
    refreshInterval: 10 * 60 * 1000, // Rafraîchir toutes les 10 minutes
  });
}
