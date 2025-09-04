const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveFile: (content, filePath) => ipcRenderer.invoke('save-file', content, filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // Window operations
  setTitle: (title) => ipcRenderer.send('set-title', title),
  
  // Menu event listeners
  onMenuNewDocument: (callback) => ipcRenderer.on('menu-new-document', callback),
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onMenuSaveDocument: (callback) => ipcRenderer.on('menu-save-document', callback),
  onMenuSaveAs: (callback) => ipcRenderer.on('menu-save-as', callback),
  onMenuCreatePage: (callback) => ipcRenderer.on('menu-create-page', callback),
  onOpenFile: (callback) => ipcRenderer.on('open-file', callback),
  
  // Remove listeners (cleanup)
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // Check if running in Electron
  isElectron: true
});

// Expose a simple API for checking if we're in Electron
contextBridge.exposeInMainWorld('isElectron', true);
