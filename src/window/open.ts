import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { Gui4CliError } from "../errors.js";
import type { FormSpec } from "../schema/form.js";

const require = createRequire(import.meta.url);

export async function openWindow(dir: string, spec: FormSpec): Promise<number> {
  const bin = resolveWindowd();
  const width = String(spec.window?.width ?? 720);
  const height = String(spec.window?.height ?? 740);
  return new Promise((resolve, reject) => {
    const child = spawn(bin, ["--title", spec.title, "--width", width, "--height", height], {
      cwd: dir,
      stdio: "inherit",
      shell: process.platform === "win32" && bin.endsWith(".cmd"),
    });
    child.on("error", (error) => {
      reject(
        new Gui4CliError(
          "Could not open the desktop window.",
          `${error.message}\nIs windowd installed? First launch may download the NW.js runtime (~200 MB).`,
        ),
      );
    });
    child.on("close", (code) => resolve(code ?? 0));
  });
}

function resolveWindowd(): string {
  try {
    const binDir = join(dirname(require.resolve("windowd/package.json")), "..", ".bin");
    const shim = join(binDir, process.platform === "win32" ? "windowd.cmd" : "windowd");
    if (existsSync(shim)) return shim;
  } catch {
    // Fall through to PATH.
  }
  return "windowd";
}
