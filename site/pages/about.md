---
title: "Give your script a window people can use."
description: "GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window."
order: 1
---

<section class="value-hero" aria-label="GUI4CLI overview"><div class="value-intro"><div class="value-headline"><p class="value-kind">Desktop form for an existing Node.js CLI</p><h1>Give your script a window people can use.</h1></div><div class="value-pitch"><p class="value-lede">GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window.</p><div class="cta-row"><a class="cta cta-primary" href="/docs/install">Install GUI4CLI</a><a class="cta cta-secondary" href="#form-example">See the actual window</a></div><p class="value-limit">The script and its dependencies stay on this computer. First launch downloads the NW.js runtime, about 200 MB.</p></div></div>
<figure class="value-proof product-example" id="form-example" tabindex="-1">
<figcaption>Your CLI becomes this desktop form</figcaption>
<p class="example-context">Someone using your script can fill in labeled fields instead of remembering its flags. Here is the actual window GUI4CLI generates for the repository’s resize demo.</p>
<section class="example-step example-cli" aria-labelledby="example-step-1">
<div><h2 id="example-step-1"><span>1 · The CLI you already have</span> A script with options to remember</h2><p>This Commander script accepts an input folder, an output folder, a width, and a quality setting.</p></div>
<pre><code>node fixtures/resize.js \
  --input ./photos \
  --output ./small \
  --width 800 \
  --quality 85</code></pre>
</section>
<section class="example-step example-window" aria-labelledby="example-step-2">
<h2 id="example-step-2"><span>2 · The GUI it generates</span> Fill in the fields, then review the command</h2>
<a class="window-image" href="/screenshots/gui4cli-resize.png" aria-label="Open the full-size GUI4CLI desktop screenshot"><img src="/screenshots/gui4cli-resize.png" width="2475" height="1350" alt="Actual GUI4CLI Resize window: Input ./photos, Output ./small, Width 800, Quality 85, and a Verbose checkbox on the left; the matching Node command, Run and Cancel buttons, and an empty Output pane on the right. Status: Ready — review the command, then Run." loading="lazy" decoding="async"></a>
<p class="screenshot-caption">Actual Windows desktop window, ready to run, with sample values prefilled. <a href="/screenshots/gui4cli-resize.png">Open full-size screenshot</a>.</p>
</section>
<section class="example-step example-output" aria-labelledby="example-step-3">
<div><h2 id="example-step-3"><span>3 · What Run gives you</span> The same script, with its output beside the form</h2><p>Run sends these values to the original script. Its output streams into the window, followed by an exit code and elapsed time.</p><p class="example-payoff">You can change an option and run again without rebuilding the command.</p><p class="fixture-note">Verified demo output, exit code 0. This fixture prints its options; it does not resize or write images.</p></div>
<pre><code>Resizing (fixture, no files touched)
{
  "output": "./small",
  "width": "800",
  "quality": "85",
  "input": "./photos"
}</code></pre>
</section>
<p class="example-links"><a href="#quick-start">Open this demo in GUI4CLI</a></p>
</figure></section>

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
