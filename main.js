const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { routeAIMessage, PROVIDERS } = require('./src/ai/aiRouter');

function log(...args) {
  console.log('[FinOS]', ...args);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 900,
    minWidth: 480,
    minHeight: 760,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile('index.html').catch((error) => log('Failed to load index.html', error));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('finos:appInfo', () => ({
  version: app.getVersion(),
  name: app.getName(),
  platform: process.platform,
  electron: process.versions.electron
}));

ipcMain.handle('finos:getAIProviders', () => ({
  success: true,
  providers: PROVIDERS,
  defaults: { openai: 'gpt-5.2', claude: 'claude-sonnet-4-20250514' }
}));

ipcMain.handle('ai-message', async (_, payload) => {
  try {
    if (!payload || typeof payload !== 'object') {
      return { success: false, provider: 'unknown', error: 'Invalid AI payload.' };
    }

    const provider = String(payload.provider || 'openai').toLowerCase();
    const model = typeof payload.model === 'string' ? payload.model.trim() : '';
    const system = typeof payload.system === 'string' ? payload.system.slice(0, 12000) : '';
    const input = typeof payload.input === 'string' ? payload.input.slice(0, 20000) : '';

    if (!input) {
      return { success: false, provider, error: 'AI input is empty.' };
    }

    return await routeAIMessage({
      provider,
      model,
      system,
      input,
      responseFormat: payload.responseFormat === 'json' ? 'json' : 'text',
      openaiApiKey: typeof payload.openaiApiKey === 'string' ? payload.openaiApiKey.trim() : '',
      claudeApiKey: typeof payload.claudeApiKey === 'string' ? payload.claudeApiKey.trim() : ''
    });
  } catch (error) {
    return { success: false, provider: 'unknown', error: `AI routing failed: ${error.message}` };
  }
});
