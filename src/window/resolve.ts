import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { delimiter, dirname, join } from "node:path";
import { Gui4CliError } from "../errors.js";

const require = createRequire(import.meta.url);

export type WindowdLaunch = {
  command: string;
  prefixArgs: string[];
  cli: string;
};

export function resolveWindowdLaunch(): WindowdLaunch {
  let windowdRoot: string;
  try {
    windowdRoot = dirname(require.resolve("windowd/package.json"));
  } catch {
    throw new Gui4CliError(
      "Could not find the windowd package.",
      "From this repo run: pnpm install",
    );
  }

  const cli = join(windowdRoot, "bin", "cli.ts");
  if (!existsSync(cli)) {
    throw new Gui4CliError(
      "windowd is installed but its launcher file is missing.",
      `Expected ${cli}`,
    );
  }

  const bun = findOnPath("bun");
  if (bun) {
    return { command: bun, prefixArgs: [], cli };
  }

  const tsxCli = resolveTsxCli();
  return { command: process.execPath, prefixArgs: [tsxCli], cli };
}

function resolveTsxCli(): string {
  try {
    const tsxRoot = dirname(require.resolve("tsx/package.json"));
    const cli = join(tsxRoot, "dist", "cli.mjs");
    if (existsSync(cli)) return cli;
  } catch {
    // Fall through.
  }
  throw new Gui4CliError(
    "Could not start the desktop window.",
    "windowd needs Bun (https://bun.sh) or tsx. From this repo run: pnpm install",
  );
}

function findOnPath(name: string): string | undefined {
  const exts = process.platform === "win32" ? [".exe", ".cmd", ""] : [""];
  for (const dir of (process.env.PATH ?? "").split(delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const candidate = join(dir, `${name}${ext}`);
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}
