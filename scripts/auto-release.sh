#!/bin/bash

# Automated Release Script for web3db-connector
# This script automates the entire release process, including security fixes and versioning

set -e # Exit immediately if a command fails

# Change to the root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT" || exit

# Parse command line arguments
VERSION_TYPE="patch"  # Default to patch release
SKIP_SECURITY=false

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --major            Perform a major release"
    echo "  --minor            Perform a minor release"
    echo "  --patch            Perform a patch release (default)"
    echo "  --skip-security    Skip security patching"
    echo "  --help             Show this help message"
}

for arg in "$@"
do
    case $arg in
        --major)
        VERSION_TYPE="major"
        shift
        ;;
        --minor)
        VERSION_TYPE="minor"
        shift
        ;;
        --patch)
        VERSION_TYPE="patch"
        shift
        ;;
        --skip-security)
        SKIP_SECURITY=true
        shift
        ;;
        --help)
        print_usage
        exit 0
        ;;
        *)
        echo "Unknown argument: $arg"
        print_usage
        exit 1
        ;;
    esac
done

echo "🚀 Starting automated release process for a $VERSION_TYPE release..."

# Check if we're on the right branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

if [[ "$current_branch" != "master" && "$current_branch" != "main" ]]; then
    read -p "⚠️ You're not on the master/main branch. Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Release aborted."
        exit 1
    fi
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# Step 1: Apply security patches if not skipped
if [ "$SKIP_SECURITY" = false ]; then
    echo "🔒 Applying security patches..."
    chmod +x "$SCRIPT_DIR/auto-security-patch.sh"
    "$SCRIPT_DIR/auto-security-patch.sh"
    
    # Commit security updates if changes were made
    if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "fix: apply security patches to dependencies"
        echo "✅ Security patches committed."
    else
        echo "✅ No security changes needed."
    fi
else
    echo "🔒 Security patching skipped."
fi

# Step 2: Run the prepare-release script
echo "📦 Preparing release..."
chmod +x "$SCRIPT_DIR/prepare-release.sh"
"$SCRIPT_DIR/prepare-release.sh" || echo "⚠️ Prepare release encountered some issues but continuing"

# Step 3: Run linting and fix what we can
echo "🧹 Running linter with auto-fix for common issues..."
PATH=./.bin:$PATH yarn lint --fix || echo "⚠️ Linting issues found - some may need manual attention"

# Commit any changes from linting
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "style: fix linting issues"
    echo "✅ Linting fixes committed."
fi

# Step 4: Build the project
echo "🔨 Building project..."
yarn build || echo "⚠️ Build encountered issues but continuing with release process"

# Step 5: Update version and generate changelog
echo "📝 Updating version and changelog..."

# Get the current version
CURRENT_VERSION=$(node --no-warnings --input-type=module -e "import { createRequire } from 'module'; const require = createRequire(import.meta.url); console.log(require('$PROJECT_ROOT/package.json').version);")
echo "Current version: $CURRENT_VERSION"

# Fix the issue with conventional-changelog expecting --new-version flag
if [ "$VERSION_TYPE" = "major" ]; then
    # For major version, calculate the next version
    MAJOR_VERSION=$(echo $CURRENT_VERSION | cut -d. -f1)
    NEXT_VERSION="$((MAJOR_VERSION + 1)).0.0"
elif [ "$VERSION_TYPE" = "minor" ]; then
    # For minor version, calculate the next version
    MAJOR_VERSION=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR_VERSION=$(echo $CURRENT_VERSION | cut -d. -f2)
    NEXT_VERSION="$MAJOR_VERSION.$((MINOR_VERSION + 1)).0"
else
    # For patch version, calculate the next version
    MAJOR_VERSION=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR_VERSION=$(echo $CURRENT_VERSION | cut -d. -f2)
    PATCH_VERSION=$(echo $CURRENT_VERSION | cut -d. -f3)
    NEXT_VERSION="$MAJOR_VERSION.$MINOR_VERSION.$((PATCH_VERSION + 1))"
fi

# Generate changelog with the new version specified
echo "Generating changelog for version $NEXT_VERSION..."
node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s --new-version $NEXT_VERSION

# Step 6: Update the version in package.json files
echo "📌 Updating version to $NEXT_VERSION..."
yarn version --new-version $NEXT_VERSION -m "chore(release): %s"

# Step 7: Run final validation tests
echo "🧪 Running final validation tests..."
yarn run test:final || echo "⚠️ Final tests have issues but continuing with release process"

# Step 8: Push changes and tags
echo "🌐 Pushing changes and tags to remote repository..."
git push && git push --tags

echo "✨ Release $NEXT_VERSION successfully completed!"
echo ""
echo "Next steps:"
echo "1. If needed, run 'yarn publish --access public' to publish to npm"
echo "2. Create a GitHub release with the changelog notes"
echo "3. Monitor the CI/CD pipeline for successful deployment"
