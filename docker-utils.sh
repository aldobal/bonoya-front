#!/bin/bash

# Script de utilidades para Docker - BonoFácil Frontend

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}BonoFácil Docker Utilities${NC}"
    echo ""
    echo "Uso: ./docker-utils.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  dev                 - Iniciar entorno de desarrollo"
    echo "  prod                - Iniciar entorno de producción"
    echo "  build               - Construir imagen de producción"
    echo "  build-dev           - Construir imagen de desarrollo"
    echo "  stop                - Detener contenedores de desarrollo"
    echo "  stop-prod           - Detener contenedores de producción"
    echo "  clean               - Limpiar contenedores y volúmenes"
    echo "  logs                - Ver logs del frontend de desarrollo"
    echo "  shell               - Entrar al contenedor de desarrollo"
    echo "  status              - Ver estado de contenedores"
    echo "  restart             - Reiniciar contenedores de desarrollo"
    echo "  health              - Verificar salud de contenedores"
    echo "  help                - Mostrar esta ayuda"
}

# Función para verificar si Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker no está corriendo${NC}"
        exit 1
    fi
}

# Función para mostrar logs con colores
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar argumentos
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Verificar Docker
check_docker

# Procesar comando
case $1 in
    "dev")
        log_info "Iniciando entorno de desarrollo..."
        docker-compose up --build
        ;;
    "prod")
        log_info "Iniciando entorno de producción..."
        docker-compose -f docker-compose.prod.yml up --build
        ;;
    "build")
        log_info "Construyendo imagen de producción..."
        docker build -t bonofacil-frontend .
        log_success "Imagen construida: bonofacil-frontend"
        ;;
    "build-dev")
        log_info "Construyendo imagen de desarrollo..."
        docker build -f Dockerfile.dev -t bonofacil-frontend-dev .
        log_success "Imagen construida: bonofacil-frontend-dev"
        ;;
    "stop")
        log_info "Deteniendo contenedores de desarrollo..."
        docker-compose down
        log_success "Contenedores detenidos"
        ;;
    "stop-prod")
        log_info "Deteniendo contenedores de producción..."
        docker-compose -f docker-compose.prod.yml down
        log_success "Contenedores de producción detenidos"
        ;;
    "clean")
        log_warning "Limpiando contenedores, imágenes y volúmenes..."
        docker-compose down --volumes --rmi all
        docker system prune -f
        log_success "Sistema limpiado"
        ;;
    "logs")
        log_info "Mostrando logs del frontend..."
        docker-compose logs -f bonofacil-frontend-dev
        ;;
    "shell")
        log_info "Entrando al contenedor de desarrollo..."
        docker-compose exec bonofacil-frontend-dev sh
        ;;
    "status")
        log_info "Estado de contenedores:"
        docker-compose ps
        echo ""
        docker-compose -f docker-compose.prod.yml ps
        ;;
    "restart")
        log_info "Reiniciando contenedores de desarrollo..."
        docker-compose restart
        log_success "Contenedores reiniciados"
        ;;
    "health")
        log_info "Verificando salud de contenedores..."
        docker ps --filter "name=bonofacil" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;
    "help")
        show_help
        ;;
    *)
        log_error "Comando desconocido: $1"
        show_help
        exit 1
        ;;
esac
