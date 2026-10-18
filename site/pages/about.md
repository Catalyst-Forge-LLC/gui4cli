---
title: "Give your script a window people can use."
description: "GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window."
order: 1
---

<section class="value-hero" aria-label="GUI4CLI overview"><div class="value-intro"><p class="value-kind">Desktop form for an existing Node.js CLI</p><h1>Give your script a window people can use.</h1><p class="value-lede">GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window.</p><div class="cta-row"><a class="cta cta-primary" href="/docs/install">Install GUI4CLI</a><a class="cta cta-secondary" href="#quick-start">Try the example script</a></div><p class="value-limit">The script and its dependencies stay on this computer. First launch downloads the NW.js runtime, about 200 MB.</p></div><figure class="value-proof"><figcaption>Illustrative example</figcaption><p><strong>Starting point</strong><br>A script has file, width, and output flags that are easy to forget.</p><div class="value-result"><p><strong>What you get</strong><br>Labeled inputs, a Run control, live output, and an exit code.</p></div><p>Run the same local script without retyping its options.</p><p class="value-note">Illustrative form. It is not a standalone app to send to someone else.</p></figure></section>

## What you get

Point it at a script. It finds Commander or yargs options (JSDoc and `--help` if those are missing), draws a form, and shows the command it will run.

Run starts the original file. Stdout and stderr stream in the window. You get an exit code and how long it took. Cancel stops the child process.

The next open prefills the last values you used.

`--json` prints the form and exits. No window. Use that in CI.

`--build` writes a **windowd** folder that wraps the script where it already lives. It does not copy the file, rewrite it, or emit a `.exe`. The generated folder keeps absolute paths to the original script and to this machine's Node, so it works only on this computer.

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

File and directory fields are text paths. There is no native picker yet.

`--help` fallback may run the script, and that run can have side effects. If detection still finds no fields, add `gui4cli.config.js` next to the script. Config does not skip the `--help` attempt.

<div class="cta-row">
  <a class="cta cta-primary" href="/docs/install">Get started →</a>
</div>

Built by [Catalyst Forge LLC](https://www.catalystforge.com).
