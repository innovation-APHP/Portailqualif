import { useState, useEffect } from "react";
import { Save, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { useApiConfig } from "../hooks/useApiConfig";
import { ConnectionTest } from "./ConnectionTest";
import { DatabaseConfigSection } from "./DatabaseConfigSection";

export function SettingsPage() {
  const { config, updateConfig, resetConfig } = useApiConfig();
  const [formData, setFormData] = useState(config);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateConfig(formData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser la configuration ?")) {
      resetConfig();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-gray-900">Configuration</h2>
          <p className="text-gray-600 mt-1">
            Configurez les APIs et la base de données pour votre portail qualité
          </p>
        </div>

        {saveStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Configuration enregistrée avec succès</span>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">Erreur lors de l'enregistrement</span>
          </div>
        )}

        {/* Section Base de données PostgreSQL */}
        <div className="mb-8">
          <DatabaseConfigSection />
        </div>

        {/* Section APIs */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-semibold text-xl text-gray-900 mb-6">Configuration des APIs</h3>
            
            {/* SonarQube Configuration */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">SonarQube</h3>
                {formData.sonarqube.baseUrl && formData.sonarqube.baseUrl !== "https://sonarqube.example.com" && (
                  <a
                    href={formData.sonarqube.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Ouvrir l'interface
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="sonarqube-url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'instance SonarQube
                  </label>
                  <input
                    id="sonarqube-url"
                    type="url"
                    value={formData.sonarqube.baseUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sonarqube: { ...formData.sonarqube, baseUrl: e.target.value },
                      })
                    }
                    placeholder="https://sonarqube.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="sonarqube-token" className="block text-sm font-medium text-gray-700 mb-1">
                    Token d'authentification
                  </label>
                  <input
                    id="sonarqube-token"
                    type="password"
                    value={formData.sonarqube.token}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sonarqube: { ...formData.sonarqube, token: e.target.value },
                      })
                    }
                    placeholder="YOUR_SONARQUBE_TOKEN_HERE"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Générez un token dans SonarQube: My Account → Security → Generate Tokens
                  </p>
                </div>
              </div>
            </div>

            {/* OWASP ZAP Configuration */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">OWASP ZAP</h3>
                {formData.zap.baseUrl && formData.zap.baseUrl !== "http://localhost:8080" && (
                  <a
                    href={formData.zap.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Ouvrir l'interface
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="zap-url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'API ZAP
                  </label>
                  <input
                    id="zap-url"
                    type="url"
                    value={formData.zap.baseUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        zap: { ...formData.zap, baseUrl: e.target.value },
                      })
                    }
                    placeholder="http://localhost:8080"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="zap-apikey" className="block text-sm font-medium text-gray-700 mb-1">
                    Clé API
                  </label>
                  <input
                    id="zap-apikey"
                    type="password"
                    value={formData.zap.apiKey}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        zap: { ...formData.zap, apiKey: e.target.value },
                      })
                    }
                    placeholder="YOUR_ZAP_API_KEY_HERE"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Trouvez votre clé API dans ZAP: Tools → Options → API
                  </p>
                </div>
              </div>
            </div>

            {/* Wazuh Configuration */}
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Wazuh</h3>
                {formData.wazuh.baseUrl && formData.wazuh.baseUrl !== "https://wazuh.example.com" && (
                  <a
                    href={formData.wazuh.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Ouvrir l'interface
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="wazuh-url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'API Wazuh
                  </label>
                  <input
                    id="wazuh-url"
                    type="url"
                    value={formData.wazuh.baseUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wazuh: { ...formData.wazuh, baseUrl: e.target.value },
                      })
                    }
                    placeholder="https://wazuh.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="wazuh-username" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur
                    </label>
                    <input
                      id="wazuh-username"
                      type="text"
                      value={formData.wazuh.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wazuh: { ...formData.wazuh, username: e.target.value },
                        })
                      }
                      placeholder="admin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="wazuh-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe
                    </label>
                    <input
                      id="wazuh-password"
                      type="password"
                      value={formData.wazuh.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wazuh: { ...formData.wazuh, password: e.target.value },
                        })
                      }
                      placeholder="YOUR_WAZUH_PASSWORD_HERE"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Enregistrer la configuration
            </button>
          </div>
        </form>

        {/* Information complémentaire */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Configuration sécurisée</p>
              <p>
                Les identifiants sont stockés localement dans votre navigateur. Pour une utilisation en
                production, utilisez des variables d'environnement ou un système de gestion des secrets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}