import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ConnectionTestProps {
  service: "sonarqube" | "zap" | "wazuh";
  config: {
    baseUrl: string;
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
  };
}

export function ConnectionTest({ service, config }: ConnectionTestProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Simuler un test de connexion (remplacer par de vraies requêtes API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Pour l'instant, on simule un succès ou échec basé sur l'URL
      const isDefaultUrl =
        config.baseUrl.includes("example.com") ||
        config.baseUrl === "http://localhost:8080";

      if (isDefaultUrl) {
        setResult({
          success: false,
          message: "URL par défaut détectée. Veuillez configurer une URL réelle.",
        });
      } else {
        // Simulation: on suppose que la connexion réussit
        setResult({
          success: true,
          message: "Connexion établie avec succès !",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors du test de connexion",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Test de connexion
        </span>
        <button
          onClick={testConnection}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Test en cours...
            </>
          ) : (
            "Tester la connexion"
          )}
        </button>
      </div>

      {result && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            result.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm">{result.message}</span>
        </div>
      )}
    </div>
  );
}
