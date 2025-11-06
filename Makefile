# Makefile para Zoolip Development

.PHONY: help dev dev-build dev-down dev-logs dev-shell clean install typecheck build prod

# Detectar Docker Compose automáticamente
COMPOSE_CMD := $(shell command -v docker-compose 2> /dev/null)
ifndef COMPOSE_CMD
	COMPOSE_CMD := docker compose
endif

# Mostrar ayuda por defecto
help:
	@echo "🐳 Comandos disponibles para Zoolip:"
	@echo ""
	@echo "  Desarrollo:"
	@echo "    make dev         - Iniciar entorno de desarrollo"
	@echo "    make dev-build   - Reconstruir imagen de desarrollo"
	@echo "    make dev-down    - Detener entorno de desarrollo"
	@echo "    make dev-logs    - Ver logs del entorno de desarrollo"
	@echo "    make dev-shell   - Abrir shell en el contenedor"
	@echo ""
	@echo "  Utilidades:"
	@echo "    make install     - Instalar nueva dependencia"
	@echo "    make typecheck   - Ejecutar verificación de tipos"

	@echo "    make docker-help - Mostrar ayuda de Docker"
	@echo "    make clean       - Limpiar contenedores e imágenes"
	@echo ""
	@echo "  Producción:"
	@echo "    make build       - Construir imagen de producción"
	@echo "    make prod        - Ejecutar en modo producción"

# Comandos de desarrollo
dev:
	@echo " Iniciando entorno de desarrollo..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml up

dev-build:
	@echo " Reconstruyendo imagen de desarrollo..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml up --build

dev-down:
	@echo " Deteniendo entorno de desarrollo..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml down

dev-logs:
	@echo " Mostrando logs..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml logs -f

dev-shell:
	@echo " Abriendo shell en el contenedor..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml exec app sh

# Utilidades
install:
	@echo " Instalando dependencias..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml exec app npm install

typecheck:
	@echo " Verificando tipos..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml exec app npm run typecheck

docker-help:
	@echo " Ayuda de Docker para Zoolip:"
	@echo ""
	@echo "  Verificar instalación:"
	@echo "    docker --version"
	@echo "    $(COMPOSE_CMD) --version"
	@echo ""
	@echo "  Opciones de desarrollo:"
	@echo "    ./dev.sh                 # Script con detección automática"
	@echo "    ./dev-docker-only.sh     # Solo Docker CLI"
	@echo "    make dev                 # Con Makefile"
	@echo ""
	@echo "  Instalar Docker CLI:"
	@echo "    ./install-docker.sh      # Script de instalación"

clean:
	@echo "🧹 Limpiando contenedores e imágenes..."
	$(COMPOSE_CMD) -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
	docker system prune -f

# Producción
build:
	@echo "🏗️  Construyendo imagen de producción..."
	docker build -t zoolip-prod .

prod: build
	@echo "🚀 Ejecutando en modo producción..."
	docker run -p 5173:5173 --name zoolip-prod zoolip-prod
