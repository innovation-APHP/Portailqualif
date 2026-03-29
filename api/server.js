import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.API_PORT || 3001;

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'quality_portal',
  user: process.env.POSTGRES_USER || 'quality_user',
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err);
  } else {
    console.log('✅ Connecté à PostgreSQL:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==========================================
// Health check
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ==========================================
// Routes génériques CRUD
// ==========================================

/**
 * GET /:table - Récupérer toutes les entrées (avec filtres optionnels)
 */
app.get('/api/:table', async (req, res) => {
  const { table } = req.params;
  const allowedTables = ['metrics_snapshots', 'alerts', 'alert_triggers'];
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Table non autorisée' });
  }

  try {
    // Construire la requête avec filtres
    const filters = [];
    const values = [];
    let paramCount = 1;

    Object.entries(req.query).forEach(([key, value]) => {
      if (value) {
        filters.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `SELECT * FROM ${table} ${whereClause} ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error(`Erreur GET /${table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /:table/:id - Récupérer une entrée par ID
 */
app.get('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['metrics_snapshots', 'alerts', 'alert_triggers'];
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Table non autorisée' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Erreur GET /${table}/${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /:table - Créer une nouvelle entrée
 */
app.post('/api/:table', async (req, res) => {
  const { table } = req.params;
  const allowedTables = ['metrics_snapshots', 'alerts', 'alert_triggers'];
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Table non autorisée' });
  }

  try {
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`Erreur POST /${table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /:table/:id - Mettre à jour une entrée
 */
app.patch('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['metrics_snapshots', 'alerts', 'alert_triggers'];
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Table non autorisée' });
  }

  try {
    const data = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id') {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    values.push(id);

    const query = `
      UPDATE ${table}
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Erreur PATCH /${table}/${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /:table/:id - Supprimer une entrée
 */
app.delete('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['metrics_snapshots', 'alerts', 'alert_triggers'];
  
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Table non autorisée' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(`Erreur DELETE /${table}/${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Routes spéciales
// ==========================================

/**
 * GET /api/stats - Statistiques globales
 */
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM get_metrics_stats()');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/cleanup - Nettoyer les vieux snapshots
 */
app.post('/api/cleanup', async (req, res) => {
  const { days = 90 } = req.body;

  try {
    const result = await pool.query(
      'SELECT cleanup_old_metrics($1) as deleted_count',
      [days]
    );
    res.json({ deletedCount: result.rows[0].deleted_count });
  } catch (error) {
    console.error('Erreur POST /cleanup:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/alerts/summary - Résumé des alertes actives
 */
app.get('/api/alerts/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM active_alerts_summary');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /alerts/summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Gestion des erreurs
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// ==========================================
// Démarrage du serveur
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Quality Portal API Server            ║
║                                           ║
║  Port: ${PORT}                              ║
║  Database: ${process.env.POSTGRES_DB}       ║
║  Host: ${process.env.POSTGRES_HOST}         ║
║                                           ║
║  Health: http://localhost:${PORT}/health   ║
║  API: http://localhost:${PORT}/api         ║
╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture propre...');
  pool.end(() => {
    console.log('Pool PostgreSQL fermé');
    process.exit(0);
  });
});
