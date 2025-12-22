#!/bin/bash

# Installation script for QuadCast RGB Controller to Applications folder

set -e

APP_NAME="QuadCast RGB.app"
APP_PATH="$(pwd)/build/bin/$APP_NAME"
TARGET_PATH="/Applications/$APP_NAME"
ICON_SCRIPT="$(pwd)/create_icon.sh"

echo "🎨 QuadCast RGB Controller - Installation"
echo "========================================"

# Check for built application
if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: Application not found in build/bin/"
    echo "First build the application: wails build"
    exit 1
fi

echo "📦 Application found: $APP_PATH"

# Generate icon
echo "🎨 Creating application icon..."
if [ -f "$ICON_SCRIPT" ]; then
    TEMP_DIR="/tmp/quadcast_install_icon"
    mkdir -p "$TEMP_DIR"
    "$ICON_SCRIPT" "$TEMP_DIR"

    # Embed icon in application
    if [ -f "$TEMP_DIR/appicon.icns" ]; then
        cp "$TEMP_DIR/appicon.icns" "$APP_PATH/Contents/Resources/iconfile.icns"
        echo "✅ Icon embedded in application"
        rm -rf "$TEMP_DIR"
    fi
else
    echo "⚠️  Icon creation script not found, using default icon"
fi

# Check if application is already installed
if [ -d "$TARGET_PATH" ]; then
    echo "⚠️  Application is already installed in /Applications"
    read -p "Remove old version and install new one? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑  Removing old version..."
        rm -rf "$TARGET_PATH"
    else
        echo "❌ Installation cancelled"
        exit 0
    fi
fi

# Copy application to /Applications
echo "📥 Copying application to /Applications..."
cp -R "$APP_PATH" "$TARGET_PATH"

# Set permissions
chmod -R 755 "$TARGET_PATH"

# Remove quarantine attribute (for applications from the internet)
echo "🔓 Setting up permissions..."
xattr -cr "$TARGET_PATH" 2>/dev/null || true

echo ""
echo "✅ Installation complete!"
echo ""
echo "QuadCast RGB Controller is installed in /Applications"
echo "You can launch it from Launchpad or Finder."
echo ""
echo "💡 On first launch, macOS may ask for permission"
echo "   to access USB devices."
echo ""
