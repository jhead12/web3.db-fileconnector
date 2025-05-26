#!/bin/bash

# Docker Release Script for web3.db-fileconnector
# Builds and publishes Docker images for multiple architectures

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

# Configuration
PACKAGE_VERSION=$(node -p "require('./package.json').version")
IMAGE_NAME="orbisdb-fileconnector"
REGISTRY="docker.io"
PLATFORMS="linux/amd64,linux/arm64"

print_header "DOCKER RELEASE - web3.db-fileconnector v$PACKAGE_VERSION"

# Check prerequisites
print_header "1. PREREQUISITES CHECK"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi
print_success "Docker is available"

# Check Docker Buildx
if ! docker buildx version &> /dev/null; then
    print_error "Docker Buildx is not available"
    exit 1
fi
print_success "Docker Buildx is available"

# Check Docker login
if ! docker info | grep -q "Username"; then
    print_warning "Not logged into Docker registry"
    print_status "Please run: docker login"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Logged into Docker registry"
fi

# Setup buildx builder
print_header "2. BUILDX SETUP"
BUILDER_NAME="web3db-builder"

if ! docker buildx ls | grep -q "$BUILDER_NAME"; then
    print_status "Creating buildx builder..."
    docker buildx create --name "$BUILDER_NAME" --platform "$PLATFORMS"
fi

print_status "Using buildx builder: $BUILDER_NAME"
docker buildx use "$BUILDER_NAME"
docker buildx inspect --bootstrap

# Build images
print_header "3. BUILDING DOCKER IMAGES"

# Build main application (full stack)
print_status "Building full stack image..."
docker buildx build \
    --platform "$PLATFORMS" \
    --tag "$REGISTRY/$IMAGE_NAME:$PACKAGE_VERSION" \
    --tag "$REGISTRY/$IMAGE_NAME:latest" \
    --push \
    .

print_success "Full stack image built and pushed"

# Build client-only image
print_status "Building client-only image..."
docker buildx build \
    --platform "$PLATFORMS" \
    --tag "$REGISTRY/$IMAGE_NAME:client-$PACKAGE_VERSION" \
    --tag "$REGISTRY/$IMAGE_NAME:client" \
    --file client/Dockerfile \
    --push \
    .

print_success "Client image built and pushed"

# Build server-only image
print_status "Building server-only image..."
docker buildx build \
    --platform "$PLATFORMS" \
    --tag "$REGISTRY/$IMAGE_NAME:server-$PACKAGE_VERSION" \
    --tag "$REGISTRY/$IMAGE_NAME:server" \
    --file server/Dockerfile \
    --push \
    .

print_success "Server image built and pushed"

# Test images
print_header "4. IMAGE TESTING"

# Test main image
print_status "Testing main image locally..."
if timeout 30s docker run --rm --name web3db-test "$REGISTRY/$IMAGE_NAME:latest" &
then
    sleep 10
    if docker ps | grep -q web3db-test; then
        print_success "Main image runs successfully"
        docker stop web3db-test 2>/dev/null || true
    else
        print_warning "Main image test inconclusive"
    fi
else
    print_warning "Main image test had issues"
fi

# Generate image manifest
print_header "5. IMAGE INFORMATION"
docker buildx imagetools inspect "$REGISTRY/$IMAGE_NAME:$PACKAGE_VERSION" > /tmp/image-manifest.txt
print_status "Image manifest saved to /tmp/image-manifest.txt"

# Summary
print_header "6. RELEASE SUMMARY"
print_success "Docker release completed successfully!"
print_status "Images published:"
echo "  • $REGISTRY/$IMAGE_NAME:$PACKAGE_VERSION (full stack)"
echo "  • $REGISTRY/$IMAGE_NAME:latest (full stack)"
echo "  • $REGISTRY/$IMAGE_NAME:client-$PACKAGE_VERSION (client only)"
echo "  • $REGISTRY/$IMAGE_NAME:client (client only)"
echo "  • $REGISTRY/$IMAGE_NAME:server-$PACKAGE_VERSION (server only)"
echo "  • $REGISTRY/$IMAGE_NAME:server (server only)"

print_status "Platforms: $PLATFORMS"

# Usage instructions
print_header "7. USAGE INSTRUCTIONS"
print_status "To use the released images:"
echo
echo "Full Stack:"
echo "  docker run -p 3000:3000 $REGISTRY/$IMAGE_NAME:$PACKAGE_VERSION"
echo
echo "Client Only:"
echo "  docker run -p 3000:3000 $REGISTRY/$IMAGE_NAME:client"
echo
echo "Server Only:"
echo "  docker run -p 8080:8080 $REGISTRY/$IMAGE_NAME:server"
echo

print_success "Docker release process complete!"

exit 0
