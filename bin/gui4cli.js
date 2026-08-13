#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist/cli.js");

if (existsSync(dist)) {
  await import(pathToFileURL(dist).href);
} else {
  const { register } = await import("tsx/esm/api");
  register();
  await import(pathToFileURL(resolve(root, "src/cli.ts")).href);
}
