import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Bug,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  ExternalLink,
} from "lucide-react";
import { sonarqubeData, zapData, wazuhData } from "../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApiConfig } from "../hooks/useApiConfig";
import { Link } from "react-router";

export function Overview() {
  const totalBugs = sonarqubeData.projects.reduce(
    (acc, p) => acc + p.bugs,
    0
  );
  const totalVulns = sonarqubeData.projects.reduce(
    (acc, p) => acc + p.vulnerabilities,
    0
  );
  const avgCoverage =
    sonarqubeData.projects.reduce((acc, p) => acc + p.coverage, 0) /
    sonarqubeData.projects.length;

  const { config, isConfigured } = useApiConfig();
  const configuredServices = [
    { key: "sonarqube" as const, name: "SonarQube" },
    { key: "zap" as const, name: "OWASP ZAP" },
    { key: "wazuh" as const, name: "Wazuh" },
  ].filter((service) => isConfigured(service.key));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Vue d&apos;ensemble de la qualité
        </h1>
        <p className="text-gray-600 mt-1">
          Surveillance en temps réel de la sécurité et de la qualité du code
        </p>
      </div>

      {/* Configuration Status Banner */}
      {configuredServices.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900">Configuration requise</p>
              <p className="text-sm text-yellow-800 mt-1">
                Aucun outil n'est encore configuré. Les données affichées sont des exemples.
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-yellow-900 hover:text-yellow-950"
              >
                <Settings className="w-4 h-4" />
                Configurer les outils maintenant
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900">
                {configuredServices.length} outil{configuredServices.length > 1 ? "s" : ""} configuré{configuredServices.length > 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {configuredServices.map((service) => (
                  <a
                    key={service.key}
                    href={config[service.key].baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm text-green-800 hover:bg-green-100 transition-colors"
                  >
                    {service.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bugs totaux
            </CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalBugs}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">-12% ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vulnérabilités
            </CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalVulns}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">-25% ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Couverture moyenne
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {avgCoverage.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+3.2% ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alertes Wazuh
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {wazuhData.summary.critical + wazuhData.summary.high}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3 text-orange-600" />
              <p className="text-xs text-orange-600">Attention requise</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la qualité du code</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                id="overview-sonar-chart"
                data={sonarqubeData.trends}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  key="bugs-area"
                  type="monotone"
                  dataKey="bugs"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Bugs"
                />
                <Area
                  key="vulnerabilities-area"
                  type="monotone"
                  dataKey="vulnerabilities"
                  stackId="1"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.6}
                  name="Vulnérabilités"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes de sécurité OWASP ZAP</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                id="overview-zap-chart"
                data={zapData.scanHistory}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  key="high-area"
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.6}
                  name="Élevé"
                />
                <Area
                  key="medium-area"
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Moyen"
                />
                <Area
                  key="low-area"
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#eab308"
                  fill="#eab308"
                  fillOpacity={0.6}
                  name="Faible"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projets SonarQube et Alertes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projets SonarQube</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sonarqubeData.projects.map((project) => (
                <div
                  key={project.name}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {project.name}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-red-600">{project.bugs} bugs</span>
                      <span className="text-orange-600">
                        {project.vulnerabilities} vulns
                      </span>
                      <span className="text-blue-600">
                        {project.codeSmells} smells
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      variant={
                        project.security === "A" ? "default" : "secondary"
                      }
                      className={
                        project.security === "A"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {project.security}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes Wazuh récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wazuhData.recentAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      alert.level === "Critical"
                        ? "bg-red-500"
                        : alert.level === "High"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">
                        {alert.agent}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          alert.level === "Critical"
                            ? "text-red-700 border-red-300"
                            : alert.level === "High"
                            ? "text-orange-700 border-orange-300"
                            : "text-yellow-700 border-yellow-300"
                        }
                      >
                        {alert.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}