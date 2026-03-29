import { API_CONFIG } from "../config/api";

const { baseUrl, token } = API_CONFIG.sonarqube;

// Headers pour l'authentification SonarQube
const getHeaders = () => ({
  Authorization: `Basic ${btoa(`${token}:`)}`,
  "Content-Type": "application/json",
});

export interface SonarQubeProject {
  name: string;
  key: string;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplications: number;
  security: string;
  reliability: string;
  maintainability: string;
}

export const sonarqubeService = {
  // Récupérer tous les projets
  async getProjects(): Promise<SonarQubeProject[]> {
    try {
      const response = await fetch(
        `${baseUrl}/api/projects/search?ps=100`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      
      // Récupérer les métriques pour chaque projet
      const projectsWithMetrics = await Promise.all(
        data.components.map(async (component: any) => {
          const metrics = await this.getProjectMetrics(component.key);
          return metrics;
        })
      );

      return projectsWithMetrics;
    } catch (error) {
      console.error("SonarQube API Error:", error);
      throw error;
    }
  },

  // Récupérer les métriques d'un projet spécifique
  async getProjectMetrics(projectKey: string): Promise<SonarQubeProject> {
    try {
      const metricKeys = [
        "bugs",
        "vulnerabilities",
        "code_smells",
        "coverage",
        "duplicated_lines_density",
        "security_rating",
        "reliability_rating",
        "sqale_rating", // maintainability
      ].join(",");

      const response = await fetch(
        `${baseUrl}/api/measures/component?component=${projectKey}&metricKeys=${metricKeys}`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch project metrics");

      const data = await response.json();
      const measures = data.component.measures;

      const getMeasureValue = (key: string) => {
        const measure = measures.find((m: any) => m.metric === key);
        return measure ? parseFloat(measure.value) : 0;
      };

      const getRating = (key: string) => {
        const rating = getMeasureValue(key);
        const ratingMap: { [key: number]: string } = {
          1: "A",
          2: "B",
          3: "C",
          4: "D",
          5: "E",
        };
        return ratingMap[rating] || "N/A";
      };

      return {
        name: data.component.name,
        key: projectKey,
        bugs: getMeasureValue("bugs"),
        vulnerabilities: getMeasureValue("vulnerabilities"),
        codeSmells: getMeasureValue("code_smells"),
        coverage: getMeasureValue("coverage"),
        duplications: getMeasureValue("duplicated_lines_density"),
        security: getRating("security_rating"),
        reliability: getRating("reliability_rating"),
        maintainability: getRating("sqale_rating"),
      };
    } catch (error) {
      console.error("SonarQube Project Metrics Error:", error);
      throw error;
    }
  },

  // Récupérer l'historique des métriques
  async getMetricsHistory(projectKey: string, days: number = 30) {
    try {
      const metrics = "bugs,vulnerabilities,coverage";
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const response = await fetch(
        `${baseUrl}/api/measures/search_history?component=${projectKey}&metrics=${metrics}&from=${fromDate.toISOString().split("T")[0]}`,
        {
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch metrics history");

      const data = await response.json();
      return data.measures;
    } catch (error) {
      console.error("SonarQube History Error:", error);
      throw error;
    }
  },
};
