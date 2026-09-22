# GUI4CLI

Turn a Node.js CLI script into a desktop form. Inputs, a Run button, and live output. The original file is unchanged.

The window runs your original script by its path on this computer, with the Node and dependencies installed here. It is not a standalone app you can send to someone.

The window is a [windowd](https://www.npmjs.com/package/windowd) app. The first launch downloads about 200 MB of NW.js. `--build` writes a reusable windowd folder, not an installer.

**Docs:** [gui4cli.dev/docs](https://gui4cli.dev/docs) · **Site:** [gui4cli.dev](https://gui4cli.dev) · **GitHub:** [Catalyst-Forge-LLC/gui4cli](https://github.com/Catalyst-Forge-LLC/gui4cli)

## Install

Requires **Node.js 20+**. Expect a one-time NW.js download on the first window.

```bash
npx gui4cli my-script.js
```

Or globally:

```bash
npm install -g gui4cli
gui4cli my-script.js
```

A folder works too: `gui4cli . --entry bin/cli.js`.

## What you get

- Detects Commander and yargs (JSDoc and `--help` are fallbacks)
- One window: fields, command preview, Run, live stdout/stderr, exit code
- Remembers last-run values
- `--json` prints the form and exits (CI, no GUI)
- `--build` writes a reusable windowd folder that wraps the original script in place (no `.exe`, no rewrite). It stores absolute paths to the script and to this machine's Node.

Optional overrides: `gui4cli.config.js` or `gui4cli.json` next to the script. Flags: [CLI](https://gui4cli.dev/docs/cli).

## Development

```bash
pnpm install
pnpm test
pnpm exec tsx src/cli.ts fixtures/resize.js --json
pnpm dev
```

`pnpm dev` opens the Commander fixture. The first windowd launch may download the NW.js runtime (~200 MB). If the window flashes and closes, run from a normal terminal, not Cursor's JavaScript Debug Terminal.

Site (FilePress): `pnpm site:dev` (LocalSlip `gui4cli-site` on **5201**). Redeploy: `pnpm ship`.

## License

MIT · Catalyst Forge LLC
