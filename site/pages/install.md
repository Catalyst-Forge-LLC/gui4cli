---
title: Install
description: Install GUI4CLI from npm.
order: 1
---

Requires **Node.js 20+**.

### One-off

```bash
npx gui4cli my-script.js
```

### Global

```bash
npm install -g gui4cli
gui4cli my-script.js
```

or `pnpm add -g gui4cli`.

### From this repo

```bash
pnpm install
pnpm test
pnpm exec tsx src/cli.ts fixtures/resize.js --json
pnpm dev
```

`pnpm dev` opens the Commander fixture. The first windowd launch may download NW.js (~200 MB). If the window flashes and closes, run from a normal terminal — not Cursor's JavaScript Debug Terminal.

`--json` prints the form and exits. Use that when you cannot open a GUI.

### Reusable folder

```bash
gui4cli my-script.js --build
```

Then `npx --yes windowd` inside the folder it wrote. The original script is not copied or changed.

Guides live in the [docs](/docs).
