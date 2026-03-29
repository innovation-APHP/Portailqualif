import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { wazuhData } from "../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  Activity,
  Server,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ConfigStatus } from "./ConfigStatus";

export function WazuhPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Surveillance Wazuh
        </h1>
        <p className="text-gray-600 mt-1">
          Monitoring de sécurité et détection d'intrusions
        </p>
      </div>

      <ConfigStatus service="wazuh" serviceName="Wazuh" />

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alertes critiques
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {wazuhData.summary.critical}
            </div>
            <p className="text-xs text-gray-500 mt-1">Intervention immédiate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alertes élevées
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {wazuhData.summary.high}
            </div>
            <p className="text-xs text-gray-500 mt-1">À traiter rapidement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Agents actifs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {wazuhData.summary.activeAgents}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sur {wazuhData.summary.agents} agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Statut global
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(
                (wazuhData.summary.activeAgents / wazuhData.summary.agents) *
                100
              ).toFixed(0)}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">Disponibilité</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de tendance */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des alertes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              id="wazuh-alerts-chart"
              data={wazuhData.alertsTrend}
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
              <Legend />
              <Area
                key="critical-area"
                type="monotone"
                dataKey="critical"
                stackId="1"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.6}
                name="Critique"
              />
              <Area
                key="high-wazuh-area"
                type="monotone"
                dataKey="high"
                stackId="1"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.6}
                name="Élevé"
              />
              <Area
                key="medium-wazuh-area"
                type="monotone"
                dataKey="medium"
                stackId="1"
                stroke="#eab308"
                fill="#eab308"
                fillOpacity={0.6}
                name="Moyen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wazuhData.recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.level === "Critical"
                          ? "bg-red-500"
                          : alert.level === "High"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">
                          {alert.agent}
                        </span>
                        <Badge
                          className={
                            alert.level === "Critical"
                              ? "bg-red-100 text-red-800"
                              : alert.level === "High"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {alert.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {alert.rule}
                  </div>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques par niveau de sévérité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Critique
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {wazuhData.summary.critical}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${
                        (wazuhData.summary.critical /
                          (wazuhData.summary.critical +
                            wazuhData.summary.high +
                            wazuhData.summary.medium +
                            wazuhData.summary.low)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Élevé
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    {wazuhData.summary.high}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${
                        (wazuhData.summary.high /
                          (wazuhData.summary.critical +
                            wazuhData.summary.high +
                            wazuhData.summary.medium +
                            wazuhData.summary.low)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Moyen
                  </span>
                  <span className="text-sm font-bold text-yellow-600">
                    {wazuhData.summary.medium}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${
                        (wazuhData.summary.medium /
                          (wazuhData.summary.critical +
                            wazuhData.summary.high +
                            wazuhData.summary.medium +
                            wazuhData.summary.low)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Faible
                  </span>
                  <span className="text-sm font-bold text-gray-600">
                    {wazuhData.summary.low}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-500"
                    style={{
                      width: `${
                        (wazuhData.summary.low /
                          (wazuhData.summary.critical +
                            wazuhData.summary.high +
                            wazuhData.summary.medium +
                            wazuhData.summary.low)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions recommandées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-red-900 text-sm">
                    Intervention immédiate requise
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {wazuhData.summary.critical} alertes critiques nécessitent
                    une action immédiate. Vérifier les tentatives
                    d'authentification multiples.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-orange-900 text-sm">
                    Surveillance accrue
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Monitorer l'intégrité des fichiers sur db-server-01 et
                    investiguer les modifications non autorisées.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-900 text-sm">
                    Agents opérationnels
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {wazuhData.summary.activeAgents} agents sur{" "}
                    {wazuhData.summary.agents} sont actifs et fonctionnent
                    correctement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}