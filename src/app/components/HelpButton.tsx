import { useState } from "react";
import { HelpCircle, X, FileText, Settings, ExternalLink, Book } from "lucide-react";
import { Link } from "react-router-dom";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  const helpLinks = [
    {
      title: "Guide de démarrage rapide",
      description: "Configurez vos APIs en 2 minutes",
      icon: FileText,
      link: "/QUICKSTART.md",
      external: true,
    },
    {
      title: "Paramètres",
      description: "Configurez SonarQube, ZAP et Wazuh",
      icon: Settings,
      link: "/settings",
      external: false,
    },
    {
      title: "Documentation complète",
      description: "Guide détaillé et API",
      icon: Book,
      link: "/README.md",
      external: true,
    },
    {
      title: "Référence des URLs",
      description: "Endpoints et identifiants",
      icon: ExternalLink,
      link: "/URLS_REFERENCE.md",
      external: true,
    },
  ];

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        title="Aide"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Modal d'aide */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Centre d'aide</h3>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    Ressources et guides
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
              {helpLinks.map((item, index) => {
                const Icon = item.icon;
                
                if (item.external) {
                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}

              {/* Quick tips */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Astuces rapides</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Les données affichées sont des exemples sans configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Configurez dans Paramètres pour voir vos vraies données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Les identifiants sont stockés localement (localStorage)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
