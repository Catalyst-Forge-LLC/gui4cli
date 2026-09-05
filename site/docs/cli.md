---
title: CLI
---

```text
gui4cli <script-or-folder> [--entry <path>] [--json]
gui4cli <script-or-folder> --build [--out <dir>] [--force]
```

| Flag | What it does |
| --- | --- |
| `--entry <path>` | Use this file as the script (overrides folder `bin` / `main`) |
| `--json` | Print the detected form and exit (no window) |
| `--build` | Write a reusable project folder and exit (no `.exe`) |
| `--out <dir>` | Folder for `--build` (default: `<title>-gui` in the current directory) |
| `--force` | Replace an existing `--out` folder |
| `--help` | Show help |

`--json` and `--build` do not mix.

## Examples

```bash
gui4cli fixtures/resize.js
gui4cli fixtures/resize.js --json
gui4cli fixtures/resize.js --build
gui4cli . --entry bin/cli.js
```

The `argui` bin is an optional alias of the same CLI.
