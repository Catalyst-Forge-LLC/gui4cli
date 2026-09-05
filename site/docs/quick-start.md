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

The window shows fields, a command preview, **Run**, live output, and an exit code. Change a value and run again. Last-run values come back the next time.

## Open your script

```bash
npx gui4cli path/to/your-script.js
npx gui4cli . --entry bin/cli.js
```

Optional overrides go in `gui4cli.config.js` or `gui4cli.json` next to the script.

## Reuse the window later

```bash
npx gui4cli path/to/your-script.js --build
```

That writes `<title-slug>-gui/` in the current directory (or `--out`). Open it with:

```bash
npx --yes windowd
```

The original script path stays absolute. Node still resolves `commander` / `yargs` from the script's own `node_modules`.

## If detect fails

```text
Couldn't detect arguments for this script.
Add a gui4cli.config.js next to the script with a fields object, then try again.
```

See [Detect](/docs/detect).
