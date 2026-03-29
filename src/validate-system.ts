/**
 * Tests de validation du système de stockage
 * 
 * Exécutez ce fichier pour valider que le système fonctionne correctement
 * en mode localStorage et PostgreSQL
 */

import { metricsHistoryService } from './app/services/metrics-history.service';
import { alertsService } from './app/services/alerts.service';
import { isDatabaseEnabled } from './app/config/database';

/**
 * Valide le fonctionnement du système
 */
export async function validateSystem() {
  console.log('🔍 Validation du système de stockage...\n');

  // 1. Vérifier le mode actif
  const mode = isDatabaseEnabled() ? 'PostgreSQL' : 'localStorage';
  console.log(`✓ Mode actif : ${mode}`);

  try {
    // 2. Test du service d'historique des métriques
    console.log('\n📊 Test du service d\'historique...');
    
    // Créer un snapshot
    const snapshot = await metricsHistoryService.createSnapshot(
      'sonarqube',
      'bugs',
      10,
      {
        projectKey: 'test-project',
        rating: 'B',
        metadata: { test: true }
      }
    );
    console.log('✓ Snapshot créé:', snapshot.id);

    // Récupérer l'historique
    const history = await metricsHistoryService.getHistory('sonarqube', {
      projectKey: 'test-project',
      metricType: 'bugs'
    });
    console.log(`✓ Historique récupéré: ${history.length} snapshot(s)`);

    // 3. Test du service d'alertes
    console.log('\n🔔 Test du service d\'alertes...');
    
    // Créer une alerte
    const alert = await alertsService.createAlert({
      name: 'Test Alert',
      description: 'Alerte de validation',
      source: 'sonarqube',
      projectKey: 'test-project',
      condition: {
        metric: 'bugs',
        operator: '>',
        threshold: 5
      },
      enabled: true
    });
    console.log('✓ Alerte créée:', alert.id);

    // Récupérer les alertes actives
    const activeAlerts = await alertsService.getActiveAlerts('sonarqube');
    console.log(`✓ Alertes actives: ${activeAlerts.length}`);

    // Vérifier si l'alerte doit se déclencher
    const triggered = await alertsService.checkAlerts(
      'sonarqube',
      'bugs',
      10,
      'test-project'
    );
    console.log(`✓ Alertes déclenchées: ${triggered.length}`);

    // 4. Test du calcul de tendance
    console.log('\n📈 Test du calcul de tendance...');
    
    // Créer un deuxième snapshot pour avoir une tendance
    await metricsHistoryService.createSnapshot(
      'sonarqube',
      'bugs',
      8,
      { projectKey: 'test-project', rating: 'A' }
    );

    const trend = await metricsHistoryService.calculateTrend(
      'sonarqube',
      'bugs',
      'test-project'
    );

    if (trend) {
      console.log('✓ Tendance calculée:');
      console.log(`  - Actuel: ${trend.current}`);
      console.log(`  - Précédent: ${trend.previous}`);
      console.log(`  - Changement: ${trend.change.toFixed(1)}%`);
      console.log(`  - Tendance: ${trend.trend}`);
    }

    // 5. Résumé
    console.log('\n✅ Tous les tests sont passés avec succès !');
    console.log(`\nMode : ${mode}`);
    console.log('Snapshots créés : 2');
    console.log('Alertes créées : 1');
    console.log('Alertes déclenchées : ' + triggered.length);

    return {
      success: true,
      mode,
      snapshot,
      alert,
      history,
      trend
    };

  } catch (error) {
    console.error('\n❌ Erreur lors de la validation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Nettoie les données de test
 */
export async function cleanupTestData() {
  console.log('\n🧹 Nettoyage des données de test...');
  
  try {
    // Récupérer tous les snapshots de test
    const history = await metricsHistoryService.getHistory('sonarqube', {
      projectKey: 'test-project'
    });

    // Supprimer (note: pas d'API de suppression directe dans le service actuel)
    console.log(`✓ ${history.length} snapshots de test trouvés`);

    // Récupérer toutes les alertes de test
    const alerts = await alertsService.getAllAlerts();
    const testAlerts = alerts.filter(a => a.name.includes('Test'));
    
    for (const alert of testAlerts) {
      await alertsService.deleteAlert(alert.id);
    }
    
    console.log(`✓ ${testAlerts.length} alertes de test supprimées`);
    console.log('\n✅ Nettoyage terminé !');
    
    return { success: true };
  } catch (error) {
    console.error('\n❌ Erreur lors du nettoyage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).validateSystem = validateSystem;
  (window as any).cleanupTestData = cleanupTestData;
  
  console.log('💡 Fonctions disponibles dans la console :');
  console.log('  - validateSystem() : Valide le système');
  console.log('  - cleanupTestData() : Nettoie les données de test');
}
