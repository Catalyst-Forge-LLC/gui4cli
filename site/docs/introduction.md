---
title: Introduction
---

**GUI4CLI** turns a Node.js CLI script into a desktop form. You keep the script. The tool reads the flags, opens a window, and runs that same file.

The product is a local CLI (`gui4cli` on npm). This site is the explainer. The window is a [windowd](https://www.npmjs.com/package/windowd) app (NW.js + Vite), not a browser tab.

## What it is

- Detects **Commander** and **yargs** from the source (static AST)
- Falls back to JSDoc, then optional config, then `--help` text
- Opens one window: inputs, command preview, **Run**, live stdout/stderr, exit code
- Remembers last-run values under `~/.gui4cli/lastrun/`
- `--build` writes a reusable folder that wraps the original script **in place**

It does **not** rewrite the script, emit a `.exe`, or host anything.

## Two surfaces

| Surface | What it is |
| --- | --- |
| [gui4cli.dev](https://gui4cli.dev) | This site: what it is and how to use it |
| npm `gui4cli` | The CLI. Instant window or `--build` folder, on your machine |

The domain never runs your script.

## Honest limits

The hero path works for typical Commander and yargs scripts. JSDoc detect is first-pass. `--help` fallback is thin. File fields are text paths. The first windowd launch downloads ~200 MB of NW.js; “under 30 seconds” does not apply to a cold machine.

If detect finds nothing, add `gui4cli.config.js` next to the script.

## Next

- [Install](/docs/install) — npx, npm, or a checkout
- [Quick start](/docs/quick-start) — open a fixture, then your script
- [CLI](/docs/cli) — flags
