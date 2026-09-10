---
title: Introduction
---

**GUI4CLI** turns a Node.js CLI script into a desktop form. You keep the script. The tool reads the flags, opens a window, and runs that same file.

The product is a local CLI (`gui4cli` on npm). This site explains it. The window is a [windowd](https://www.npmjs.com/package/windowd) app (NW.js plus Vite), not a browser tab. **windowd** is the named launcher. It is not a typo.

The first windowd launch downloads the NW.js runtime (about **200 MB**). After that, the window opens from cache. This is not a tiny zero-download wrapper and not a standalone `.exe`.

## What it is

- Detects **Commander** and **yargs** from the source (static AST)
- Falls back to JSDoc, then optional config, then `--help` text
- Opens one window: inputs, command preview, Run, live stdout/stderr, exit code
- Remembers last-run values in `~/.gui4cli/lastrun/`
- `--build` writes a reusable **windowd** folder that wraps the original script in place

It does not rewrite the script or emit a `.exe`.

## Two surfaces

| Surface | What it is |
| --- | --- |
| [gui4cli.dev](https://gui4cli.dev) | This site: what it is and how to use it |
| npm `gui4cli` | The CLI. Instant window or `--build` folder, on your machine |

The site does not run your script.

## Detection boundary

A typical Commander or yargs script works. JSDoc detect is first-pass. `--help` fallback is thin and is skipped if the spawn hangs or has side effects. File fields are text paths. Dynamic flag builders and subcommands need `gui4cli.config.js`. Unsupported options are not advertised as reliable inferred fields.

If detect finds nothing, add `gui4cli.config.js` next to the script.

## Next

- [Install](/docs/install) — npx, npm, or a checkout, plus the first-launch download
- [Quick start](/docs/quick-start) — open a fixture, then your script
- [CLI](/docs/cli) — flags
