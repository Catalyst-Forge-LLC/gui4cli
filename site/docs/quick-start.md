---
title: Quick start
---

## Open a fixture

From a checkout:

```bash
pnpm exec tsx src/cli.ts fixtures/resize.js
```

Or print the form and skip the window:

```bash
pnpm exec tsx src/cli.ts fixtures/resize.js --json
```

The window shows fields, a command preview, **Run**, live output, and an exit code. Change a value and run again. Last-run values are saved locally and prefilled next time from `~/.gui4cli/lastrun/`. Avoid entering secrets into fields that will be remembered. Delete the JSON files in that folder to clear them. See [Window](/docs/window).

`fixtures/resize.js` is a Commander script. Detection is static AST, not a config file. The preview line is the command that will be spawned: Node, the script path, then flags. The working directory is the script's folder. A value with spaces is quoted in the preview and passed as one argument. A false checkbox omits the flag. A nonzero exit stays visible as **failed**.

## Open your script

```bash
npx gui4cli path/to/your-script.js
npx gui4cli . --entry bin/cli.js
```

Optional overrides go in `gui4cli.config.js` or `gui4cli.json` next to the script.

## Reuse the window later

```bash
npx gui4cli path/to/your-script.js --build --out ./my-resize-gui
cd my-resize-gui
npx --yes windowd
```

`windowd` launches the folder you are in. Without `--out`, the folder is `<title-slug>-gui/` in the current directory. Change into that folder before `npx --yes windowd`.

The original script path stays absolute. Node still resolves `commander` / `yargs` from the script's own `node_modules`.

## If detect fails

```text
Couldn't detect arguments for this script.
Add a gui4cli.config.js next to the script with a fields object, then try again.
```

See [Detect](/docs/detect).
