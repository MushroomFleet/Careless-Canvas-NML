# Careless-Canvas-NML Desktop Installation Guide

## Windows Desktop Distribution v1.0.0-rc.1

This document provides instructions for installing and running the Careless-Canvas-NML desktop application on Windows.

## 📦 Distribution Files

The Windows distribution includes two options:

### 1. **Installer Version** (Recommended)
- **File**: `Careless-Canvas-NML Setup 1.0.0-rc.1.exe` (115 MB)
- **Type**: NSIS installer with setup wizard
- **Features**: 
  - Desktop shortcut creation
  - Start menu integration
  - File association for .nml files
  - Uninstaller included
  - Custom installation directory option

### 2. **Portable Version**
- **File**: `Careless-Canvas-NML-1.0.0-rc.1-portable.exe` (115 MB)
- **Type**: Single executable file
- **Features**:
  - No installation required
  - Run from any location
  - Perfect for USB drives or temporary use
  - No system integration

## 🚀 Installation Instructions

### Option A: Using the Installer (Recommended)

1. **Download** the installer file:
   ```
   Careless-Canvas-NML Setup 1.0.0-rc.1.exe
   ```

2. **Run the installer** by double-clicking the file

3. **Follow the installation wizard**:
   - Choose installation directory (default: `C:\Users\{Username}\AppData\Local\Programs\careless-canvas-nml`)
   - Select components to install
   - Choose Start Menu folder
   - Select additional tasks (desktop shortcut, etc.)

4. **Complete installation** - Click "Install" and wait for completion

5. **Launch the application**:
   - From desktop shortcut (if created)
   - From Start Menu → Careless-Canvas-NML
   - Double-click any .nml file (file association)

### Option B: Using the Portable Version

1. **Download** the portable file:
   ```
   Careless-Canvas-NML-1.0.0-rc.1-portable.exe
   ```

2. **Choose a location** where you want to run the app from

3. **Run the application** by double-clicking the file

4. **Create shortcuts** (optional):
   - Right-click the executable → "Create shortcut"
   - Move shortcut to desktop or Start Menu

## 🖥️ System Requirements

- **Operating System**: Windows 10 or Windows 11 (64-bit)
- **Memory**: 4 GB RAM minimum (8 GB recommended)
- **Storage**: 150 MB available disk space
- **Graphics**: DirectX 11 compatible graphics card
- **Network**: Internet connection for initial setup (optional for offline use)

## ✨ Desktop Features

### Native Windows Integration
- **Window Management**: Native Windows title bar, minimize, maximize, close
- **Menu Bar**: File, Edit, View, Window, Help menus
- **Keyboard Shortcuts**: 
  - `Ctrl+N` - New Document
  - `Ctrl+O` - Open File
  - `Ctrl+S` - Save Document
  - `Ctrl+Shift+S` - Save As
  - `Ctrl+V` - Create New Page

### File Operations
- **Native File Dialogs**: Windows-style open/save dialogs
- **File Associations**: Double-click .nml files to open
- **Recent Files**: Access recently opened documents (coming soon)

### Application Features
- **Offline Operation**: Full functionality without internet
- **Auto-Updates**: Built-in update mechanism (coming soon)
- **System Tray**: Minimize to system tray (coming soon)

## 🔧 Troubleshooting

### Installation Issues

**"Windows protected your PC" warning:**
- Click "More info" → "Run anyway"
- This occurs because the app is not digitally signed

**Installer won't run:**
- Right-click installer → "Run as administrator"
- Temporarily disable antivirus if it blocks the installer

**Installation fails:**
- Ensure you have administrator privileges
- Close any running antivirus software temporarily
- Free up disk space (need at least 200 MB)

### Runtime Issues

**Application won't start:**
- Check Windows Event Viewer for error details
- Ensure Microsoft Visual C++ Redistributable is installed
- Try running as administrator

**Blank/white window:**
- Wait 10-15 seconds for initial load
- Check internet connection (for first run)
- Try restarting the application

**Performance issues:**
- Close other resource-intensive applications
- Update graphics drivers
- Increase virtual memory if needed

## 🗂️ File Locations

### Installed Version
- **Application**: `%LOCALAPPDATA%\Programs\careless-canvas-nml\`
- **User Data**: `%APPDATA%\careless-canvas-nml\`
- **Logs**: `%APPDATA%\careless-canvas-nml\logs\`

### Portable Version
- **Application**: Same directory as the executable
- **User Data**: `[ExecutableDirectory]\data\`
- **Logs**: `[ExecutableDirectory]\logs\`

## 🔄 Uninstallation

### Removing Installed Version
1. **Windows Settings**:
   - Go to Settings → Apps → Apps & features
   - Find "Careless-Canvas-NML"
   - Click "Uninstall"

2. **Control Panel**:
   - Control Panel → Programs → Programs and Features
   - Select "Careless-Canvas-NML" → Uninstall

3. **Using Uninstaller**:
   - Run uninstaller from Start Menu or installation directory

### Removing Portable Version
- Simply delete the executable file
- No system changes are made

## 📋 Version Information

- **Application Version**: 1.0.0-rc.1
- **Build Date**: January 4, 2025
- **Electron Version**: 38.0.0
- **Node.js Version**: 20.x
- **Architecture**: x64 (64-bit)

## 🆘 Support

### Getting Help
- **Documentation**: Check the README.md file
- **NML Standard**: [GitHub Repository](https://github.com/MushroomFleet/NML--Nested-Markup-Language)
- **Issues**: Report bugs through the project repository

### Known Limitations
- Custom icons require 256x256 minimum size
- Development dependencies contain security warnings (don't affect production)
- File size associations may require administrator privileges

---

**Careless-Canvas-NML Desktop** - Professional NML document editing in a native Windows application.
