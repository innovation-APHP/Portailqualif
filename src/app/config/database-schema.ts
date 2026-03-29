/**
 * Schémas SQL pour créer les tables PostgreSQL/Supabase
 * 
 * INSTRUCTIONS D'UTILISATION :
 * 
 * 1. Connectez-vous à votre instance Supabase
 * 2. Allez dans "SQL Editor"
 * 3. Copiez et exécutez ces requêtes SQL
 * 4. Les tables seront créées automatiquement
 * 5. Configurez ensuite les credentials dans la page Paramètres
 */

export const DATABASE_SCHEMA = `
-- ==========================================
-- Table: metrics_snapshots
-- Description: Historique des métriques
-- ==========================================
CREATE TABLE IF NOT EXISTS metrics_snapshots (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('sonarqube', 'zap', 'wazuh')),
  project_key TEXT,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  rating TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_metrics_source ON metrics_snapshots(source);
CREATE INDEX IF NOT EXISTS idx_metrics_project ON metrics_snapshots(project_key);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON metrics_snapshots(metric_type);
CREATE INDEX IF NOT EXISTS idx_metrics_created ON metrics_snapshots(created_at DESC);

-- ==========================================
-- Table: alerts
-- Description: Alertes configurées
-- ==========================================
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL CHECK (source IN ('sonarqube', 'zap', 'wazuh')),
  project_key TEXT,
  condition JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  notification_channels TEXT[],
  last_triggered TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_alerts_source ON alerts(source);
CREATE INDEX IF NOT EXISTS idx_alerts_enabled ON alerts(enabled);
CREATE INDEX IF NOT EXISTS idx_alerts_project ON alerts(project_key);

-- ==========================================
-- Table: alert_triggers
-- Description: Historique des déclenchements
-- ==========================================
CREATE TABLE IF NOT EXISTS alert_triggers (
  id TEXT PRIMARY KEY,
  alert_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  alert_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  threshold NUMERIC NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_triggers_alert ON alert_triggers(alert_id);
CREATE INDEX IF NOT EXISTS idx_triggers_ack ON alert_triggers(acknowledged);
CREATE INDEX IF NOT EXISTS idx_triggers_created ON alert_triggers(created_at DESC);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- Active RLS pour toutes les tables
ALTER TABLE metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_triggers ENABLE ROW LEVEL SECURITY;

-- Politique : Tous les utilisateurs authentifiés peuvent tout faire
-- Note: Ajustez ces politiques selon vos besoins de sécurité

CREATE POLICY "Autoriser toutes opérations metrics_snapshots"
  ON metrics_snapshots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Autoriser toutes opérations alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Autoriser toutes opérations alert_triggers"
  ON alert_triggers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- Fonctions utiles
-- ==========================================

-- Fonction pour nettoyer les vieux snapshots automatiquement
CREATE OR REPLACE FUNCTION cleanup_old_metrics(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM metrics_snapshots
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques par source
CREATE OR REPLACE FUNCTION get_metrics_stats(source_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  source TEXT,
  total_snapshots BIGINT,
  earliest_date TIMESTAMP WITH TIME ZONE,
  latest_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ms.source,
    COUNT(*)::BIGINT as total_snapshots,
    MIN(ms.created_at) as earliest_date,
    MAX(ms.created_at) as latest_date
  FROM metrics_snapshots ms
  WHERE source_filter IS NULL OR ms.source = source_filter
  GROUP BY ms.source
  ORDER BY ms.source;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- Vues utiles
-- ==========================================

-- Vue : Alertes actives avec statistiques
CREATE OR REPLACE VIEW active_alerts_summary AS
SELECT
  a.id,
  a.name,
  a.source,
  a.project_key,
  a.enabled,
  a.trigger_count,
  a.last_triggered,
  COUNT(at.id) FILTER (WHERE at.acknowledged = false) as unacknowledged_count,
  COUNT(at.id) as total_triggers
FROM alerts a
LEFT JOIN alert_triggers at ON a.id = at.alert_id
WHERE a.enabled = true
GROUP BY a.id, a.name, a.source, a.project_key, a.enabled, a.trigger_count, a.last_triggered;

-- ==========================================
-- Commentaires pour documentation
-- ==========================================

COMMENT ON TABLE metrics_snapshots IS 'Snapshots périodiques des métriques de qualité et sécurité';
COMMENT ON TABLE alerts IS 'Configuration des alertes personnalisées';
COMMENT ON TABLE alert_triggers IS 'Historique des déclenchements d''alertes';
COMMENT ON FUNCTION cleanup_old_metrics IS 'Nettoie les métriques plus anciennes que X jours';
COMMENT ON FUNCTION get_metrics_stats IS 'Statistiques sur les snapshots de métriques';
COMMENT ON VIEW active_alerts_summary IS 'Vue récapitulative des alertes actives';
`;

/**
 * Script pour supprimer toutes les tables (ATTENTION: perte de données)
 */
export const DROP_ALL_TABLES = `
DROP VIEW IF EXISTS active_alerts_summary;
DROP FUNCTION IF EXISTS get_metrics_stats;
DROP FUNCTION IF EXISTS cleanup_old_metrics;
DROP TABLE IF EXISTS alert_triggers CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS metrics_snapshots CASCADE;
`;

/**
 * Exemple de données de test
 */
export const SAMPLE_DATA = `
-- Exemples de snapshots de métriques
INSERT INTO metrics_snapshots (id, source, project_key, metric_type, value, rating, created_at)
VALUES
  ('sample-1', 'sonarqube', 'my-project', 'bugs', 12, 'B', NOW() - INTERVAL '7 days'),
  ('sample-2', 'sonarqube', 'my-project', 'bugs', 8, 'A', NOW() - INTERVAL '1 day'),
  ('sample-3', 'sonarqube', 'my-project', 'coverage', 75.5, 'B', NOW() - INTERVAL '7 days'),
  ('sample-4', 'sonarqube', 'my-project', 'coverage', 82.3, 'A', NOW() - INTERVAL '1 day');

-- Exemples d'alertes
INSERT INTO alerts (id, name, description, source, project_key, condition, enabled, created_at)
VALUES
  (
    'alert-1',
    'Bugs critiques détectés',
    'Alerte si plus de 10 bugs dans le projet',
    'sonarqube',
    'my-project',
    '{"metric": "bugs", "operator": ">", "threshold": 10}'::JSONB,
    true,
    NOW()
  ),
  (
    'alert-2',
    'Couverture de tests insuffisante',
    'Alerte si la couverture tombe sous 80%',
    'sonarqube',
    'my-project',
    '{"metric": "coverage", "operator": "<", "threshold": 80}'::JSONB,
    true,
    NOW()
  );
`;
