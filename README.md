# FinOS (Budgeter) - Electron Local Desktop App

FinOS is a local-first weekly income delegation app (not full accounting software). It keeps the vanilla HTML/CSS/JS style and runs as an Electron desktop app.

## Core flow
1. Configure your Money Plan buckets once.
2. Enter weekly income in **Log Income**.
3. Preview auto-allocation (funded / partial / skipped).
4. Confirm and save week.
5. Track leftover (`Leftover / Buffer`) and shortfall.

## Local development
```bash
npm install
npm start
```

## Build packages
```bash
npm run dist
npm run dist:mac
npm run dist:win
```

- macOS DMG should be built on macOS (or CI `macos-latest`).
- Windows installers should be built on Windows (or CI `windows-latest`).
- Do **not** expect Windows to produce a valid Mac DMG.

## AI Providers (Main Process Only)
- Default provider: **OpenAI** (`gpt-5.2`)
- Optional provider: **Claude** (`claude-sonnet-4-20250514`)
- Renderer calls `window.finosAPI.aiMessage(payload)` only; no direct API fetch in frontend.

## Claude API in Electron
- Renderer routes AI via `window.finosAPI.aiMessage(payload)` from preload.
- IPC handlers live in `main.js` (including `ipcMain.handle('ai-message')`).
- Anthropic API is called only in main process.
- Put your API key in Settings.
- For personal local use, key is stored locally now; architecture can later move to Keychain/keytar.
- Never commit real API keys.

## Data
Stored in localStorage (`finos_cfg_v3`, `finos_data_v3`):
- `cfg`: plan config, buckets, currency, Claude key
- `data`: weekly entries, simplified transactions, AI history

## GitHub Actions CI builds
Workflow file: `.github/workflows/build.yml`
- Manual run via `workflow_dispatch`
- Auto run on push to `main`
- Matrix builds on `macos-latest` and `windows-latest`
- Uses npm cache and uploads build artifacts

## Stability notes
- App remains local-first and offline-capable except Claude requests.
- Import/export includes validation and corruption-safe fallback behavior.
- Renderer has basic runtime error logging (`error` and `unhandledrejection`) to aid debugging.


## First-run OpenAI setup
1. Open the app.
2. Go to **Settings**.
3. Paste your **OpenAI API key**.
4. Click **Test OpenAI Key**.
5. Open **AI Coach** and start using AI features.
