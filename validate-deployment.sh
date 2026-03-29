#!/bin/bash

# ==================================
# Script de validation du déploiement
# Quality Portal - Docker
# ==================================

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║  Quality Portal - Validation Script      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# ==================================
# 1. Vérifier les prérequis
# ==================================

echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | tr -d ',')
    echo -e "  ${GREEN}✓${NC} Docker: $DOCKER_VERSION"
else
    echo -e "  ${RED}✗${NC} Docker non trouvé"
    exit 1
fi

# Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d ' ' -f4 | tr -d ',')
    echo -e "  ${GREEN}✓${NC} Docker Compose: $COMPOSE_VERSION"
else
    echo -e "  ${RED}✗${NC} Docker Compose non trouvé"
    exit 1
fi

# Fichier .env
if [ -f ".env" ]; then
    echo -e "  ${GREEN}✓${NC} Fichier .env présent"
else
    echo -e "  ${YELLOW}⚠${NC} Fichier .env manquant (copie de .env.example...)"
    cp .env.example .env
    echo -e "  ${GREEN}✓${NC} Fichier .env créé"
fi

# ==================================
# 2. Vérifier les fichiers requis
# ==================================

echo ""
echo -e "${YELLOW}📁 Vérification des fichiers...${NC}"

FILES=(
    "Dockerfile"
    "docker-compose.yml"
    "api/Dockerfile"
    "api/server.js"
    "api/package.json"
    "docker/nginx.conf"
    "docker/entrypoint.sh"
    "docker/init-db.sql"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file manquant"
        exit 1
    fi
done

# ==================================
# 3. Vérifier la configuration .env
# ==================================

echo ""
echo -e "${YELLOW}⚙️  Vérification de la configuration...${NC}"

source .env

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "change_me_in_production" ]; then
    echo -e "  ${YELLOW}⚠${NC} POSTGRES_PASSWORD: Utilisez un mot de passe sécurisé !"
else
    echo -e "  ${GREEN}✓${NC} POSTGRES_PASSWORD: Configuré"
fi

echo -e "  ${GREEN}✓${NC} POSTGRES_DB: ${POSTGRES_DB:-quality_portal}"
echo -e "  ${GREEN}✓${NC} POSTGRES_USER: ${POSTGRES_USER:-quality_user}"
echo -e "  ${GREEN}✓${NC} WEB_PORT: ${WEB_PORT:-8080}"
echo -e "  ${GREEN}✓${NC} API_PORT: ${API_PORT:-3001}"

# ==================================
# 4. Vérifier les ports disponibles
# ==================================

echo ""
echo -e "${YELLOW}🔌 Vérification des ports...${NC}"

PORTS=(
    "${WEB_PORT:-8080}"
    "${API_PORT:-3001}"
    "${POSTGRES_PORT:-5432}"
)

for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${YELLOW}⚠${NC} Port $port déjà utilisé"
    else
        echo -e "  ${GREEN}✓${NC} Port $port disponible"
    fi
done

# ==================================
# 5. Build des images (optionnel)
# ==================================

echo ""
read -p "Voulez-vous builder les images Docker maintenant ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔨 Build des images Docker...${NC}"
    docker-compose build
    echo -e "${GREEN}✓ Build terminé${NC}"
fi

# ==================================
# 6. Test de démarrage (optionnel)
# ==================================

echo ""
read -p "Voulez-vous démarrer les services maintenant ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Démarrage des services...${NC}"
    docker-compose up -d
    
    echo -e "${YELLOW}⏳ Attente du démarrage des services (30s)...${NC}"
    sleep 30
    
    # Vérifier les services
    echo ""
    echo -e "${YELLOW}🏥 Vérification des health checks...${NC}"
    
    # Web
    if curl -f -s http://localhost:${WEB_PORT:-8080}/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Web (port ${WEB_PORT:-8080}): OK"
    else
        echo -e "  ${RED}✗${NC} Web (port ${WEB_PORT:-8080}): KO"
    fi
    
    # API
    if curl -f -s http://localhost:${API_PORT:-3001}/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} API (port ${API_PORT:-3001}): OK"
    else
        echo -e "  ${RED}✗${NC} API (port ${API_PORT:-3001}): KO"
    fi
    
    # PostgreSQL
    if docker exec quality-portal-db pg_isready -U ${POSTGRES_USER:-quality_user} > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} PostgreSQL: OK"
    else
        echo -e "  ${RED}✗${NC} PostgreSQL: KO"
    fi
    
    # Status des conteneurs
    echo ""
    echo -e "${YELLOW}📊 Status des conteneurs:${NC}"
    docker-compose ps
fi

# ==================================
# 7. Résumé
# ==================================

echo ""
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║  Validation terminée !                    ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Services actifs !${NC}"
    echo ""
    echo "  Application Web : http://localhost:${WEB_PORT:-8080}"
    echo "  API Backend     : http://localhost:${API_PORT:-3001}/health"
    echo ""
    echo "Prochaines étapes :"
    echo "  1. Accédez à http://localhost:${WEB_PORT:-8080}"
    echo "  2. Allez dans Paramètres"
    echo "  3. Configurez vos APIs (SonarQube, ZAP, Wazuh)"
    echo "  4. Consultez la documentation : README.md"
else
    echo -e "${YELLOW}📝 Pour démarrer les services :${NC}"
    echo "  docker-compose up -d"
    echo "  # OU"
    echo "  make up"
fi

echo ""
echo -e "${BLUE}Commandes utiles :${NC}"
echo "  make help       - Voir toutes les commandes"
echo "  make logs       - Voir les logs"
echo "  make ps         - Status des services"
echo "  make db-shell   - Accéder à PostgreSQL"
echo ""
