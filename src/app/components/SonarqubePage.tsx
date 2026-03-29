import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { sonarqubeData } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Bug, Shield, Code2, AlertCircle } from "lucide-react";
import { ConfigStatus } from "./ConfigStatus";

export function SonarqubePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analyse SonarQube
        </h1>
        <p className="text-gray-600 mt-1">
          Qualité du code et métriques de couverture
        </p>
      </div>

      <ConfigStatus service="sonarqube" serviceName="SonarQube" />

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bugs
            </CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {sonarqubeData.projects.reduce((acc, p) => acc + p.bugs, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sur {sonarqubeData.projects.length} projets
            </p>
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
              {sonarqubeData.projects.reduce(
                (acc, p) => acc + p.vulnerabilities,
                0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">À corriger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Code Smells
            </CardTitle>
            <Code2 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {sonarqubeData.projects.reduce(
                (acc, p) => acc + p.codeSmells,
                0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maintenabilité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Couverture moyenne
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(
                sonarqubeData.projects.reduce(
                  (acc, p) => acc + p.coverage,
                  0
                ) / sonarqubeData.projects.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">Tests unitaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des bugs et vulnérabilités</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                id="sonar-bugs-vuln-chart"
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bugs"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Bugs"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="vulnerabilities"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Vulnérabilités"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Évolution de la couverture de code</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                id="sonar-coverage-trend-chart"
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
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="coverage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Couverture (%)"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Détails par projet */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sonarqubeData.projects.map((project) => (
              <div key={project.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <Badge
                      className={
                        project.security === "A"
                          ? "bg-green-100 text-green-800"
                          : project.security === "B"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      Sécurité: {project.security}
                    </Badge>
                    <Badge
                      className={
                        project.reliability === "A"
                          ? "bg-green-100 text-green-800"
                          : project.reliability === "B"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      Fiabilité: {project.reliability}
                    </Badge>
                    <Badge
                      className={
                        project.maintainability === "A"
                          ? "bg-green-100 text-green-800"
                          : project.maintainability === "B"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      Maintenabilité: {project.maintainability}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Bugs</div>
                    <div className="text-xl font-bold text-red-600">
                      {project.bugs}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Vulnérabilités</div>
                    <div className="text-xl font-bold text-orange-600">
                      {project.vulnerabilities}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Code Smells</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {project.codeSmells}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Couverture</div>
                    <div className="text-xl font-bold text-blue-600">
                      {project.coverage.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duplication</div>
                    <div className="text-xl font-bold text-gray-600">
                      {project.duplications.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Couverture de tests</span>
                    <span className="font-medium">
                      {project.coverage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={project.coverage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}