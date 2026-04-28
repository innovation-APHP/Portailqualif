#!/bin/bash
# =====================================================
# Script d'Initialisation de la Migration
# Portail Qualité - PostgreSQL Setup
# =====================================================

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Initialisation Base de Données${NC}"
echo -e "${BLUE}  Portail Qualité - PostgreSQL${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Charger les variables d'environnement
if [ -f .env ]; then
    source .env
    echo -e "${GREEN}✓${NC} Fichier .env chargé"
else
    echo -e "${YELLOW}⚠${NC}  Fichier .env non trouvé, utilisation des valeurs par défaut"
fi

# Configuration par défaut
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DB:-quality_portal}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}

echo -e "\n${BLUE}Configuration :${NC}"
echo -e "  Host     : ${POSTGRES_HOST}"
echo -e "  Port     : ${POSTGRES_PORT}"
echo -e "  Database : ${POSTGRES_DB}"
echo -e "  User     : ${POSTGRES_USER}\n"

# Fonction pour tester la connexion
test_connection() {
    echo -e "${BLUE}→${NC} Test de connexion PostgreSQL..."

    if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c '\q' 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Connexion réussie"
        return 0
    else
        echo -e "${RED}✗${NC} Connexion échouée"
        echo -e "${YELLOW}⚠${NC}  Assurez-vous que PostgreSQL est démarré et accessible"
        return 1
    fi
}

# Fonction pour créer la base de données
create_database() {
    echo -e "\n${BLUE}→${NC} Création de la base de données..."

    if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -lqt | cut -d \| -f 1 | grep -qw $POSTGRES_DB; then
        echo -e "${YELLOW}⚠${NC}  La base de données '$POSTGRES_DB' existe déjà"
        read -p "Voulez-vous la réinitialiser ? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c "DROP DATABASE $POSTGRES_DB;"
            echo -e "${GREEN}✓${NC} Base de données supprimée"
        else
            echo -e "${YELLOW}→${NC} Utilisation de la base de données existante"
            return 0
        fi
    fi

    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $POSTGRES_DB;"
    echo -e "${GREEN}✓${NC} Base de données '$POSTGRES_DB' créée"
}

# Fonction pour appliquer le schéma
apply_schema() {
    echo -e "\n${BLUE}→${NC} Application du schéma de base de données..."

    if [ ! -f "database/schema.sql" ]; then
        echo -e "${RED}✗${NC} Fichier schema.sql non trouvé"
        echo -e "${YELLOW}⚠${NC}  Assurez-vous d'être à la racine du projet"
        return 1
    fi

    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f database/schema.sql
    echo -e "${GREEN}✓${NC} Schéma appliqué avec succès"
}

# Fonction pour vérifier le schéma
verify_schema() {
    echo -e "\n${BLUE}→${NC} Vérification du schéma..."

    local tables=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")

    echo -e "${GREEN}✓${NC} Tables créées : $tables"

    echo -e "\n${BLUE}Liste des tables :${NC}"
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "\dt"
}

# Fonction pour afficher les statistiques
show_stats() {
    echo -e "\n${BLUE}Statistiques de la base de données :${NC}"

    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB << EOF
SELECT 'admin_credentials' as table_name, COUNT(*) as count FROM admin_credentials
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'application_config_fields', COUNT(*) FROM application_config_fields
UNION ALL
SELECT 'application_config', COUNT(*) FROM application_config;
EOF
}

# Menu principal
main() {
    echo -e "\n${BLUE}Que souhaitez-vous faire ?${NC}"
    echo -e "  ${GREEN}1${NC}) Installation complète (recommandé)"
    echo -e "  ${GREEN}2${NC}) Tester la connexion uniquement"
    echo -e "  ${GREEN}3${NC}) Créer la base de données"
    echo -e "  ${GREEN}4${NC}) Appliquer le schéma"
    echo -e "  ${GREEN}5${NC}) Vérifier le schéma"
    echo -e "  ${GREEN}6${NC}) Afficher les statistiques"
    echo -e "  ${GREEN}q${NC}) Quitter\n"

    read -p "Votre choix : " choice

    case $choice in
        1)
            test_connection && create_database && apply_schema && verify_schema && show_stats
            ;;
        2)
            test_connection
            ;;
        3)
            test_connection && create_database
            ;;
        4)
            test_connection && apply_schema
            ;;
        5)
            test_connection && verify_schema
            ;;
        6)
            test_connection && show_stats
            ;;
        q|Q)
            echo -e "\n${BLUE}Au revoir !${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}✗${NC} Choix invalide"
            main
            ;;
    esac

    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}  Opération terminée${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

# Vérifier si psql est installé
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗${NC} psql n'est pas installé"
    echo -e "${YELLOW}⚠${NC}  Installez PostgreSQL client :"
    echo -e "    Ubuntu/Debian : sudo apt-get install postgresql-client"
    echo -e "    macOS         : brew install postgresql"
    exit 1
fi

# Lancer le menu principal
main
