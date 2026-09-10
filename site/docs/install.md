---
title: Install
---

Requires **Node.js 20+**.

## One-off

```bash
npx gui4cli my-script.js
```

## Global

```bash
npm install -g gui4cli
gui4cli my-script.js
```

or `pnpm add -g gui4cli`.

## From a checkout

```bash
pnpm install
pnpm test
pnpm exec tsx src/cli.ts fixtures/resize.js --json
pnpm dev
```

`pnpm dev` opens `fixtures/resize.js` (Commander). `fixtures/clean.js` is the yargs fixture.

The first windowd launch may download the NW.js runtime (~200 MB). If the window opens and closes immediately, run from a normal terminal. Cursor's JavaScript Debug Terminal injects inspector flags that tear NW.js down.
