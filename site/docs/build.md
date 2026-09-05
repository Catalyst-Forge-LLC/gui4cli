---
title: Project folder
---

`--build` writes a reusable windowd folder. Instant GUI stays the everyday path; this is for a form you want to open again without re-detecting.

```bash
gui4cli my-script.js --build
gui4cli my-script.js --build --out ./my-resize-gui
gui4cli my-script.js --build --out ./my-resize-gui --force
```

Default folder name is `<title-slug>-gui` in the current directory (gitignored as `*-gui/` in this repo).

Then:

```bash
npx --yes windowd
```

## In place, not a copy

The generated payload keeps an **absolute path** to the original script. Copying the file would break `require` / `import` for `commander` and `yargs` in the script's `node_modules`.

The original script is not rewritten.

## What you do not get

`--build` does not emit a Windows `.exe`, a signed installer, or a portable zip of the script plus dependencies. The folder is a GUI shell. Node still has to resolve the script where it lives.
