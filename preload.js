const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('finosAPI', {
  claudeMessage: (payload) => ipcRenderer.invoke('finos:claudeMessage', payload),
  appInfo: () => ipcRenderer.invoke('finos:appInfo')
});
