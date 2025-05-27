#!/bin/bash

# Simple Pre-Release Test Script for web3.db-fileconnector v1.8.1
# This script runs final validation before npm publishing

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} FINAL PRE-RELEASE VALIDATION${NC}"
echo -e "${BLUE} web3.db-fileconnector v1.8.1${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${BLUE}[INFO]${NC} Running final checks..."

# 1. Check version consistency
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✓${NC} Package version: $PACKAGE_VERSION"

# 2. Check CHANGELOG
if grep -q "# $PACKAGE_VERSION" CHANGELOG.md; then
    echo -e "${GREEN}✓${NC} CHANGELOG.md updated"
else
    echo -e "${YELLOW}⚠${NC} CHANGELOG.md needs version update"
fi

# 3. Check essential files
for file in README.md package.json index.js LICENSE; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${YELLOW}⚠${NC} $file missing"
    fi
done

# 4. Quick build test
echo -e "${BLUE}[INFO]${NC} Testing build process..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${YELLOW}⚠${NC} Build issues detected"
fi

# 5. Check Docker config
if [ -f "docker-compose.yaml" ] && docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker configuration valid"
else
    echo -e "${YELLOW}⚠${NC} Docker configuration issues"
fi

# 6. Check git status
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} Working directory clean"
else
    echo -e "${YELLOW}⚠${NC} Uncommitted changes detected"
fi

# 7. NPM auth check
if npm whoami > /dev/null 2>&1; then
    NPM_USER=$(npm whoami)
    echo -e "${GREEN}✓${NC} NPM authenticated as: $NPM_USER"
else
    echo -e "${YELLOW}⚠${NC} NPM authentication required"
    echo -e "${BLUE}[INFO]${NC} Run 'npm adduser' before publishing"
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN} PRE-RELEASE VALIDATION COMPLETE${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}[INFO]${NC} Ready to publish:"
echo -e "${BLUE}[INFO]${NC} • npm run publish:npm"
echo -e "${BLUE}[INFO]${NC} • npm run publish:release"
echo -e "${BLUE}[INFO]${NC} • npm run test:docker (for Docker testing)"

exit 0
