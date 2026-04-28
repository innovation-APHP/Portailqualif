import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Database, Download, Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MigrationStatus {
  credentials: number;
  applications: number;
  configFields: number;
  configValues: number;
}

interface MigrationResult {
  success: boolean;
  migrated: MigrationStatus;
  errors: Array<{
    application?: string;
    phase?: string;
    error: string;
  }>;
}

export function DataMigration() {
  const [isExporting, setIsExporting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [dbStatus, setDbStatus] = useState<MigrationStatus | null>(null);

  /**
   * Collecte toutes les données du localStorage
   */
  const collectLocalStorageData = () => {
    try {
      // Récupérer les identifiants admin
      const username = localStorage.getItem("quality_portal_admin_username") || "admin";
      const password = localStorage.getItem("quality_portal_admin_password") || "admin123";

      // Récupérer les applications
      const applicationsStr = localStorage.getItem("quality_portal_applications");
      const applications = applicationsStr ? JSON.parse(applicationsStr) : [];

      return {
        admin: { username, password },
        applications
      };
    } catch (error) {
      console.error("Erreur lors de la collecte des données:", error);
      return null;
    }
  };

  /**
   * Exporte les données localStorage en JSON
   */
  const handleExportLocalStorage = () => {
    setIsExporting(true);
    try {
      const data = collectLocalStorageData();
      if (!data) {
        toast.error("Erreur lors de la collecte des données");
        return;
      }

      // Créer un blob et télécharger
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quality-portal-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Données exportées avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'export");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Exécute la migration vers PostgreSQL
   */
  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const data = collectLocalStorageData();
      if (!data) {
        toast.error("Aucune donnée à migrer");
        return;
      }

      // Envoyer au backend pour migration
      const response = await fetch("/api/migration/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result: MigrationResult = await response.json();
      setMigrationResult(result);

      if (result.success) {
        toast.success("Migration réussie !");
        // Rafraîchir le statut
        await checkDatabaseStatus();
      } else {
        toast.error("Migration échouée - voir les détails");
      }
    } catch (error) {
      toast.error("Erreur lors de la migration");
      console.error(error);
      setMigrationResult({
        success: false,
        migrated: { credentials: 0, applications: 0, configFields: 0, configValues: 0 },
        errors: [{ error: error instanceof Error ? error.message : "Erreur inconnue" }]
      });
    } finally {
      setIsMigrating(false);
    }
  };

  /**
   * Vérifie le statut de la base de données
   */
  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/migration/status");
      const result = await response.json();

      if (result.success) {
        setDbStatus(result.counts);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    }
  };

  /**
   * Calcule le pourcentage de progression
   */
  const getProgressPercentage = () => {
    if (!migrationResult) return 0;
    const total =
      migrationResult.migrated.credentials +
      migrationResult.migrated.applications +
      migrationResult.migrated.configFields +
      migrationResult.migrated.configValues;
    return total > 0 ? 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-gray-900">Migration des Données</h2>
        <p className="text-sm text-gray-500 mt-1">
          Migrez vos données du localStorage vers PostgreSQL pour une meilleure persistance
        </p>
      </div>

      {/* Statut de la base de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            État de la Base de Données PostgreSQL
          </CardTitle>
          <CardDescription>
            Vérifiez le contenu actuel de votre base de données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkDatabaseStatus} variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Vérifier le statut
          </Button>

          {dbStatus && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{dbStatus.credentials}</div>
                <div className="text-xs text-blue-600">Credentials</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{dbStatus.applications}</div>
                <div className="text-xs text-green-600">Applications</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{dbStatus.configFields}</div>
                <div className="text-xs text-purple-600">Champs Config</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{dbStatus.configValues}</div>
                <div className="text-xs text-orange-600">Valeurs Config</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export localStorage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les Données localStorage
          </CardTitle>
          <CardDescription>
            Téléchargez une sauvegarde de vos données actuelles en JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportLocalStorage} disabled={isExporting} variant="outline">
            {isExporting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter en JSON
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recommandé avant toute migration pour conserver une sauvegarde
          </p>
        </CardContent>
      </Card>

      {/* Migration vers PostgreSQL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Migrer vers PostgreSQL
          </CardTitle>
          <CardDescription>
            Transférez toutes vos données du localStorage vers la base de données PostgreSQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Important :</strong> Assurez-vous que PostgreSQL est configuré et accessible avant de lancer la migration.
              Exportez vos données avant de continuer.
            </AlertDescription>
          </Alert>

          <Button onClick={handleMigrate} disabled={isMigrating}>
            {isMigrating ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Migration en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Lancer la Migration
              </>
            )}
          </Button>

          {/* Résultat de la migration */}
          {migrationResult && (
            <div className="space-y-4 mt-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                {migrationResult.success ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Migration réussie</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700">Migration échouée</span>
                  </>
                )}
              </div>

              <Progress value={getProgressPercentage()} className="w-full" />

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Credentials</span>
                  <Badge>{migrationResult.migrated.credentials}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Applications</span>
                  <Badge>{migrationResult.migrated.applications}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Champs Config</span>
                  <Badge>{migrationResult.migrated.configFields}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Valeurs Config</span>
                  <Badge>{migrationResult.migrated.configValues}</Badge>
                </div>
              </div>

              {migrationResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-700 mb-2">Erreurs :</h4>
                  <div className="space-y-2">
                    {migrationResult.errors.map((error, idx) => (
                      <Alert key={idx} variant="destructive">
                        <AlertDescription>
                          {error.application && <strong>{error.application}: </strong>}
                          {error.phase && <strong>[{error.phase}] </strong>}
                          {error.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions de Migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
              1
            </div>
            <p>
              <strong>Exportez vos données</strong> en JSON pour avoir une sauvegarde avant la migration
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
              2
            </div>
            <p>
              <strong>Vérifiez PostgreSQL</strong> : Assurez-vous que la base de données est configurée (voir DATABASE_GUIDE.md)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
              3
            </div>
            <p>
              <strong>Lancez la migration</strong> : Toutes les données seront copiées vers PostgreSQL
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
              4
            </div>
            <p>
              <strong>Vérifiez le résultat</strong> : Consultez les statistiques et corrigez les erreurs si nécessaire
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
