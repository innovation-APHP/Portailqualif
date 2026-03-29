/**
 * Exemple d'utilisation du système de stockage PostgreSQL
 * 
 * Ce fichier démontre comment :
 * 1. Créer des snapshots de métriques
 * 2. Récupérer l'historique
 * 3. Calculer les tendances
 * 4. Gérer les alertes
 */

import { useEffect, useState } from 'react';
import { metricsHistoryService, MetricSnapshot } from '../services/metrics-history.service';
import { alertsService, Alert } from '../services/alerts.service';
import { useDatabaseStatus } from '../hooks/useDatabaseStatus';
import { Database, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function DatabaseExample() {
  const { mode, isPostgreSQL } = useDatabaseStatus();
  const [snapshots, setSnapshots] = useState<MetricSnapshot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [mode]);

  async function loadData() {
    setLoading(true);
    try {
      // Récupérer les 10 derniers snapshots
      const allSnapshots = await metricsHistoryService.getHistory('sonarqube', {
        days: 30
      });
      setSnapshots(allSnapshots.slice(0, 10));

      // Récupérer les alertes actives
      const activeAlerts = await alertsService.getActiveAlerts('sonarqube');
      setAlerts(activeAlerts);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }

  // Créer un snapshot de test
  async function createTestSnapshot() {
    try {
      await metricsHistoryService.createSnapshot(
        'sonarqube',
        'bugs',
        Math.floor(Math.random() * 20),
        {
          projectKey: 'example-project',
          rating: 'B',
          metadata: { test: true }
        }
      );
      
      // Recharger les données
      await loadData();
      alert('Snapshot créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du snapshot:', error);
      alert('Erreur lors de la création du snapshot');
    }
  }

  // Créer une alerte de test
  async function createTestAlert() {
    try {
      await alertsService.createAlert({
        name: 'Test - Trop de bugs',
        description: 'Alerte de démonstration',
        source: 'sonarqube',
        projectKey: 'example-project',
        condition: {
          metric: 'bugs',
          operator: '>',
          threshold: 10
        },
        enabled: true,
        notificationChannels: ['email']
      });
      
      // Recharger les données
      await loadData();
      alert('Alerte créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      alert('Erreur lors de la création de l\'alerte');
    }
  }

  // Calculer une tendance
  async function calculateTestTrend() {
    try {
      const trend = await metricsHistoryService.calculateTrend(
        'sonarqube',
        'bugs',
        'example-project'
      );
      
      if (!trend) {
        alert('Pas assez de données pour calculer une tendance (minimum 2 snapshots)');
        return;
      }

      const message = `
Tendance calculée :
- Actuel: ${trend.current}
- Précédent: ${trend.previous}
- Changement: ${trend.change.toFixed(1)}%
- Tendance: ${trend.trend === 'up' ? '📈 Hausse' : trend.trend === 'down' ? '📉 Baisse' : '➡️ Stable'}
      `.trim();
      
      alert(message);
    } catch (error) {
      console.error('Erreur lors du calcul de la tendance:', error);
      alert('Erreur lors du calcul de la tendance');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut */}
      <div className={`p-4 rounded-lg border ${
        isPostgreSQL 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          <Database className={`w-5 h-5 ${isPostgreSQL ? 'text-green-600' : 'text-yellow-600'}`} />
          <div>
            <p className={`font-medium ${isPostgreSQL ? 'text-green-900' : 'text-yellow-900'}`}>
              Mode actif : {mode}
            </p>
            <p className={`text-sm ${isPostgreSQL ? 'text-green-700' : 'text-yellow-700'}`}>
              {isPostgreSQL 
                ? 'Les données sont stockées dans PostgreSQL'
                : 'Les données sont stockées dans localStorage'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Actions de test</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={createTestSnapshot}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un snapshot
          </button>
          <button
            onClick={createTestAlert}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Créer une alerte
          </button>
          <button
            onClick={calculateTestTrend}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Calculer tendance
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Recharger
          </button>
        </div>
      </div>

      {/* Snapshots récents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Snapshots récents ({snapshots.length})
        </h3>
        {snapshots.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun snapshot enregistré</p>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {snapshot.metricType} = {snapshot.value}
                  </p>
                  <p className="text-sm text-gray-600">
                    {snapshot.projectKey || 'N/A'} • {new Date(snapshot.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                {snapshot.rating && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    snapshot.rating === 'A' ? 'bg-green-100 text-green-700' :
                    snapshot.rating === 'B' ? 'bg-blue-100 text-blue-700' :
                    snapshot.rating === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    snapshot.rating === 'D' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {snapshot.rating}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alertes actives */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Alertes actives ({alerts.length})
        </h3>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune alerte configurée</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.name}</p>
                  <p className="text-sm text-gray-600">
                    {alert.condition.metric} {alert.condition.operator} {alert.condition.threshold}
                  </p>
                  {alert.lastTriggered && (
                    <p className="text-xs text-gray-500 mt-1">
                      Dernier déclenchement : {new Date(alert.lastTriggered).toLocaleString('fr-FR')}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {alert.triggerCount} déclenchement{alert.triggerCount > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Astuce :</strong> Les snapshots et alertes créés ici sont des données de test.
          En production, vous créeriez des snapshots automatiquement lors de la récupération des métriques
          depuis SonarQube, ZAP et Wazuh.
        </p>
      </div>
    </div>
  );
}
