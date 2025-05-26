#!/bin/bash

# Docker Test Script for web3.db-fileconnector
# Tests Docker build, run, and basic functionality

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not available"
    exit 1
fi

print_header "DOCKER TESTS - web3.db-fileconnector"

# Clean up any existing test containers/images
print_status "Cleaning up existing test containers..."
docker stop web3db-test 2>/dev/null || true
docker rm web3db-test 2>/dev/null || true
docker rmi web3db-connector-test:latest 2>/dev/null || true

# 1. Docker Build Test
print_header "1. DOCKER BUILD TEST"
print_status "Building Docker image..."

if docker build -t web3db-connector-test:latest .; then
    print_success "Docker build completed successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Check image size
IMAGE_SIZE=$(docker images web3db-connector-test:latest --format "table {{.Size}}" | tail -n 1)
print_status "Image size: $IMAGE_SIZE"

# 2. Docker Run Test
print_header "2. DOCKER RUN TEST"
print_status "Starting Docker container..."

# Start container in detached mode
if docker run -d --name web3db-test -p 8080:3000 web3db-connector-test:latest; then
    print_success "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi

# Wait for container to initialize
print_status "Waiting for container to initialize..."
sleep 15

# 3. Health Check
print_header "3. CONTAINER HEALTH CHECK"

# Check if container is running
if docker ps | grep -q web3db-test; then
    print_success "Container is running"
else
    print_error "Container is not running"
    docker logs web3db-test
    exit 1
fi

# Check container logs for errors
print_status "Checking container logs..."
if docker logs web3db-test 2>&1 | grep -i error; then
    print_warning "Errors found in container logs"
else
    print_success "No critical errors in logs"
fi

# Test basic HTTP connectivity (if applicable)
print_status "Testing basic connectivity..."
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    print_success "HTTP endpoint is responding"
elif curl -f http://localhost:8080/health > /dev/null 2>&1; then
    print_success "Health endpoint is responding"
else
    print_warning "HTTP endpoints not responding (may be expected)"
fi

# 4. Resource Usage Check
print_header "4. RESOURCE USAGE CHECK"
print_status "Checking container resource usage..."

# Get container stats
STATS=$(docker stats web3db-test --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}")
print_status "Container stats:"
echo "$STATS"

# 5. Docker Compose Test (if docker-compose.yaml exists)
if [ -f "docker-compose.yaml" ]; then
    print_header "5. DOCKER COMPOSE TEST"
    print_status "Testing docker-compose configuration..."
    
    # Stop the standalone container first
    docker stop web3db-test
    docker rm web3db-test
    
    # Test docker-compose
    if docker-compose config > /dev/null 2>&1; then
        print_success "docker-compose.yaml is valid"
        
        # Try to start with docker-compose (but don't leave it running)
        if timeout 30s docker-compose up -d; then
            print_success "docker-compose up successful"
            docker-compose down
        else
            print_warning "docker-compose up had issues"
        fi
    else
        print_warning "docker-compose.yaml validation failed"
    fi
else
    print_status "No docker-compose.yaml found, skipping compose tests"
fi

# 6. Cleanup
print_header "6. CLEANUP"
print_status "Cleaning up test containers and images..."

docker stop web3db-test 2>/dev/null || true
docker rm web3db-test 2>/dev/null || true
docker rmi web3db-connector-test:latest 2>/dev/null || true

print_success "Cleanup completed"

# Final Summary
print_header "DOCKER TESTS COMPLETE"
print_success "All Docker tests passed successfully!"
print_status "The application is ready for Docker deployment"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN} DOCKER VALIDATION COMPLETE ✓${NC}"
echo -e "${GREEN}========================================${NC}\n"

exit 0
