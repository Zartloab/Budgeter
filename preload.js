const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('finosAPI', {
  aiMessage: (payload) => ipcRenderer.invoke('ai-message', payload),
  getAIProviders: () => ipcRenderer.invoke('get-ai-providers'),
  appInfo: () => ipcRenderer.invoke('app-info')
});
