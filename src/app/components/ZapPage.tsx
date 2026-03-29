import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { zapData } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AlertTriangle, Shield, Info, AlertCircle } from "lucide-react";
import { ConfigStatus } from "./ConfigStatus";

const COLORS = {
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#eab308",
  informational: "#6b7280",
};

export function ZapPage() {
  const pieData = [
    { name: "Élevé", value: zapData.summary.high, color: COLORS.high },
    { name: "Moyen", value: zapData.summary.medium, color: COLORS.medium },
    { name: "Faible", value: zapData.summary.low, color: COLORS.low },
    {
      name: "Info",
      value: zapData.summary.informational,
      color: COLORS.informational,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analyse OWASP ZAP
        </h1>
        <p className="text-gray-600 mt-1">
          Tests de sécurité des applications web
        </p>
      </div>

      <ConfigStatus service="zap" serviceName="OWASP ZAP" />

      {/* Résumé des alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Risque élevé
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {zapData.summary.high}
            </div>
            <p className="text-xs text-gray-500 mt-1">Critique</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Risque moyen
            </CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {zapData.summary.medium}
            </div>
            <p className="text-xs text-gray-500 mt-1">Important</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Risque faible
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {zapData.summary.low}
            </div>
            <p className="text-xs text-gray-500 mt-1">À surveiller</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Informationnel
            </CardTitle>
            <Info className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {zapData.summary.informational}
            </div>
            <p className="text-xs text-gray-500 mt-1">FYI</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des alertes</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="zap-pie-chart" margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des scans</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart id="zap-history-chart" data={zapData.scanHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                <Bar key="high-bar" dataKey="high" fill={COLORS.high} name="Élevé" />
                <Bar key="medium-bar" dataKey="medium" fill={COLORS.medium} name="Moyen" />
                <Bar key="low-bar" dataKey="low" fill={COLORS.low} name="Faible" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Liste des alertes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes de sécurité détectées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zapData.alerts.map((alert, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {alert.name}
                      </h3>
                      <Badge
                        className={
                          alert.risk === "High"
                            ? "bg-red-100 text-red-800"
                            : alert.risk === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {alert.risk}
                      </Badge>
                      <Badge variant="outline">
                        Confiance: {alert.confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">URL:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {alert.url}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-900">
                  Priorité immédiate
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Corriger les vulnérabilités de type SQL Injection et XSS
                  détectées. Ces failles peuvent permettre l'accès non autorisé
                  aux données.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-orange-900">
                  Action recommandée
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Implémenter des tokens anti-CSRF sur tous les formulaires et
                  configurer les en-têtes de sécurité (X-Frame-Options,
                  CSP, etc.).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">
                  Bonne pratique
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Planifier des scans de sécurité automatiques hebdomadaires
                  pour surveiller l'évolution des vulnérabilités.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}