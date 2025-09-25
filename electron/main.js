const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const iconPath = path.join(__dirname, '..', 'Phone', 'icons', '512.png');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: iconPath,
    title: 'Browser Phone',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const indexPath = path.join(__dirname, '..', 'Phone', 'index.html');
  mainWindow.loadFile(indexPath);

  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.show();
  } else {
    const shouldStartVisible = process.argv.includes('--show') || process.argv.includes('--visible');
    if (shouldStartVisible) {
      mainWindow.show();
    }
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();

      if (process.platform === 'darwin') {
        app.dock.hide();
      }
    }
  });

  mainWindow.on('minimize', (event) => {
    if (process.platform !== 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.webContents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

function createTray() {
  const iconPath = path.join(__dirname, '..', 'Phone', 'icons', '512.png');
  let trayIcon = nativeImage.createFromPath(iconPath);

  if (process.platform === 'darwin') {
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
  } else if (process.platform === 'win32') {
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
  } else {
    trayIcon = trayIcon.resize({ width: 22, height: 22 });
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Browser Phone - WebRTC SIP Phone');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Browser Phone',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          if (process.platform === 'darwin') {
            app.dock.show();
          }
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Hide Browser Phone',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
          if (process.platform === 'darwin') {
            app.dock.hide();
          }
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'About Browser Phone',
      click: () => {
        shell.openExternal('https://github.com/InnovateAsterisk/Browser-Phone');
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit Browser Phone',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
        if (process.platform === 'darwin') {
          app.dock.hide();
        }
      } else {
        mainWindow.show();
        if (process.platform === 'darwin') {
          app.dock.show();
        }
        mainWindow.focus();
      }
    }
  });

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      if (process.platform === 'darwin') {
        app.dock.show();
      }
      mainWindow.focus();
    }
  });
}

function setupAppMenu() {
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Browser Phone',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          {
            label: 'Show Main Window',
            accelerator: 'CmdOrCtrl+1',
            click: () => {
              if (mainWindow) {
                mainWindow.show();
                mainWindow.focus();
              }
            }
          },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
          { type: 'separator' },
          { role: 'front' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null);
  }
}

app.setAppUserModelId('com.innovateasterisk.browserphone');

app.whenReady().then(() => {
  // Clear any cached service worker data
  if (isDev) {
    console.log('Clearing service worker cache for development...');
    const session = require('electron').session;
    session.defaultSession.clearStorageData({
      storages: ['serviceworkers', 'cachestorage']
    }).then(() => {
      console.log('Service worker cache cleared');
    }).catch((error) => {
      console.warn('Failed to clear service worker cache:', error);
    });
  }

  createWindow();
  createTray();
  setupAppMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      if (process.platform === 'darwin') {
        app.dock.show();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (!isQuitting) {
      return;
    }
  }
  app.quit();
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});