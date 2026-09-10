---
title: Window
---

GUI4CLI writes a temp folder (`index.html`, `app.js`, payload) and starts [windowd](https://www.npmjs.com/package/windowd).

## What you see

A two-column window (~960×620): fields on the left, command preview and live output on the right.

- Tab through fields
- Ctrl/Cmd+Enter to **Run**
- Stdout and stderr stream while the process is alive
- Exit code and duration when it finishes
- **Cancel** kills the child tree (Windows: `taskkill /T /F`)

Last-run values load from `~/.gui4cli/lastrun/`.

## First launch

windowd downloads the NW.js runtime (~200 MB) the first time. After that, the window opens from cache.

If the window flashes and closes:

1. Run from a **normal terminal**, not Cursor's JavaScript Debug Terminal. Inspector env (`NODE_OPTIONS`, `VSCODE_INSPECTOR_OPTIONS`) inherited by NW.js will shut the window down. GUI4CLI strips those for the child; a leftover `--require` bootloader still bites sometimes.
2. Generated apps disable Vite HMR. The first HMR reload fires windowd's `beforeunload` close signal.
3. If windowd exits within 5 seconds with code 0, GUI4CLI opens once more and says so.

## Status

The window reports **ready / running / streaming / done / failed**. It does not sit on a frozen form while the script runs.

The window is a windowd app, not a browser tab and not a packaged `.exe`. Neutralino and Tauri are later.
