---
title: Project folder
---

`--build` writes a reusable windowd folder. Use it when you want the same form again without re-detecting. Everyday use is still `gui4cli my-script.js`.

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

The folder is a GUI shell. It is not a Windows `.exe` and not a zip of the script plus dependencies. Node still has to resolve the script where it lives.
