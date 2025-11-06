#!/bin/bash

# Script para instalar Docker CLI en diferentes sistemas

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN} Instalador de Docker CLI${NC}"
echo -e "${YELLOW}Este script te ayudará a instalar Docker sin Docker Desktop${NC}"
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    OS="unknown"
fi

echo -e "${BLUE}Sistema detectado: $OS${NC}"
echo ""

case $OS in
    "linux")
        echo -e "${YELLOW}📋 Opciones para Linux:${NC}"
        echo ""
        echo -e "${BLUE}1. Ubuntu/Debian:${NC}"
        echo "   sudo apt-get update"
        echo "   sudo apt-get install docker.io docker-compose-plugin"
        echo "   sudo systemctl start docker"
        echo "   sudo systemctl enable docker"
        echo "   sudo usermod -aG docker \$USER"
        echo ""
        echo -e "${BLUE}2. CentOS/RHEL/Fedora:${NC}"
        echo "   sudo dnf install docker docker-compose"
        echo "   sudo systemctl start docker"
        echo "   sudo systemctl enable docker"
        echo "   sudo usermod -aG docker \$USER"
        echo ""
        echo -e "${BLUE}3. Arch Linux:${NC}"
        echo "   sudo pacman -S docker docker-compose"
        echo "   sudo systemctl start docker"
        echo "   sudo systemctl enable docker"
        echo "   sudo usermod -aG docker \$USER"
        echo ""
        echo -e "${YELLOW}⚠️  Después de la instalación, cierra sesión y vuelve a iniciar para aplicar los permisos${NC}"
        ;;
        
    "macos")
        echo -e "${YELLOW}📋 Opciones para macOS:${NC}"
        echo ""
        echo -e "${BLUE}1. Usando Homebrew (recomendado):${NC}"
        echo "   brew install docker docker-compose"
        echo "   brew install colima  # Motor de contenedores"
        echo "   colima start"
        echo ""
        echo -e "${BLUE}2. Usando Rancher Desktop:${NC}"
        echo "   brew install --cask rancher"
        echo "   # O descarga desde: https://rancherdesktop.io/"
        echo ""
        echo -e "${BLUE}3. Usando OrbStack:${NC}"
        echo "   brew install --cask orbstack"
        echo "   # O descarga desde: https://orbstack.dev/"
        ;;
        
    *)
        echo -e "${RED} Sistema operativo no soportado automáticamente${NC}"
        echo -e "${YELLOW} Visita https://docs.docker.com/engine/install/ para instrucciones específicas${NC}"
        ;;
esac

echo ""
echo -e "${GREEN} Verificar instalación:${NC}"
echo "   docker --version"
echo "   docker compose version"
echo "   docker info"
echo ""
echo -e "${GREEN} Iniciar desarrollo:${NC}"
echo "   ./dev.sh                 # Con Docker Compose"
echo "   ./dev-docker-only.sh     # Solo Docker CLI"
echo "   make dev                 # Con Makefile"
