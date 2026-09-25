---
title: Project folder
---

`--build` writes a reusable [windowd](https://www.npmjs.com/package/windowd) folder. **windowd** is the named NW.js launcher. Use `--build` when you want the same form again without re-detecting. Everyday use is still `gui4cli my-script.js`. The folder is not a portable `.exe` and still needs Node next to the original script.

```bash
npx gui4cli path/to/your-script.js --build --out ./my-resize-gui
cd my-resize-gui
npx --yes windowd
```

`windowd` with no arguments launches the folder you are in. `cd` into `--out` before that command. `--force` replaces an existing folder:

```bash
npx gui4cli path/to/your-script.js --build --out ./my-resize-gui --force
```

Default folder name is `<title-slug>-gui` in the current directory (gitignored as `*-gui/` in this repo). The completion message prints the same `cd` and `npx --yes windowd` lines.

## In place, not a copy

The generated payload keeps an **absolute path** to the original script. Copying the file would break `require` / `import` for `commander` and `yargs` in the script's `node_modules`.

The original script is not rewritten.

The folder is a GUI shell. It is not a Windows `.exe` and not a zip of the script plus dependencies. Node still has to resolve the script where it lives.
