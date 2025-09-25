const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },

  onWindowAction: (callback) => {
    ipcRenderer.on('window-action', (event, action) => callback(action));
  },

  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const platform = process.platform;
  document.body.classList.add(`platform-${platform}`);

  if (platform === 'darwin') {
    document.body.classList.add('is-mac');
  } else if (platform === 'win32') {
    document.body.classList.add('is-windows');
  } else {
    document.body.classList.add('is-linux');
  }
});