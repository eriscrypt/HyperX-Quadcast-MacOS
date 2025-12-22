# QuadCast RGB Controller 🎨

<div align="center">

**Application for controlling HyperX QuadCast RGB lighting on macOS**

![macOS](https://img.shields.io/badge/macOS-10.13+-blue?logo=apple)
![ARM64](https://img.shields.io/badge/Apple_Silicon-Compatible-green?logo=apple)
![Intel](https://img.shields.io/badge/Intel-Compatible-blue?logo=intel)

</div>

## ✨ Features

- ✅ **Automatic dependency installation** - app will install everything needed
- 💾 **Settings persistence** - your favorite color is remembered
- 🖌️ **Color Picker** - choose any color from the palette
- 🎯 **Presets** - quick selection of popular colors
- 💡 **Turn on/off LED** - with one click
- 🍎 **Native macOS** - works like a real Mac application
- 🎭 **Custom icon** - automatically generated during installation

## 📥 Installation

### Method 1: Download ready-made application (recommended)

1. Download **QuadCast RGB.app** from [Releases](../../releases)
2. Extract the archive
3. Drag **QuadCast RGB** to the **Applications** folder
4. **Important**: Right-click on the app and select **Open** (or go to System Settings → Privacy & Security and click "Open Anyway")
   - This is required because the app is not notarized by Apple
   - You only need to do this once
5. Launch from Launchpad or Finder

### Method 2: Build from source

```bash
# Clone the repository
git clone https://github.com/yourusername/quadcast-ui.git
cd quadcast-ui

# Install dependencies
npm install

# Build the application
wails build

# Install to /Applications (icon is generated automatically)
./install.sh
```

## 🎨 Icon Customization

The application icon is automatically generated during installation from an SVG file.
To change the icon, edit the \`create_icon.sh\` file:

```bash
# Edit the SVG code in create_icon.sh
nano create_icon.sh

# Reinstall the application
./install.sh
```

## 🚀 Quick Start

1. **Download the application** from the [Releases](../../releases) section
2. **Launch the application** - it will automatically check and offer to install necessary dependencies
3. **Connect HyperX QuadCast** to your computer
4. **Click "Connect Device"**
5. **Choose a color** - it will be automatically saved
6. \*_Donebuild_ The color is applied to the microphone

## How It Works

On first launch, the application:

1. Checks for the \`quadcastrgb\` utility
2. If it's not found - offers to install automatically via Homebrew
3. After installation, you can use the application immediately

### Requirements

- **macOS** (Intel or Apple Silicon)
- **Homebrew** (will be installed automatically if needed)

## Development

To run in development mode:

```bash
wails dev
```

## Building the Application

To create a ready-made application:

```bash
wails build
```

The ready application will be in the \`build/bin/\` folder.

## Usage

1. Make sure \`quadcastrgb\` is installed
2. Connect HyperX QuadCast to your computer
3. Launch the application
4. Click "Connect Device"
5. Choose the LED color

## Technologies

- [Wails](https://wails.io/) - framework for creating desktop applications
- [QuadcastRGB](https://github.com/Ors1mer/QuadcastRGB) - utility for controlling QuadCast
- Go - backend
- Vanilla JS - frontend
- CSS3 - styling

## Troubleshooting

### macOS blocks the app from opening

If you see "macOS cannot verify the developer":

**Option 1 (Easier):**

1. Right-click (or Control+click) on the app
2. Select **Open**
3. Click **Open** in the dialog

**Option 2:**

1. Go to **System Settings** → **Privacy & Security**
2. Scroll down and click **Open Anyway** next to the blocked app message
3. Enter your password if prompted

You only need to do this once per app.

### Error "quadcastrgb utility not found"

Install quadcastrgb:

```bash
brew install quadcastrgb
```

### Error "QuadCast device not found"

1. Make sure the microphone is connected to your computer
2. Check that the microphone is visible in the system:

```bash
system_profiler SPUSBDataType | grep -i hyperx
```

## License

MIT

## Acknowledgements

- [Ors1mer](https://github.com/Ors1mer) for the [QuadcastRGB](https://github.com/Ors1mer/QuadcastRGB) utility
