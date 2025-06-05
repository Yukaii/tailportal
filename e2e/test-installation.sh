#!/bin/bash

# E2E test for tailportal package installation and basic functionality

set -e

echo "🚀 Starting E2E tests for tailportal package"

# Store the original working directory to find project root
ORIGINAL_DIR="$(pwd)"

# Detect the project root directory
if [ -d "/home/runner/work/tailportal/tailportal" ]; then
    # GitHub Actions environment
    PROJECT_ROOT="/home/runner/work/tailportal/tailportal"
else
    # Local development environment - find project root
    # Start from the original directory and walk up to find workspace file
    cd "$ORIGINAL_DIR"
    if [ -f "pnpm-workspace.yaml" ]; then
        PROJECT_ROOT="$(pwd)"
    elif [ -f "../pnpm-workspace.yaml" ]; then
        PROJECT_ROOT="$(cd .. && pwd)"
    elif [ -f "../../pnpm-workspace.yaml" ]; then
        PROJECT_ROOT="$(cd ../.. && pwd)"
    elif [ -f "../../../pnpm-workspace.yaml" ]; then
        PROJECT_ROOT="$(cd ../../.. && pwd)"
    else
        echo "❌ Could not find project root (pnpm-workspace.yaml not found)"
        exit 1
    fi
fi

# Create a temporary directory for testing
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

echo "📁 Test directory: $TEST_DIR"

# Initialize a new npm project
echo "📦 Creating test npm project..."
npm init -y

echo "📦 Project root: $PROJECT_ROOT"

# Build and pack the tailportal package
echo "📦 Building tailportal package..."
cd "$PROJECT_ROOT/packages/tailportal"
pnpm build

echo "📦 Packing tailportal package..."
pnpm pack
PACKAGE_FILE=$(ls -t tailportal-*.tgz | head -1)
echo "📦 Package file: $PACKAGE_FILE"

# Move the package to test directory
mv "$PACKAGE_FILE" "$TEST_DIR/"

# Install the package locally
cd "$TEST_DIR"
echo "🔧 Installing tailportal from local package..."
npm install "./$PACKAGE_FILE"

# Test that the CLI binary exists and is executable
echo "🧪 Testing CLI binary existence..."
if [ ! -f "node_modules/.bin/tailportal" ]; then
    echo "❌ CLI binary not found!"
    exit 1
fi

# Test basic CLI functionality - should fail without environment variables
echo "🧪 Testing environment variable validation..."
if node_modules/.bin/tailportal create vultr ams 2>&1 | grep -q "TS_AUTH_KEY.*required"; then
    echo "✅ CLI properly validates environment variables"
else
    echo "❌ CLI should require environment variables"
    exit 1
fi

# Test CLI with environment variables
echo "🧪 Testing CLI with environment variables..."
if TS_AUTH_KEY=test PULUMI_CONFIG_PASSPHRASE=test node_modules/.bin/tailportal --help 2>&1 | grep -q "Usage: tailportal"; then
    echo "✅ CLI works with environment variables"
else
    echo "❌ CLI should work with environment variables"
    exit 1
fi

# Test global installation simulation
echo "🧪 Testing global installation simulation..."
mkdir -p "$TEST_DIR/global/bin"
cp "node_modules/tailportal/dist/index.js" "$TEST_DIR/global/bin/tailportal"
chmod +x "$TEST_DIR/global/bin/tailportal"

# Test that the binary can be executed (will fail on env vars but that's expected)
if "$TEST_DIR/global/bin/tailportal" create vultr ams 2>&1 | grep -q "TS_AUTH_KEY.*required"; then
    echo "✅ Global installation test passed - CLI properly validates environment"
else
    echo "❌ Global installation test failed"
    exit 1
fi

echo "🎉 All E2E tests passed!"

# Cleanup
rm -rf "$TEST_DIR"
echo "🧹 Cleaned up test directory"
