const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('finosAPI', {
  aiMessage: (payload) => ipcRenderer.invoke('ai-message', payload),
  getAIProviders: () => ipcRenderer.invoke('finos:getAIProviders'),
  appInfo: () => ipcRenderer.invoke('finos:appInfo')
});
