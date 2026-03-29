-- ==========================================
-- Script d'initialisation PostgreSQL
-- Exécuté automatiquement au premier démarrage
-- ==========================================

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Table: metrics_snapshots
-- Description: Historique des métriques
-- ==========================================
CREATE TABLE IF NOT EXISTS metrics_snapshots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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
CREATE INDEX IF NOT EXISTS idx_metrics_source_type ON metrics_snapshots(source, metric_type);

-- ==========================================
-- Table: alerts
-- Description: Alertes configurées
-- ==========================================
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- ==========================================
-- Données de test (optionnel, commenté)
-- ==========================================

-- Exemples de snapshots de métriques
-- INSERT INTO metrics_snapshots (id, source, project_key, metric_type, value, rating, created_at)
-- VALUES
--   (gen_random_uuid()::TEXT, 'sonarqube', 'demo-project', 'bugs', 12, 'B', NOW() - INTERVAL '7 days'),
--   (gen_random_uuid()::TEXT, 'sonarqube', 'demo-project', 'bugs', 8, 'A', NOW() - INTERVAL '1 day'),
--   (gen_random_uuid()::TEXT, 'sonarqube', 'demo-project', 'coverage', 75.5, 'B', NOW() - INTERVAL '7 days'),
--   (gen_random_uuid()::TEXT, 'sonarqube', 'demo-project', 'coverage', 82.3, 'A', NOW() - INTERVAL '1 day');

-- Exemples d'alertes
-- INSERT INTO alerts (id, name, description, source, project_key, condition, enabled, created_at)
-- VALUES
--   (
--     gen_random_uuid()::TEXT,
--     'Bugs critiques détectés',
--     'Alerte si plus de 10 bugs dans le projet',
--     'sonarqube',
--     'demo-project',
--     '{"metric": "bugs", "operator": ">", "threshold": 10}'::JSONB,
--     true,
--     NOW()
--   );

-- ==========================================
-- Affichage de confirmation
-- ==========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Base de données initialisée avec succès !';
  RAISE NOTICE '📊 Tables créées : metrics_snapshots, alerts, alert_triggers';
  RAISE NOTICE '🔧 Fonctions créées : cleanup_old_metrics(), get_metrics_stats()';
  RAISE NOTICE '👁️ Vue créée : active_alerts_summary';
END $$;
