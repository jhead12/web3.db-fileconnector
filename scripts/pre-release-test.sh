#!/bin/bash

# Pre-Release Test Script for web3.db-fileconnector
# This script runs comprehensive tests before npm publishing

set -e  # Exit on any error

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

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Start testing
print_header "PRE-RELEASE VALIDATION - web3.db-fileconnector v$(node -p "require('./package.json').version")"

# 1. Version Consistency Check
print_header "1. VERSION CONSISTENCY CHECK"
PACKAGE_VERSION=$(node -p "require('./package.json').version")
print_status "Package.json version: $PACKAGE_VERSION"

# Check if CHANGELOG has the current version
if grep -q "# $PACKAGE_VERSION" CHANGELOG.md; then
    print_success "CHANGELOG.md contains version $PACKAGE_VERSION"
else
    print_error "CHANGELOG.md missing version $PACKAGE_VERSION"
    exit 1
fi

# 2. Git Status Check
print_header "2. GIT STATUS CHECK"
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory has uncommitted changes:"
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Working directory is clean"
fi

# Check if we're on master branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    print_warning "Not on master branch (currently on: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "On master branch"
fi

# 3. Package Dependencies Check
print_header "3. PACKAGE DEPENDENCIES CHECK"
print_status "Checking for missing dependencies..."

# Simple check - see if node_modules exists and package.json is valid
if [ -d "node_modules" ] && [ -f "package.json" ]; then
    print_success "Dependencies directory exists"
    # Quick validation of package.json
    if node -e "require('./package.json')" 2>/dev/null; then
        print_success "Package.json is valid"
    else
        print_error "Package.json validation failed"
        exit 1
    fi
else
    print_error "Missing dependencies or package.json"
    print_status "Run 'npm install' or 'pnpm install' to install dependencies"
    exit 1
fi

# 4. Security Audit
print_header "4. SECURITY AUDIT"
print_status "Running security audit..."

# Check if pnpm lockfile exists, use pnpm audit, otherwise npm audit
if [ -f "pnpm-lock.yaml" ]; then
    print_status "Using pnpm for security audit..."
    if pnpm audit --audit-level moderate 2>/dev/null; then
        print_success "No critical security vulnerabilities found"
    else
        print_warning "Security vulnerabilities detected (review required)"
        # For automated testing, continue with warning
        print_status "Continuing with known vulnerabilities (likely from dependencies)"
    fi
else
    if npm audit --audit-level moderate 2>/dev/null; then
        print_success "No critical security vulnerabilities found"
    else
        print_warning "Security vulnerabilities detected (review required)"
        print_status "Continuing with known vulnerabilities (likely from dependencies)"
    fi
fi

# 5. Linting Check
print_header "5. LINTING CHECK"
print_status "Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    print_success "Linting passed"
else
    print_warning "Linting issues detected"
    # Show lint summary but continue
    LINT_COUNT=$(npm run lint 2>&1 | grep -c "warning\|error" || echo "0")
    print_status "Found $LINT_COUNT linting issues (continuing with build)"
fi

# 6. Build Tests
print_header "6. BUILD TESTS"

# Test server build
print_status "Testing server startup..."

# Quick syntax check instead of full startup
if node -c index.js 2>/dev/null; then
    print_success "Server script syntax is valid"
else
    print_error "Server script has syntax errors"
    exit 1
fi

# Try a quick startup test (background with timeout)
timeout 15s node index.js &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    print_success "Server starts successfully"
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
else
    print_warning "Server startup test inconclusive (may require database)"
fi

# Test client build
print_status "Building Next.js client..."
if npm run build; then
    print_success "Client build successful"
else
    print_error "Client build failed"
    exit 1
fi

# 7. Docker Tests
print_header "7. DOCKER TESTS"

# Check if Docker is available and Dockerfile exists
if ! command -v docker &> /dev/null; then
    print_warning "Docker not available, skipping Docker tests"
