---
title: "Give your script a window people can use."
description: "GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window."
order: 1
---

<section class="value-hero" aria-label="GUI4CLI overview"><div class="value-intro"><div class="value-headline"><p class="value-kind">Desktop form for an existing Node.js CLI</p><h1>Give your script a window people can use.</h1></div><div class="value-pitch"><p class="value-lede">GUI4CLI reads a Commander or yargs script and builds a form from its flags. Choose inputs, inspect the command, and run the original script with live output in a desktop window.</p><div class="cta-row"><a class="cta cta-primary" href="/docs/install">Install GUI4CLI</a><a class="cta cta-secondary" href="#form-example">See fields, command, and output</a></div><p class="value-limit">The script and its dependencies stay on this computer. First launch downloads the NW.js runtime, about 200 MB.</p></div></div>
<figure class="value-proof worked-example" id="form-example" tabindex="-1">
<figcaption>Fill in the options, inspect the command, see the result</figcaption>
<p class="example-context">The repository’s resize.js fixture accepts real Commander options but does not resize or write files. The form below is a static illustration of those fields.</p>
<section class="example-step" aria-labelledby="example-step-1">
<h2 id="example-step-1"><span>1 · Form fields</span> The options have names and saved values</h2>
<dl class="example-fields"><div><dt>input · source folder</dt><dd><code>./photos</code></dd></div><div><dt>output · destination folder</dt><dd><code>./small</code></dd></div><div><dt>width · output width</dt><dd><code>800</code></dd></div><div><dt>quality · jpeg quality</dt><dd><code>85</code></dd></div></dl><p>Choose values in the generated desktop form; its Run control starts the original script.</p>
</section>
<section class="example-step example-report" aria-labelledby="example-step-2">
<h2 id="example-step-2"><span>2 · Command to inspect</span> The same options go to the existing CLI</h2>
<pre><code>node fixtures/resize.js \
  --input ./photos \
  --output ./small \
  --width 800 \
  --quality 85</code></pre><p>GUI4CLI wraps this local script. It does not rewrite its behavior or make a portable app.</p>
</section>
<section class="example-step" aria-labelledby="example-step-3">
<h2 id="example-step-3"><span>3 · Output and exit</span> See what ran and whether it finished</h2>
<pre><code>Resizing (fixture, no files touched)
{
  "output": "./small",
  "width": "800",
  "quality": "85",
  "input": "./photos"
}</code></pre><p><strong>Exit code: 0</strong></p><p class="example-payoff">You can confirm the chosen options reached the script without retyping a command.</p>
</section>
<p class="value-note">Output checked by running the harmless fixture directly. The window is illustrative here; this example creates no images.</p>
<p class="example-links"><a href="#quick-start">Open the fixture in GUI4CLI</a></p>
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
