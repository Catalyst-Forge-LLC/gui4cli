---
title: A desktop form for a Node CLI.
description: Turn a Node.js CLI script into a desktop form. Inputs, Run, live output. The original file is unchanged.
order: 1
---

You already have a Commander or yargs script. **GUI4CLI** reads the flags, opens a window, and runs that same file.

Detect the flags · Open a window · Run the script you already have.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs">Read the docs →</a>
  <a class="cta cta-secondary" href="/docs/install">Install GUI4CLI</a>
</div>

<p class="kicker">npm · npx · Node 20+ · local desktop window</p>

## What you get

Point it at a script. It finds Commander or yargs options (JSDoc and `--help` if those are missing), draws a form, and shows the command it will run.

Run starts the original file. Stdout and stderr stream in the window. You get an exit code and how long it took. Cancel stops the child process.

The next open prefills the last values you used.

`--json` prints the form and exits. No window. Use that in CI.

`--build` writes a windowd folder that wraps the script where it already lives. It does not copy the file, rewrite it, or emit a `.exe`.

## Quick start

```bash
npx gui4cli my-script.js
```

From this repo:

```bash
pnpm exec tsx src/cli.ts fixtures/resize.js
```

The first windowd launch downloads the NW.js runtime (~200 MB). After that, a typical Commander or yargs script opens as a form.

Flags live in the [docs](/docs).

## Limits

This stays on your machine. It wraps the script you already have. File and directory fields are text paths. There is no native picker yet.

`--help` fallback is thin. If detect finds nothing, add `gui4cli.config.js` next to the script.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs/install">Get started →</a>
</div>

Built by [Catalyst Forge LLC](https://www.catalystforge.com).
