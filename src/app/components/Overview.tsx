import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, AlertCircle, Settings, ExternalLink, AppWindow } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import { ApplicationsService } from "../services/applications.service";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Overview() {
  const { applications, enabledApplications, loading } = useApplications();

  const configuredApps = enabledApplications.filter((app) => ApplicationsService.isConfigured(app));
  const unconfiguredApps = enabledApplications.filter((app) => !ApplicationsService.isConfigured(app));

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Box;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div>
        <h1 className="font-bold text-3xl text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-2">
          Tableau de bord centralisé de votre portail qualité et sécurité
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Applications totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{applications.length}</span>
              <AppWindow className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {enabledApplications.length} activée(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Applications configurées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">{configuredApps.length}</span>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Prêtes à l'emploi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Configuration requise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-600">{unconfiguredApps.length}</span>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              En attente de configuration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications actives */}
      <Card>
        <CardHeader>
          <CardTitle>Applications actives</CardTitle>
          <CardDescription>
            Vos applications de qualité et sécurité configurées et prêtes à l'emploi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enabledApplications.length === 0 ? (
            <div className="text-center py-12">
              <AppWindow className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune application activée</p>
              <Link to="/settings">
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Gérer les applications
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enabledApplications.map((app) => {
                const Icon = getIconComponent(app.icon);
                const isConfigured = ApplicationsService.isConfigured(app);

                return (
                  <Link key={app.id} to={`/app/${app.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          {isConfigured ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Configuré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              À configurer
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-3">{app.name}</CardTitle>
                        <CardDescription className="text-sm">{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isConfigured && app.config.baseUrl && (
                          <a
                            href={app.config.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Ouvrir l'interface
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications non configurées */}
      {unconfiguredApps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Configuration requise
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Les applications suivantes nécessitent une configuration avant utilisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unconfiguredApps.map((app) => {
                const Icon = getIconComponent(app.icon);
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-gray-900">{app.name}</span>
                    </div>
                    <Link to="/settings">
                      <Button variant="outline" size="sm" className="bg-white">
                        Configurer
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations */}
      <Card>
        <CardHeader>
          <CardTitle>Guide rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Gérez vos applications</h4>
                <p className="text-sm text-gray-600">
                  Accédez aux Paramètres pour ajouter, configurer ou supprimer des applications
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Configurez les connexions</h4>
                <p className="text-sm text-gray-600">
                  Renseignez les URLs et clés API pour chaque application que vous souhaitez utiliser
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Consultez les données</h4>
                <p className="text-sm text-gray-600">
                  Une fois configurées, accédez aux pages de chaque application pour visualiser les métriques
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
