---
title: A desktop form for a Node CLI.
description: Turn a Node.js CLI script into a desktop form — inputs, Run, and live output — without rewriting the script.
order: 1
---

You already have a Commander or yargs script. **GUI4CLI** reads the flags, opens a window, and runs that same file. The script stays the source of truth.

**Detect** the flags · **Open** a window · **Run** the script you already have.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs">Read the docs →</a>
  <a class="cta cta-secondary" href="/docs/install">Install GUI4CLI</a>
</div>

<p class="kicker">npm · npx · Node 20+ · local desktop window</p>

## What you get

Point it at a script. It detects Commander or yargs options (JSDoc and `--help` are fallbacks), draws a form, and shows the command it will run.

**Run** spawns the original file. Stdout and stderr stream in the window. You get an exit code and a duration. **Cancel** kills the child tree (on Windows, `taskkill /T /F`).

Last-run values live under `~/.gui4cli/lastrun/`. The next open prefills the form.

`--json` prints the detected form and exits — no window. Use that in CI.

`--build` writes a reusable windowd folder that wraps the script **in place**. It does not copy the file, rewrite it, or emit a `.exe`.

## Quick start

```bash
npx gui4cli my-script.js
```

Or from this repo:

```bash
pnpm exec tsx src/cli.ts fixtures/resize.js
```

The first windowd launch downloads the NW.js runtime (~200 MB). After that, a typical Commander or yargs script opens as a form.

Full flags live in the [docs](/docs).

## What it is not

This is a local wrapper, not a hosted app and not a GUI framework. It does not rewrite your script, ship a Windows installer, or infer flags with an LLM. File and directory fields are text paths today — there is no native picker yet.

`--help` fallback is thin. If detect comes up empty, add `gui4cli.config.js` next to the script.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs/install">Get started →</a>
</div>

Built by [Catalyst Forge LLC](https://www.catalystforge.com).
