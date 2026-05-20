# FinOS (Budgeter) - Electron Local Desktop App

FinOS is a local-first weekly income delegation app (not full accounting software). It uses the existing vanilla HTML/CSS/JS style and now runs as an Electron desktop app.

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
- Do not expect Windows to produce a proper Mac DMG.

## Claude API in Electron
- UI calls Claude only through `window.finosAPI.claudeMessage(payload)`.
- IPC handler lives in `main.js` (`ipcMain.handle`).
- Put your API key in Settings.
- For personal local use, key is stored locally now; architecture can be upgraded to macOS Keychain/keytar later.
- Never commit real API keys.

## Data
Stored in localStorage (`finos_cfg_v3`, `finos_data_v3`) with:
- `cfg`: plan config, buckets, currency, Claude key
- `data`: weekly entries, simplified transactions, AI history

## CI builds
GitHub Actions workflow:
- Manual run via `workflow_dispatch`
- Auto run on push to `main`
- Builds mac artifact on `macos-latest`
- Builds windows artifact on `windows-latest`
- Uploads artifacts
