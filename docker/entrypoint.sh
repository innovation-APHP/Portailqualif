#!/bin/sh

# Script d'entrée pour injecter les variables d'environnement au runtime
# Les variables d'environnement sont injectées dans le fichier env-config.js
# qui est chargé par l'application

set -e

echo "🚀 Démarrage de l'application Quality Portal..."

# Créer le fichier de configuration environnement
cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = {
  DATABASE_ENABLED: "${DATABASE_ENABLED:-false}",
  DATABASE_TYPE: "${DATABASE_TYPE:-postgresql}",
  POSTGRES_HOST: "${POSTGRES_HOST:-localhost}",
  POSTGRES_PORT: "${POSTGRES_PORT:-5432}",
  POSTGRES_DB: "${POSTGRES_DB:-quality_portal}",
  POSTGRES_USER: "${POSTGRES_USER:-quality_user}",
  POSTGRES_PASSWORD: "${POSTGRES_PASSWORD:-}",
  
  SONARQUBE_URL: "${SONARQUBE_URL:-}",
  SONARQUBE_TOKEN: "${SONARQUBE_TOKEN:-}",
  ZAP_URL: "${ZAP_URL:-}",
  ZAP_API_KEY: "${ZAP_API_KEY:-}",
  WAZUH_URL: "${WAZUH_URL:-}",
  WAZUH_USER: "${WAZUH_USER:-}",
  WAZUH_PASSWORD: "${WAZUH_PASSWORD:-}",
};
EOF

echo "✅ Configuration environnement créée"
echo "📊 Database: ${DATABASE_ENABLED:-false} (${DATABASE_TYPE:-postgresql})"
echo "🌐 Web server démarrage..."

# Exécuter la commande passée en argument (nginx)
exec "$@"
