# ==================================
# Quality Portal - Makefile
# ==================================

.PHONY: help build up down restart logs ps clean backup restore

# Variables
COMPOSE = docker-compose
COMPOSE_ADMIN = docker-compose --profile admin

# Couleurs pour l'affichage
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Affiche cette aide
	@echo "$(GREEN)Quality Portal - Commandes disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ==================================
# Commandes de base
# ==================================

build: ## Build les images Docker
	@echo "$(GREEN)🔨 Build des images...$(NC)"
	$(COMPOSE) build

up: ## Démarre tous les services
	@echo "$(GREEN)🚀 Démarrage des services...$(NC)"
	$(COMPOSE) up -d
	@echo "$(GREEN)✅ Services démarrés !$(NC)"
	@echo ""
	@echo "  Application Web : http://localhost:8080"
	@echo "  API Backend     : http://localhost:3001/health"
	@echo ""

up-admin: ## Démarre avec pgAdmin
	@echo "$(GREEN)🚀 Démarrage avec pgAdmin...$(NC)"
	$(COMPOSE_ADMIN) up -d
	@echo "$(GREEN)✅ Services démarrés !$(NC)"
	@echo ""
	@echo "  Application Web : http://localhost:8080"
	@echo "  API Backend     : http://localhost:3001/health"
	@echo "  pgAdmin         : http://localhost:5050"
	@echo ""

down: ## Arrête tous les services
	@echo "$(YELLOW)⏹️  Arrêt des services...$(NC)"
	$(COMPOSE) down

restart: down up ## Redémarre tous les services

# ==================================
# Logs et monitoring
# ==================================

logs: ## Affiche les logs (temps réel)
	$(COMPOSE) logs -f

logs-web: ## Logs du service web
	$(COMPOSE) logs -f web

logs-api: ## Logs du service API
	$(COMPOSE) logs -f api

logs-db: ## Logs PostgreSQL
	$(COMPOSE) logs -f postgres

ps: ## Status des services
	@$(COMPOSE) ps

stats: ## Utilisation des ressources
	@docker stats --no-stream

# ==================================
# Base de données
# ==================================

db-shell: ## Shell PostgreSQL (psql)
	@docker exec -it quality-portal-db psql -U quality_user -d quality_portal

db-tables: ## Liste les tables
	@docker exec -it quality-portal-db psql -U quality_user -d quality_portal -c "\dt"

db-stats: ## Statistiques de la base
	@docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
		-c "SELECT * FROM get_metrics_stats();"

db-count: ## Compte les entrées
	@echo "$(GREEN)📊 Statistiques des tables :$(NC)"
	@docker exec -it quality-portal-db psql -U quality_user -d quality_portal -t -c \
		"SELECT 'Snapshots: ' || COUNT(*) FROM metrics_snapshots; \
		 SELECT 'Alertes: ' || COUNT(*) FROM alerts; \
		 SELECT 'Déclenchements: ' || COUNT(*) FROM alert_triggers;"

db-cleanup: ## Nettoie les snapshots > 90 jours
	@echo "$(YELLOW)🧹 Nettoyage des vieux snapshots...$(NC)"
	@docker exec -it quality-portal-db psql -U quality_user -d quality_portal \
		-c "SELECT cleanup_old_metrics(90);"
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

# ==================================
# Backup & Restore
# ==================================

backup: ## Backup PostgreSQL
	@echo "$(GREEN)💾 Backup de la base de données...$(NC)"
	@mkdir -p backups
	@docker exec quality-portal-db pg_dump -U quality_user quality_portal | \
		gzip > backups/postgres_$$(date +%Y%m%d_%H%M%S).sql.gz
	@echo "$(GREEN)✅ Backup créé dans backups/$(NC)"

backup-volumes: ## Backup des volumes Docker
	@echo "$(GREEN)💾 Backup des volumes...$(NC)"
	@mkdir -p backups
	@docker run --rm \
		-v quality-portal_postgres_data:/data \
		-v $$(pwd)/backups:/backup \
		alpine tar czf /backup/volumes_$$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
	@echo "$(GREEN)✅ Backup des volumes créé$(NC)"

restore: ## Restore PostgreSQL (usage: make restore FILE=backup.sql.gz)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Usage: make restore FILE=backup.sql.gz$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)⚠️  Restauration de $(FILE)...$(NC)"
	@gunzip < $(FILE) | docker exec -i quality-portal-db \
		psql -U quality_user quality_portal
	@echo "$(GREEN)✅ Restauration terminée$(NC)"

# ==================================
# Développement
# ==================================

dev: ## Mode développement (avec logs)
	$(COMPOSE) up

rebuild: ## Rebuild complet (sans cache)
	@echo "$(YELLOW)🔨 Rebuild complet...$(NC)"
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d
	@echo "$(GREEN)✅ Rebuild terminé$(NC)"

shell-web: ## Shell dans le conteneur web
	@docker exec -it quality-portal-web sh

shell-api: ## Shell dans le conteneur API
	@docker exec -it quality-portal-api sh

# ==================================
# Nettoyage
# ==================================

clean: ## Arrête et supprime les conteneurs
	@echo "$(YELLOW)🧹 Nettoyage...$(NC)"
	$(COMPOSE) down
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

clean-all: ## ⚠️ SUPPRIME TOUT (conteneurs + volumes + images)
	@echo "$(RED)⚠️  ATTENTION : Suppression complète (données incluses)$(NC)"
	@echo "$(RED)Appuyez sur Ctrl+C pour annuler, ou Entrée pour continuer$(NC)"
	@read dummy
	$(COMPOSE) down -v
	docker image rm quality-portal-web quality-portal-api 2>/dev/null || true
	@echo "$(GREEN)✅ Tout a été supprimé$(NC)"

prune: ## Nettoie Docker (images/volumes inutilisés)
	@echo "$(YELLOW)🧹 Nettoyage Docker...$(NC)"
	docker system prune -f
	docker volume prune -f
	@echo "$(GREEN)✅ Docker nettoyé$(NC)"

# ==================================
# Tests & Health checks
# ==================================

health: ## Vérifie la santé des services
	@echo "$(GREEN)🏥 Health checks :$(NC)"
	@curl -s http://localhost:8080/health && echo "  ✅ Web : OK" || echo "  ❌ Web : KO"
	@curl -s http://localhost:3001/health && echo "  ✅ API : OK" || echo "  ❌ API : KO"

test-api: ## Test de l'API
	@echo "$(GREEN)🧪 Test de l'API :$(NC)"
	@curl -s http://localhost:3001/health | jq '.'
	@curl -s http://localhost:3001/api/metrics_snapshots | jq '. | length' | \
		xargs -I {} echo "  Snapshots : {}"

# ==================================
# Production
# ==================================

deploy: ## Déploiement en production
	@echo "$(GREEN)🚀 Déploiement...$(NC)"
	git pull origin main
	$(MAKE) build
	$(COMPOSE) up -d
	sleep 10
	$(MAKE) health
	@echo "$(GREEN)✅ Déploiement terminé$(NC)"

# ==================================
# Documentation
# ==================================

docs: ## Ouvre la documentation
	@if command -v xdg-open > /dev/null; then \
		xdg-open DOCKER_DEPLOYMENT.md; \
	elif command -v open > /dev/null; then \
		open DOCKER_DEPLOYMENT.md; \
	else \
		cat DOCKER_DEPLOYMENT.md; \
	fi

# Cible par défaut
.DEFAULT_GOAL := help
