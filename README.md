# GUI4CLI

Turn a Node.js CLI script into a desktop form. Inputs, a Run button, and live output. The original file is unchanged.

The window runs your original script by its path on this computer, with the Node and dependencies installed here. It is not a standalone app you can send to someone.

The window is a [windowd](https://www.npmjs.com/package/windowd) app. The first launch downloads about 200 MB of NW.js. `--build` writes a reusable windowd folder, not an installer.

**Docs:** [gui4cli.dev/docs](https://gui4cli.dev/docs) · **Site:** [gui4cli.dev](https://gui4cli.dev) · **GitHub:** [Catalyst-Forge-LLC/gui4cli](https://github.com/Catalyst-Forge-LLC/gui4cli)

## From CLI flags to a desktop form

The repository's resize demo accepts these options:

```bash
node fixtures/resize.js --input ./photos --output ./small --width 800 --quality 85
```

From a checkout with dependencies installed, `npx gui4cli fixtures/resize.js` opens this form:

![Actual GUI4CLI desktop window with input, output, width and quality fields; matching command, Run button, and Output pane.](https://gui4cli.dev/screenshots/gui4cli-resize.png)

Actual Windows window in **Ready** state, with sample values filled in. Review the command, then choose Run. The original script executes and its output appears beside the form, followed by its exit code. You can change a field and run again without rebuilding the command.

For this demo, the output begins `Resizing (fixture, no files touched)` and prints the selected options. The fixture does not resize images. The screenshot shows the form before execution. [Full example and output](https://gui4cli.dev/#form-example).

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

- Detects Commander and yargs. If those, JSDoc, and explicit config fields find no fields, GUI4CLI may run the script with `--help`. That can have side effects. Explicit config fields skip that execution.
- One window: fields, command preview, Run, live stdout/stderr, exit code
- Remembers last-run values
- `--json` prints the form and exits (no window). It still runs detection, including the `--help` fallback.
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

[See the rest of the Catalyst Forge shelf.](https://catalystforge.com/tools/)
