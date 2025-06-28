#!/bin/bash

# Docker scripts for Queue Application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if required files exist
check_files() {
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found. Please ensure Docker files are created."
        exit 1
    fi
}

# Development commands
dev() {
    print_status "Starting development environment..."
    check_docker
    check_files
    docker compose --profile dev up --build
}

dev_detached() {
    print_status "Starting development environment in detached mode..."
    check_docker
    check_files
    docker compose --profile dev up --build -d
    print_success "Development environment started. Access at http://localhost:3000"
}

# Production commands
prod() {
    print_status "Starting production environment..."
    check_docker
    check_files
    docker compose --profile prod up --build
    print_success "Production environment started. Access at https://localhost:3000"
}

prod_detached() {
    print_status "Starting production environment in detached mode..."
}

# Build commands
build_dev() {
    print_status "Building development image..."
    check_docker
    check_files
    docker build -f Dockerfile.dev -t queue-app:dev .
    print_success "Development image built successfully"
}

build_prod() {
    print_status "Building production image..."
    check_docker
    check_files
    docker build -f Dockerfile -t queue-app:prod .
    print_success "Production image built successfully"
}

# Stop commands
stop() {
    print_status "Stopping all containers..."
    docker compose down
    print_success "All containers stopped"
}

stop_volumes() {
    print_status "Stopping all containers and removing volumes..."
    docker compose down -v
    print_success "All containers stopped and volumes removed"
}

# Cleanup commands
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    print_success "Docker cleanup completed"
}

cleanup_all() {
    print_status "Cleaning up all Docker resources (including images)..."
    docker system prune -a -f
    print_success "All Docker resources cleaned up"
}

# Logs commands
logs() {
    print_status "Showing logs for all services..."
    docker compose logs -f
}

logs_dev() {
    print_status "Showing logs for development service..."
    docker compose --profile dev logs -f
}

logs_prod() {
    print_status "Showing logs for production service..."
}

# Shell access
shell_dev() {
    print_status "Opening shell in development container..."
    docker compose --profile dev exec app-dev sh
}

shell_prod() {
    print_status "Opening shell in production container..."
}

# Help function
show_help() {
    echo "Docker Scripts for Queue Application"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Development Commands:"
    echo "  dev              Start development environment"
    echo "  dev-detached     Start development environment in detached mode"
    echo "  build-dev        Build development image"
    echo ""
    echo "Production Commands:"
    echo "  prod             Start production environment"
    echo "  prod-detached    Start production environment in detached mode"
    echo "  build-prod       Build production image"
    echo ""
    echo "Management Commands:"
    echo "  stop             Stop all containers"
    echo "  stop-volumes     Stop all containers and remove volumes"
    echo "  cleanup          Clean up Docker resources"
    echo "  cleanup-all      Clean up all Docker resources (including images)"
    echo ""
    echo "Logs Commands:"
    echo "  logs             Show logs for all services"
    echo "  logs-dev         Show logs for development service"
    echo "  logs-prod        Show logs for production service"
    echo ""
    echo "Shell Access:"
    echo "  shell-dev        Open shell in development container"
    echo "  shell-prod       Open shell in production container"
    echo ""
    echo "Examples:"
    echo "  $0 dev           # Start development environment"
    echo "  $0 build-prod    # Build production image"
    echo "  $0 stop          # Stop all containers"
}

# Main script logic
case "${1:-}" in
    "dev")
        dev
        ;;
    "dev-detached")
        dev_detached
        ;;
    "prod")
        prod
        ;;
    "prod-detached")
        prod_detached
        ;;
    "build-dev")
        build_dev
        ;;
    "build-prod")
        build_prod
        ;;
    "stop")
        stop
        ;;
    "stop-volumes")
        stop_volumes
        ;;
    "cleanup")
        cleanup
        ;;
    "cleanup-all")
        cleanup_all
        ;;
    "logs")
        logs
        ;;
    "logs-dev")
        logs_dev
        ;;
    "logs-prod")
        logs_prod
        ;;
    "shell-dev")
        shell_dev
        ;;
    "shell-prod")
        shell_prod
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 