#!/bin/bash

# Enhanced script to fix dependency issues including transitive dependencies
echo "🔧 Running enhanced dependency fix script..."

# Change to the root directory
cd "$(dirname "$0")/.." || exit

# Install exact versions of vulnerable packages (direct dependencies)
echo "📦 Installing patched versions of vulnerable packages..."
yarn add ws@8.17.1 axios@0.30.0 nanoid@5.0.9 @babel/runtime@7.26.10 parse-duration@2.1.3 secp256k1@5.0.1 --save-exact

# Ensure client dependencies match
echo "🔄 Updating client dependencies..."
cd client
yarn add ws@8.17.1 axios@0.30.0 nanoid@5.0.9 @babel/runtime@7.26.10 --save-exact
cd ..

# Create resolution section in package.json to force specific versions of problematic transitive deps
echo "📝 Adding resolutions to package.json to fix transitive dependencies..."

# Check if resolutions already exists in package.json
if grep -q '"resolutions":' package.json; then
  # If resolutions exists, check if our specific resolutions exist and add them if not
  for pkg in "ws:8.17.1" "secp256k1:5.0.1" "parse-duration:2.1.3" "axios:0.30.0" "nanoid:5.0.9" "@babel/runtime:7.26.10"
  do
    PKG_NAME=$(echo $pkg | cut -d':' -f1)
    PKG_VERSION=$(echo $pkg | cut -d':' -f2)
    
    if ! grep -q "\"$PKG_NAME\": \"$PKG_VERSION\"" package.json; then
      # Use sed to add the resolution before the closing brace of resolutions
      sed -i "/\"resolutions\":/,/}/ s/}$/  \"$PKG_NAME\": \"$PKG_VERSION\",\n}/" package.json
    fi
  done
  
  # Fix trailing commas in resolutions object
  sed -i '/\"resolutions\":/,/}/{s/,\n}/\n}/}' package.json
else
  # If resolutions doesn't exist, add it at the end before the closing brace
  sed -i '/{/,/}/ s/}$/,\n  "resolutions": {\n    "ws": "8.17.1",\n    "secp256k1": "5.0.1",\n    "parse-duration": "2.1.3",\n    "axios": "0.30.0",\n    "nanoid": "5.0.9",\n    "@babel\/runtime": "7.26.10"\n  }\n}/' package.json
fi

# Same for client package.json
cd client
if grep -q '"resolutions":' package.json; then
  # If resolutions exists, check if our specific resolutions exist and add them if not
  for pkg in "ws:8.17.1" "secp256k1:5.0.1" "parse-duration:2.1.3" "axios:0.30.0" "nanoid:5.0.9" "@babel/runtime:7.26.10"
  do
    PKG_NAME=$(echo $pkg | cut -d':' -f1)
    PKG_VERSION=$(echo $pkg | cut -d':' -f2)
    
    if ! grep -q "\"$PKG_NAME\": \"$PKG_VERSION\"" package.json; then
      # Use sed to add the resolution before the closing brace of resolutions
      sed -i "/\"resolutions\":/,/}/ s/}$/  \"$PKG_NAME\": \"$PKG_VERSION\",\n}/" package.json
    fi
  done
  
  # Fix trailing commas in resolutions object
  sed -i '/\"resolutions\":/,/}/{s/,\n}/\n}/}' package.json
else
  # If resolutions doesn't exist, add it at the end before the closing brace
  sed -i '/{/,/}/ s/}$/,\n  "resolutions": {\n    "ws": "8.17.1",\n    "secp256k1": "5.0.1",\n    "parse-duration": "2.1.3",\n    "axios": "0.30.0",\n    "nanoid": "5.0.9",\n    "@babel\/runtime": "7.26.10"\n  }\n}/' package.json
fi
cd ..

# Install project dependencies
echo "📚 Installing all dependencies with forced resolutions..."
yarn install --check-files

# Set up local environment
echo "🛠️ Setting up local environment..."
chmod +x setup-local-env.sh && ./setup-local-env.sh

echo "✅ Enhanced dependency fixes complete!"
echo "⚠️ Note: Some transitive dependencies may still show vulnerabilities due to deep nesting. Please review the security audit."
