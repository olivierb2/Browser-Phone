# Browser Phone - Electron App

This directory contains the Electron app version of Browser Phone, allowing you to run the WebRTC SIP phone as a native desktop application.

## Features

- **System Tray Integration**: App minimizes to system tray instead of closing
- **Startup Options**: Can start minimized to tray by default
- **Cross Platform**: Works on Windows, macOS, and Linux
- **Native App Experience**: Proper window management and OS integration
- **Auto-updater Ready**: Built with electron-builder for easy distribution

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run electron-dev
   ```

3. Run normally:
   ```bash
   npm start
   ```

### Building

- Build for current platform:
  ```bash
  npm run build
  ```

- Build for specific platforms:
  ```bash
  npm run build:win    # Windows
  npm run build:mac    # macOS
  npm run build:linux  # Linux
  ```

- Create package without installer:
  ```bash
  npm run pack
  ```

### Startup Options

- Start normally (window visible):
  ```bash
  npm start
  ```

- Start minimized to tray:
  ```bash
  npm start
  ```

- Force show window on startup:
  ```bash
  npm start -- --show
  ```

## Tray Icon Features

- **Left Click**: Toggle window visibility
- **Right Click**: Context menu with:
  - Show/Hide Browser Phone
  - About Browser Phone
  - Quit Browser Phone

## Platform-Specific Notes

### Windows
- App will appear in system tray (bottom right corner)
- NSIS installer includes start menu and desktop shortcuts
- Supports both x64 and x32 architectures

### macOS
- App will appear in menu bar (top right)
- Creates DMG installer with drag-to-install
- Supports both Intel (x64) and Apple Silicon (arm64)
- Proper dock integration

### Linux
- App will appear in system tray (varies by desktop environment)
- Creates both AppImage and DEB packages
- Categorized as "Network" application

## File Structure

```
electron/
├── main.js       # Main Electron process
└── preload.js    # Preload script for security
Phone/            # Original web app files (unchanged)
package.json      # Electron configuration
```

## Configuration

The app is configured through `package.json` build section. Key settings:

- App ID: `com.innovateasterisk.browserphone`
- Icons: Uses existing `Phone/icons/512.png`
- Security: Context isolation enabled, node integration disabled
- Auto-updater ready (configure publish settings as needed)

## Troubleshooting

### WebRTC Issues
The app maintains the same WebRTC capabilities as the web version. Ensure:
- Microphone/camera permissions are granted
- Network connectivity for SIP/WebSocket connections
- Certificates are properly configured for secure contexts

### Development
- Use `npm run electron-dev` to see console output
- DevTools open automatically in development mode
- Check the main process and renderer process logs separately

### Distribution
- Code signing may be required for macOS/Windows distribution
- Configure notarization for macOS App Store distribution
- Set up auto-updater endpoints if using automatic updates

## Original Web App

The original Browser Phone web application remains unchanged in the `Phone/` directory and can still be used independently by serving the files with any web server.