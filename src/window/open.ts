import { spawn } from "node:child_process";
import { Gui4CliError } from "../errors.js";
import type { FormSpec } from "../schema/form.js";
import { windowProcessEnv } from "./env.js";
import { resolveWindowdLaunch } from "./resolve.js";

const QUICK_EXIT_MS = 5000;

export async function openWindow(dir: string, spec: FormSpec): Promise<number> {
  const first = await spawnWindowd(dir, spec);
  if (first.elapsedMs < QUICK_EXIT_MS && first.code === 0) {
    process.stderr.write("The window closed right away. Opening it again…\n");
    return (await spawnWindowd(dir, spec)).code;
  }
  return first.code;
}

async function spawnWindowd(dir: string, spec: FormSpec): Promise<{ code: number; elapsedMs: number }> {
  const launch = resolveWindowdLaunch();
  const width = String(spec.window?.width ?? 960);
  const height = String(spec.window?.height ?? 620);
  const artifacts = process.env.GUI4CLI_WINDOW_LOGS;
  const args = [
    ...launch.prefixArgs,
    launch.cli,
    "--title",
    spec.title,
    "--width",
    width,
    "--height",
    height,
    ...(artifacts ? ["--artifacts", artifacts, "--debug"] : []),
  ];
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn(launch.command, args, {
      cwd: dir,
      stdio: "inherit",
      env: windowProcessEnv(),
    });
    child.on("error", (error) => {
      reject(
        new Gui4CliError(
          "Could not open the desktop window.",
          `${error.message}\nwindowd is installed. If this keeps failing, install Bun from https://bun.sh and run pnpm dev again.`,
        ),
      );
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 0, elapsedMs: Date.now() - started });
    });
  });
}
