import { AlertCircle, CheckCircle, ExternalLink, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useApiConfig } from "../hooks/useApiConfig";

interface ConfigStatusProps {
  service: "sonarqube" | "zap" | "wazuh";
  serviceName: string;
}

export function ConfigStatus({ service, serviceName }: ConfigStatusProps) {
  const { config, isConfigured } = useApiConfig();
  const configured = isConfigured(service);
  const serviceUrl = config[service].baseUrl;

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${
        configured
          ? "bg-green-50 border-green-200"
          : "bg-yellow-50 border-yellow-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {configured ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p
            className={`font-medium ${
              configured ? "text-green-900" : "text-yellow-900"
            }`}
          >
            {configured
              ? `${serviceName} configuré`
              : `Configuration ${serviceName} requise`}
          </p>
          <p
            className={`text-sm mt-1 ${
              configured ? "text-green-800" : "text-yellow-800"
            }`}
          >
            {configured
              ? `Connecté à ${serviceUrl}`
              : "Veuillez configurer les paramètres de connexion pour afficher les données réelles."}
          </p>
          <div className="flex gap-3 mt-3">
            {!configured && (
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 text-sm font-medium text-yellow-900 hover:text-yellow-950"
              >
                <Settings className="w-4 h-4" />
                Configurer maintenant
              </Link>
            )}
            {configured && (
              <a
                href={serviceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-900 hover:text-green-950"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir {serviceName}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
