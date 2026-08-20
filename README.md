# GUI4CLI

Turn a Node.js CLI script into a simple desktop form — inputs, a Run button, and live output — without rewriting the script.

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation (this repo)

```bash
pnpm install
pnpm test
pnpm exec tsx src/cli.ts fixtures/resize.js --json
pnpm dev
```

`pnpm dev` opens the Commander fixture in a desktop window. The first windowd launch may download the NW.js runtime (~200 MB).

If the window flashes and closes, run `pnpm dev` from a normal terminal (not Cursor's JavaScript Debug Terminal). Inspector flags inherited by NW.js will shut the window down.

`--json` prints the detected form and exits (no window). Use that in CI or when you cannot open a GUI.

`--build` writes a reusable project folder (GUI shell + `package.json`). It does not create an `.exe`, and it does not rewrite the original script.

```bash
pnpm exec tsx src/cli.ts fixtures/resize.js --build
pnpm exec tsx src/cli.ts fixtures/resize.js --build --out ./my-resize-gui
```

Then `npx --yes windowd` inside that folder.

### Try a script

```bash
pnpm exec tsx src/cli.ts path/to/your-script.js
pnpm exec tsx src/cli.ts . --entry bin/cli.js
```

Optional overrides: `gui4cli.config.js` or `gui4cli.json` next to the script.

## Project Structure

```
src/           TypeScript CLI (detect, schema, window, run)
fixtures/      Commander + yargs sample scripts
docs/          GENESIS + Phase 1 brief
CONTEXT_PROMPT.md
TODO.md
```

## Features

| Feature | Description |
| ------- | ----------- |
| Detect | Static Commander / yargs, then JSDoc, config, `--help` |
| Instant GUI | One windowd window, no generated repo required |
| `--build` | Reusable project folder; run later with `npx windowd` |
| Run | Spawn the original script; stream stdout/stderr; cancel |
| Last run | Values stored under `~/.gui4cli/lastrun/` |

## Tech Stack

- TypeScript, ESM, pnpm
- Zod
- windowd (Node + webview)
- No database, auth, or LLM

## Documentation

- [docs/PHASE_1_BRIEF.md](docs/PHASE_1_BRIEF.md) — locked architecture
- [docs/GENESIS.md](docs/GENESIS.md) — product spec
- [CONTEXT_PROMPT.md](CONTEXT_PROMPT.md) — session handoff
- [TODO.md](TODO.md) — backlog
