#!/bin/bash

# Script para desarrollo usando solo Docker CLI (sin Compose)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Iniciando entorno de desarrollo con Docker CLI...${NC}"

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker no está corriendo.${NC}"
    echo -e "${YELLOW}💡 Opciones para iniciar Docker:${NC}"
    echo -e "${BLUE}   • Docker CLI (Linux): sudo systemctl start docker${NC}"
    echo -e "${BLUE}   • Docker CLI (macOS): colima start (si usas Colima)${NC}"
    exit 1
fi

# Variables
IMAGE_NAME="zoolip-dev"
CONTAINER_NAME="zoolip-dev-container"
PORT="5173"

# Limpiar contenedor existente si existe
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🧹 Limpiando contenedor existente...${NC}"
    docker stop $CONTAINER_NAME > /dev/null 2>&1
    docker rm $CONTAINER_NAME > /dev/null 2>&1
fi

# Construir imagen
echo -e "${YELLOW}📦 Construyendo imagen de desarrollo...${NC}"
docker build -f Dockerfile.dev -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir la imagen${NC}"
    exit 1
fi

# Ejecutar contenedor
echo -e "${YELLOW}🚀 Iniciando contenedor...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    -v "$(pwd):/app" \
    -v /app/node_modules \
    -e NODE_ENV=development \
    -e CHOKIDAR_USEPOLLING=true \
    -e JWT_SECRET=dev-jwt-secret-zoolip-docker-2024 \
    --env-file .env \
    $IMAGE_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Entorno de desarrollo iniciado!${NC}"
    echo -e "${YELLOW}🌐 La aplicación estará disponible en: http://localhost:$PORT${NC}"
    echo -e "${YELLOW}🔄 Hot reload está habilitado${NC}"
    echo -e "${YELLOW}📋 Ver logs: docker logs -f $CONTAINER_NAME${NC}"
    echo -e "${YELLOW}⏹️  Para detener: docker stop $CONTAINER_NAME${NC}"
    echo -e "${YELLOW}🐚 Shell: docker exec -it $CONTAINER_NAME sh${NC}"
    
    # Mostrar logs en tiempo real
    echo -e "${BLUE}📋 Mostrando logs (Ctrl+C para salir de los logs):${NC}"
    docker logs -f $CONTAINER_NAME
else
    echo -e "${RED}❌ Error al iniciar el contenedor${NC}"
    exit 1
fi