#!/bin/bash

# Script to fix common dependency issues before release
echo "🔧 Running dependency fix script..."

# Change to the root directory
cd "$(dirname "$0")/.." || exit

# Install exact versions of vulnerable packages
echo "📦 Installing patched versions of vulnerable packages..."
yarn add ws@8.17.1 axios@0.30.0 nanoid@5.0.9 @babel/runtime@7.26.10 parse-duration@2.1.3 secp256k1@4.0.4 --save-exact

# Ensure client dependencies match
echo "🔄 Updating client dependencies..."
cd client
yarn add ws@8.17.1 axios@0.30.0 nanoid@5.0.9 @babel/runtime@7.26.10 --save-exact
cd ..

# Install project dependencies
echo "📚 Installing all dependencies..."
yarn install

# Set up local environment
echo "🛠️ Setting up local environment..."
chmod +x setup-local-env.sh && ./setup-local-env.sh

echo "✅ Dependency fixes complete!"
