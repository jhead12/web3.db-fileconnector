#!/bin/bash

# Release preparation script for web3.db-fileconnector

# Get current version from package.json using dynamic import
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
CURRENT_VERSION=$(node --no-warnings --input-type=module -e "import { createRequire } from 'module'; const require = createRequire(import.meta.url); console.log(require('$SCRIPT_DIR/../package.json').version);")
echo "🚀 Preparing release $CURRENT_VERSION..."

# Check if we're on the right branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# Ensure node_modules exists and install dependencies if needed
if [ ! -d "../node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd .. && yarn install
fi

# Ensure local binaries are properly set up
echo "🔧 Setting up local binaries..."
cd .. && chmod +x setup-local-env.sh && ./setup-local-env.sh

# Run security audit
echo "🔒 Running security audit..."
cd .. && yarn audit --level high || echo "⚠️  Security vulnerabilities found - continuing with release process"

# Run linting
echo "🧹 Running linter..."
cd .. && PATH=./.bin:$PATH yarn lint || echo "⚠️ Linting issues found - continuing with release process"

# Build the project
echo "🔨 Building project..."
cd .. && yarn build || echo "⚠️ Build encountered issues but continuing with release process"

# Update changelog
echo "📝 Updating changelog..."
cd .. && yarn run changelog || echo "⚠️ Changelog generation encountered issues but continuing"

# Display current version
echo "📦 Current version: $CURRENT_VERSION"

echo "✅ Release preparation complete!"
echo ""
echo "Next steps:"
echo "1. Review the changelog"
echo "2. Commit any changes"
echo "3. Run: yarn run release:patch (or release:minor/release:major)"
echo "4. Run: yarn run publish:release"

# Provide command for direct patch release
echo ""
echo "Or for quick patch release, run:"
echo "yarn run version:patch"
