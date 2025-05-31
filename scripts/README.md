# Security and Release Automation Scripts

This directory contains scripts for automating security patching and release processes for the web3db-connector project.

## Available Scripts

### 1. `auto-security-patch.sh`

Automatically detects and fixes security vulnerabilities in both direct and transitive dependencies.

**Features:**

- Upgrades direct dependencies to secure versions
- Adds resolutions in package.json for transitive dependencies
- Updates SECURITY-AUDIT.md with current vulnerability status
- Updates CHANGELOG.md with security notes

**Usage:**

```bash
# Run directly
./scripts/auto-security-patch.sh

# Or use the npm script
yarn security:patch
```

### 2. `auto-release.sh`

Automates the entire release process, including security fixes, version bumping, and changelog generation.

**Features:**

- Optional security patching (can be skipped if already done)
- Proper version calculation and updating
- Automatic changelog generation with correct version
- Git tagging and pushing changes
- Support for major, minor, or patch releases

**Usage:**

```bash
# Major version release (v2.0.0)
./scripts/auto-release.sh --major

# Minor version release
./scripts/auto-release.sh --minor

# Patch version release (default)
./scripts/auto-release.sh --patch

# Skip security patching if already done
./scripts/auto-release.sh --patch --skip-security

# Or use the npm script (defaults to patch)
yarn auto:release
```

### 3. `fix-dependencies-deep.sh`

This script is used by the auto-security-patch.sh script to fix both direct and transitive dependencies.

**Features:**

- Installs specific versions of vulnerable dependencies
- Adds resolutions to package.json files

## Workflow for a Secure Release

For the most secure release process, follow these steps:

1. Run security patching:

   ```bash
   yarn security:patch
   ```

2. Review the SECURITY-AUDIT.md file to understand remaining vulnerabilities

3. Run automated release with appropriate version bump:

   ```bash
   # For a major version release:
   yarn auto:release --major --skip-security
   ```

4. Publish the release if needed:
   ```bash
   yarn publish --access public
   ```

## Common Issues

### 1. Transitive Dependencies

Some vulnerabilities in transitive dependencies cannot be fully resolved because they depend on upstream packages being updated. The resolutions in package.json help mitigate this by forcing specific versions where possible.

### 2. Version Flag Error

If you encounter an error with the conventional-changelog command about missing version flag, the auto-release.sh script resolves this by calculating the next version number and passing it to the command.

### 3. Linting Warnings

The codebase currently has 159 linting warnings. These do not affect functionality but should be addressed in future releases for code quality.
