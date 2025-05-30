#!/bin/bash

# Create bin directory if it doesn't exist
mkdir -p .bin

# Create symlinks for local binaries
echo "Creating symlinks for local binaries..."
ln -sf ../node_modules/.bin/eslint .bin/eslint
ln -sf ../node_modules/.bin/next .bin/next
ln -sf ../node_modules/.bin/prettier .bin/prettier
ln -sf ../node_modules/.bin/conventional-changelog .bin/conventional-changelog
ln -sf ../node_modules/.bin/nodemon .bin/nodemon

echo "Making scripts executable..."
chmod -R +x .bin
chmod +x scripts/*.sh
chmod +x *.sh

echo "Local development environment configured successfully"
