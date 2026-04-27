import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Application } from "../types/application";
import { ApplicationsService } from "../services/applications.service";
import { AlertCircle, ExternalLink, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

/**
 * Page générique pour afficher une application dynamique
 */
export function DynamicAppPage() {
  const params = useParams();
  const appId = params.appId;
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      if (!appId) return;

      try {
        const application = await ApplicationsService.getById(appId);
        setApp(application);
      } catch (error) {
        console.error("Erreur lors du chargement de l'application:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [appId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Application non trouvée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              L'application demandée n'existe pas ou a été supprimée.
            </p>
            <Link to="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isConfigured = ApplicationsService.isConfigured(app);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{app.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{app.description}</p>
        </div>
        {app.config.baseUrl && isConfigured && (
          <a
            href={app.config.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir l'interface
          </a>
        )}
      </div>

      {/* Avertissement si non configuré */}
      {!isConfigured && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Configuration requise
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Cette application n'est pas encore configurée. Veuillez configurer les paramètres requis pour commencer à
              l'utiliser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/settings">
              <Button variant="outline" className="bg-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurer l'application
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Contenu de l'application */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
          <CardDescription>Données et métriques pour {app.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Configuration actuelle */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Configuration</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {app.configFields.map((field) => (
                  <div key={field.key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{field.label}:</span>
                    <span className="text-sm font-mono text-gray-900">
                      {app.config[field.key] ? (
                        field.type === "password" || field.type === "apiKey" ? (
                          "••••••••"
                        ) : (
                          app.config[field.key]
                        )
                      ) : (
                        <span className="text-gray-400">Non configuré</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Pour personnaliser l'affichage de cette page, vous pouvez créer un composant spécifique pour{" "}
                {app.name} dans le dossier <code className="bg-gray-100 px-1 rounded">src/app/components/</code>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder pour les futures intégrations */}
      <Card>
        <CardHeader>
          <CardTitle>Données en temps réel</CardTitle>
          <CardDescription>Les données seront affichées ici une fois l'API connectée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>Intégration API en cours de développement...</p>
            {isConfigured && (
              <p className="text-sm mt-2">
                L'application est configurée et prête à recevoir des données depuis{" "}
                <span className="font-mono text-blue-600">{app.config.baseUrl}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
