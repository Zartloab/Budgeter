const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
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
  platform: process.platform
}));

ipcMain.handle('finos:claudeMessage', async (_, payload) => {
  const { apiKey, system, messages, model = 'claude-sonnet-4-20250514', max_tokens = 700 } = payload || {};
  if (!apiKey) {
    return { ok: false, error: 'Claude API key is missing. Add it in Settings.' };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens, system, messages })
    });

    const json = await res.json();
    if (!res.ok) return { ok: false, error: json?.error?.message || 'Claude request failed.' };
    const text = (json.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
    return { ok: true, text, raw: json };
  } catch (error) {
    return { ok: false, error: error.message || 'Unexpected Claude error.' };
  }
});