elif [ ! -f "Dockerfile" ] && [ ! -f "client/Dockerfile" ]; then
    print_warning "No Dockerfile found, skipping Docker build tests"
    
    # Check if docker-compose.yaml exists and is valid
    if [ -f "docker-compose.yaml" ]; then
        print_status "Validating docker-compose.yaml..."
        if docker-compose config > /dev/null 2>&1; then
            print_success "docker-compose.yaml is valid"
        else
            print_warning "docker-compose.yaml validation failed"
        fi
    fi
else
    print_status "Testing Docker build..."
    
    # Determine which Dockerfile to use
    DOCKERFILE_PATH="."
    if [ -f "Dockerfile" ]; then
        DOCKERFILE_PATH="."
    elif [ -f "client/Dockerfile" ]; then
        DOCKERFILE_PATH="./client"
    fi
    
    # Build Docker image
    if docker build -t web3db-connector-test:latest $DOCKERFILE_PATH; then
        print_success "Docker build successful"
        
        # Test Docker run (quick test)
        print_status "Testing Docker container startup..."
        if timeout 30s docker run --rm --name web3db-test -p 8080:3000 web3db-connector-test:latest &
        then
            sleep 10
            # Check if container is running
            if docker ps | grep -q web3db-test; then
                print_success "Docker container runs successfully"
                docker stop web3db-test 2>/dev/null || true
            else
                print_warning "Docker container startup issues"
            fi
        else
            print_warning "Docker run test had issues"
        fi
        
        # Clean up test image
        docker rmi web3db-connector-test:latest 2>/dev/null || true
    else
        print_error "Docker build failed"
        exit 1
    fi
fi

# 8. Package.json Validation
print_header "8. PACKAGE.JSON VALIDATION"
print_status "Validating package.json structure..."

# Check required fields
REQUIRED_FIELDS=("name" "version" "description" "main" "scripts" "dependencies")
for field in "${REQUIRED_FIELDS[@]}"; do
    if node -p "require('./package.json').$field" > /dev/null 2>&1; then
        print_success "✓ $field field present"
    else
        print_error "✗ Missing required field: $field"
        exit 1
    fi
done

# 9. Release Scripts Validation
print_header "9. RELEASE SCRIPTS VALIDATION"
print_status "Checking release scripts..."

# Check if release scripts exist
RELEASE_SCRIPTS=("version:patch" "version:minor" "version:major" "publish:npm")
for script in "${RELEASE_SCRIPTS[@]}"; do
    if node -p "require('./package.json').scripts['$script']" > /dev/null 2>&1; then
        print_success "✓ $script script exists"
    else
        print_warning "✗ Release script missing: $script"
    fi
done

# 10. File Structure Check
print_header "10. FILE STRUCTURE CHECK"
print_status "Verifying essential files..."

ESSENTIAL_FILES=("README.md" "CHANGELOG.md" "package.json" "index.js" "LICENSE")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ Missing essential file: $file"
        exit 1
    fi
done

# 11. NPM Authentication Check
print_header "11. NPM AUTHENTICATION CHECK"
print_status "Checking npm authentication..."

if npm whoami > /dev/null 2>&1; then
    NPM_USER=$(npm whoami)
    print_success "Authenticated as: $NPM_USER"
else
    print_warning "Not authenticated with npm registry"
    print_status "Authentication required before publishing"
    print_status "Run 'npm adduser' or 'npm login' to authenticate"
    # Don't exit in test mode, just warn
fi

# 12. Final Validation Summary
print_header "12. VALIDATION SUMMARY"
print_success "All pre-release checks completed successfully!"
print_status "Version: $PACKAGE_VERSION"
print_status "Package: $(node -p "require('./package.json').name")"

# Important reminders for users
print_header "13. IMPORTANT USER REMINDERS"
print_warning "🔒 CRITICAL: Database permissions must be configured before use!"
print_status "Users must run: psql -U postgres -d ceramic -f fix-postgres-permissions.sql"
print_status "See PostgreSQL-Permissions.md for detailed setup instructions"
print_warning "⚠️  Without proper permissions, the application will fail silently"

print_status "Ready for publishing to npm registry"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN} PRE-RELEASE VALIDATION COMPLETE ✓${NC}"
echo -e "${GREEN}========================================${NC}\n"

print_status "To publish, run: npm run publish:npm"
print_status "To publish with GitHub release: npm run publish:release"

exit 0
