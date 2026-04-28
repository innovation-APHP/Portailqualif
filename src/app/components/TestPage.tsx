export function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application chargée ✓</h1>
        <p className="text-gray-600">
          Si vous voyez cette page, l'application React fonctionne correctement.
        </p>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Le système de navigation dynamique des applications est en cours de chargement...
          </p>
        </div>
      </div>
    </div>
  );
}
