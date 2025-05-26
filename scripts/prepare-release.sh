#!/bin/bash

# Release preparation script for web3.db-fileconnector v1.0.8

echo "🚀 Preparing release 1.0.8..."

# Check if we're on the right branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# Run security audit
echo "🔒 Running security audit..."
pnpm audit --prod || echo "⚠️  Security vulnerabilities found - please review"

# Run linting
echo "🧹 Running linter..."
npm run lint

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before releasing."
    exit 1
fi

# Update changelog
echo "📝 Updating changelog..."
npm run changelog

# Display current version
echo "📦 Current version: $(node -p "require('./package.json').version")"

echo "✅ Release preparation complete!"
echo ""
echo "Next steps:"
echo "1. Review the changelog"
echo "2. Commit any changes"
echo "3. Run: npm run release:patch (or release:minor/release:major)"
echo "4. Run: npm run publish:release"
