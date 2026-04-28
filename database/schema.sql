-- =====================================================
-- Schéma de Base de Données Normalisé
-- Portail Qualité - Migration depuis localStorage
-- =====================================================

-- Suppression des tables existantes (si besoin)
DROP TABLE IF EXISTS application_config CASCADE;
DROP TABLE IF EXISTS application_config_fields CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS admin_credentials CASCADE;

-- =====================================================
-- Table: admin_credentials
-- Stockage des identifiants administrateur
-- =====================================================
CREATE TABLE admin_credentials (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche rapide par username
CREATE INDEX idx_admin_username ON admin_credentials(username);

-- =====================================================
-- Table: applications
-- Stockage des applications configurées
-- =====================================================
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT false,
    connection_type VARCHAR(50), -- 'url' ou 'api'
    external_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche par nom et statut
CREATE INDEX idx_app_name ON applications(name);
CREATE INDEX idx_app_enabled ON applications(enabled);
CREATE INDEX idx_app_type ON applications(connection_type);

-- =====================================================
-- Table: application_config_fields
-- Définition des champs de configuration (schéma)
-- =====================================================
CREATE TABLE application_config_fields (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'url', 'password', 'apiKey'
    required BOOLEAN DEFAULT false,
    placeholder TEXT,
    help_text TEXT,
    field_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index composé pour récupération efficace
CREATE INDEX idx_config_fields_app ON application_config_fields(application_id);
CREATE UNIQUE INDEX idx_config_fields_unique ON application_config_fields(application_id, field_key);

-- =====================================================
-- Table: application_config
-- Valeurs de configuration réelles
-- =====================================================
CREATE TABLE application_config (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    is_sensitive BOOLEAN DEFAULT false, -- Pour marquer les clés API/passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche rapide
CREATE INDEX idx_app_config_app ON application_config(application_id);
CREATE UNIQUE INDEX idx_app_config_unique ON application_config(application_id, config_key);

-- =====================================================
-- Fonction: Mise à jour automatique de updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mise à jour automatique
CREATE TRIGGER update_admin_credentials_updated_at
    BEFORE UPDATE ON admin_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_config_updated_at
    BEFORE UPDATE ON application_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Données initiales
-- =====================================================

-- Admin par défaut (à changer immédiatement!)
INSERT INTO admin_credentials (username, password)
VALUES ('admin', 'admin123');

-- =====================================================
-- Vues utiles
-- =====================================================

-- Vue complète d'une application avec sa config
CREATE OR REPLACE VIEW v_applications_full AS
SELECT
    a.id,
    a.name,
    a.description,
    a.icon,
    a.enabled,
    a.connection_type,
    a.external_url,
    a.created_at,
    a.updated_at,
    json_agg(
        json_build_object(
            'key', cf.field_key,
            'label', cf.label,
            'type', cf.field_type,
            'required', cf.required,
            'placeholder', cf.placeholder,
            'helpText', cf.help_text
        ) ORDER BY cf.field_order
    ) FILTER (WHERE cf.id IS NOT NULL) as config_fields,
    json_object_agg(
        ac.config_key, ac.config_value
    ) FILTER (WHERE ac.id IS NOT NULL) as config
FROM applications a
LEFT JOIN application_config_fields cf ON a.id = cf.application_id
LEFT JOIN application_config ac ON a.id = ac.application_id
GROUP BY a.id, a.name, a.description, a.icon, a.enabled, a.connection_type, a.external_url, a.created_at, a.updated_at;

-- =====================================================
-- Commentaires sur les tables
-- =====================================================

COMMENT ON TABLE admin_credentials IS 'Identifiants administrateur du portail';
COMMENT ON TABLE applications IS 'Applications configurées dans le portail';
COMMENT ON TABLE application_config_fields IS 'Définition des champs de configuration pour chaque application';
COMMENT ON TABLE application_config IS 'Valeurs de configuration des applications';

COMMENT ON COLUMN application_config.is_sensitive IS 'Marque les données sensibles (API keys, passwords) pour un traitement sécurisé';
COMMENT ON COLUMN application_config_fields.field_order IS 'Ordre d''affichage des champs dans l''interface';

-- =====================================================
-- Permissions (à adapter selon vos besoins)
-- =====================================================

-- Créer un utilisateur pour l'application (optionnel)
-- CREATE USER quality_portal_app WITH PASSWORD 'votre_mot_de_passe_securise';
-- GRANT CONNECT ON DATABASE quality_portal TO quality_portal_app;
-- GRANT USAGE ON SCHEMA public TO quality_portal_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO quality_portal_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO quality_portal_app;
