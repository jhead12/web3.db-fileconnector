#!/usr/bin/env node

/**
 * Sync Versions Script
 * 
 * This script synchronizes the version from package.json across various project files
 * to ensure consistency after version bumps. It's called by the postversion hook.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read the current version from package.json
function getCurrentVersion() {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    process.exit(1);
  }
}

// Update version in files
function updateVersionInFiles(version) {
  const filesToUpdate = [
    // Update client package.json if it exists
    {
      path: path.join(projectRoot, 'client', 'package.json'),
      updateFunction: updatePackageJsonVersion
    },
    // Update README.md version badge if it exists
    {
      path: path.join(projectRoot, 'README.md'),
      updateFunction: updateReadmeVersion
    },
    // Update Docker Compose version if it exists
    {
      path: path.join(projectRoot, 'docker-compose.yml'),
      updateFunction: updateDockerComposeVersion
    }
  ];

  let updatedFiles = 0;

  filesToUpdate.forEach(({ path: filePath, updateFunction }) => {
    if (fs.existsSync(filePath)) {
      try {
        if (updateFunction(filePath, version)) {
          console.log(`✓ Updated version in ${path.relative(projectRoot, filePath)}`);
          updatedFiles++;
        }
      } catch (error) {
        console.warn(`⚠ Warning: Could not update ${path.relative(projectRoot, filePath)}: ${error.message}`);
      }
    }
  });

  return updatedFiles;
}

// Update version in package.json files
function updatePackageJsonVersion(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf8');
  const packageJson = JSON.parse(content);
  
  if (packageJson.version !== version) {
    packageJson.version = version;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    return true;
  }
  return false;
}

// Update version in README.md
function updateReadmeVersion(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Update version badges (common patterns)
  const patterns = [
    /(\[!\[npm version\]\([^\)]*\)\]\([^\)]*\))/g,
    /(\[!\[version\]\([^\)]*badge\/version-)[^-)]*(-[^\)]*\))/g,
    /(version-)[0-9]+\.[0-9]+\.[0-9]+(-)/g
  ];
  
  let updatedContent = content;
  let hasChanges = false;
  
  patterns.forEach(pattern => {
    const newContent = updatedContent.replace(pattern, (match, p1, p2, p3) => {
      if (p2 && p3) {
        hasChanges = true;
        return `${p1}${version}${p3}`;
      } else if (p1 && p3) {
        hasChanges = true;
        return `${p1}${version}${p3}`;
      }
      return match;
    });
    updatedContent = newContent;
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent);
    return true;
  }
  return false;
}

// Update version in docker-compose.yml
function updateDockerComposeVersion(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Update image tags that might reference the version
  const versionPattern = /(\s+image:\s+[^:\s]+:)([0-9]+\.[0-9]+\.[0-9]+)/g;
  const updatedContent = content.replace(versionPattern, `$1${version}`);
  
  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    return true;
  }
  return false;
}

// Main execution
function main() {
  console.log('🔄 Synchronizing versions across project files...');
  
  const currentVersion = getCurrentVersion();
  console.log(`📦 Current version: ${currentVersion}`);
  
  const updatedFiles = updateVersionInFiles(currentVersion);
  
  if (updatedFiles > 0) {
    console.log(`✅ Successfully synchronized version ${currentVersion} across ${updatedFiles} file(s)`);
  } else {
    console.log('ℹ️  No files needed version updates');
  }
  
  console.log('🎉 Version synchronization complete!');
}

// Run the script
main();
