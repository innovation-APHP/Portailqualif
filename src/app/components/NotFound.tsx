import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-6 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-700">
          Page non trouvée
        </h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été supprimée.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          <Link
            to="/settings"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Paramètres
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>Pages disponibles :</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <Link to="/" className="text-blue-600 hover:underline">
              Accueil
            </Link>
            <span>•</span>
            <Link to="/settings" className="text-blue-600 hover:underline">
              Paramètres
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
