import { useState } from "react";
import { Database, CheckCircle, AlertCircle, ExternalLink, Info } from "lucide-react";
import { getDatabaseConfig, saveDatabaseConfig, isDatabaseEnabled } from "../config/database";
import { DATABASE_SCHEMA } from "../config/database-schema";

export function DatabaseConfigSection() {
  const [config, setConfig] = useState(getDatabaseConfig());
  const [showSchema, setShowSchema] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleToggle = (enabled: boolean) => {
    const newConfig = { ...config, enabled };
    setConfig(newConfig);
    saveDatabaseConfig(newConfig);
  };

  const handleSave = () => {
    saveDatabaseConfig(config);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(DATABASE_SCHEMA);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isConfigured = isDatabaseEnabled();

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Base de données PostgreSQL</h3>
            <p className="text-sm text-gray-600">Configuration optionnelle pour la persistance des données</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Statut */}
      {config.enabled && (
        <div className={`mb-4 p-4 rounded-lg border ${
          isConfigured
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}>
          {isConfigured ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">PostgreSQL activé et configuré</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Configuration incomplète</span>
            </div>
          )}
        </div>
      )}

      {/* Informations sur les bénéfices */}
      {!config.enabled && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Pourquoi activer PostgreSQL ?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Historique des métriques et calcul des tendances</li>
                <li>Système d'alertes personnalisées avec notifications</li>
                <li>Synchronisation entre plusieurs utilisateurs</li>
                <li>Sauvegarde et analyse avancée des données</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de configuration */}
      {config.enabled && (
        <div className="space-y-4">
          <div>
            <label htmlFor="supabase-url" className="block text-sm font-medium text-gray-700 mb-1">
              Supabase URL
            </label>
            <input
              id="supabase-url"
              type="url"
              value={config.supabaseUrl || ""}
              onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
              onBlur={handleSave}
              placeholder="https://your-project.supabase.co"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="supabase-key" className="block text-sm font-medium text-gray-700 mb-1">
              Supabase Anon Key
            </label>
            <input
              id="supabase-key"
              type="password"
              value={config.supabaseAnonKey || ""}
              onChange={(e) => setConfig({ ...config, supabaseAnonKey: e.target.value })}
              onBlur={handleSave}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Guide d'installation */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowSchema(!showSchema)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Database className="w-4 h-4" />
              {showSchema ? "Masquer" : "Afficher"} le schéma de base de données
            </button>

            {showSchema && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Instructions d'installation</h4>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                    <li>
                      Créez un compte gratuit sur{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Supabase
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>Créez un nouveau projet</li>
                    <li>Allez dans "SQL Editor" dans le menu de gauche</li>
                    <li>Copiez le schéma SQL ci-dessous et exécutez-le</li>
                    <li>Récupérez vos credentials dans "Settings" → "API"</li>
                    <li>Collez-les dans les champs ci-dessus</li>
                  </ol>
                </div>

                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    <code>{DATABASE_SCHEMA}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopySchema}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                  >
                    {copySuccess ? "✓ Copié" : "Copier"}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Note de sécurité</p>
                      <p>
                        Les politiques RLS (Row Level Security) sont configurées pour autoriser tous les utilisateurs
                        authentifiés. Ajustez ces politiques selon vos besoins de sécurité en production.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
