/**
 * Routes API pour la migration localStorage -> PostgreSQL
 */

import express from 'express';
import MigrationService from '../migration.service';

const router = express.Router();

// Configuration PostgreSQL depuis les variables d'environnement
const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'quality_portal',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres'
};

/**
 * POST /api/migration/execute
 * Exécute la migration des données localStorage vers PostgreSQL
 */
router.post('/execute', async (req, res) => {
  try {
    const localStorageData = req.body;

    if (!localStorageData) {
      return res.status(400).json({
        success: false,
        error: 'Aucune donnée fournie'
      });
    }

    const migrationService = new MigrationService(dbConfig);

    // Exécuter la migration
    const result = await migrationService.migrate(localStorageData);

    // Fermer les connexions
    await migrationService.close();

    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la migration:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/migration/status
 * Vérifie l'état actuel de la base de données
 */
router.get('/status', async (req, res) => {
  try {
    const migrationService = new MigrationService(dbConfig);
    const status = await migrationService.checkMigrationStatus();
    await migrationService.close();

    res.json(status);
  } catch (error: any) {
    console.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/migration/export
 * Exporte les données depuis PostgreSQL
 */
router.get('/export', async (req, res) => {
  try {
    const migrationService = new MigrationService(dbConfig);
    const data = await migrationService.exportFromDatabase();
    await migrationService.close();

    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de l\'export:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/migration/test-connection
 * Teste la connexion à PostgreSQL
 */
router.post('/test-connection', async (req, res) => {
  try {
    const customConfig = req.body.config || dbConfig;
    const migrationService = new MigrationService(customConfig);

    // Tester une simple requête
    const { Pool } = require('pg');
    const pool = new Pool(customConfig);
    await pool.query('SELECT NOW()');
    await pool.end();

    await migrationService.close();

    res.json({
      success: true,
      message: 'Connexion réussie à PostgreSQL'
    });
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
