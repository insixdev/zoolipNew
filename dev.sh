#!/bin/bash

# Script para desarrollo local con Docker (CLI o Desktop)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN} Iniciando entorno de desarrollo con Docker...${NC}"

# Función para detectar Docker Compose
detect_docker_compose() {
    if command -v docker-compose > /dev/null 2>&1; then
        echo "docker-compose"
    elif docker compose version > /dev/null 2>&1; then
        echo "docker compose"
    else
        echo ""
    fi
}

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED} Docker no está corriendo.${NC}"
    echo -e "${YELLOW} Opciones para iniciar Docker:${NC}"
    echo -e "${BLUE}   • Docker Desktop: Inicia la aplicación${NC}"
    echo -e "${BLUE}   • Docker CLI (Linux): sudo systemctl start docker${NC}"
    echo -e "${BLUE}   • Docker CLI (macOS): colima start (si usas Colima)${NC}"
    exit 1
fi

# Detectar Docker Compose
COMPOSE_CMD=$(detect_docker_compose)
if [ -z "$COMPOSE_CMD" ]; then
    echo -e "${RED} Docker Compose no está disponible.${NC}"
    echo -e "${YELLOW} Instala Docker Compose:${NC}"
    echo -e "${BLUE}   • Linux: sudo apt-get install docker-compose-plugin${NC}"
    echo -e "${BLUE}   • macOS: brew install docker-compose${NC}"
    echo -e "${BLUE}   • O usa Docker Desktop que incluye Compose${NC}"
    exit 1
fi

echo -e "${GREEN} Docker detectado: $(docker --version)${NC}"
echo -e "${GREEN} Compose detectado: $COMPOSE_CMD${NC}"

# Construir y ejecutar el contenedor
echo -e "${YELLOW} Construyendo imagen de desarrollo...${NC}"
$COMPOSE_CMD -f docker-compose.dev.yml up --build

echo -e "${GREEN} Entorno de desarrollo iniciado!${NC}"
echo -e "${YELLOW} La aplicación estará disponible en: http://localhost:5173${NC}"
echo -e "${YELLOW} Hot reload está habilitado - los cambios se reflejarán automáticamente${NC}"
echo -e "${YELLOW} Para detener: Ctrl+C o '$COMPOSE_CMD -f docker-compose.dev.yml down'${NC}"
