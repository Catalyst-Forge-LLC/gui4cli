import { spawn } from "node:child_process";
import type { Field } from "../schema/form.js";
import { fieldFromFlag, parseFlagSpec } from "./flags.js";

const HELP_LINE = /^\s*(-\S.*?)\s{2,}(\S.*)?$/;

export function parseHelpText(text: string): Field[] {
  const fields: Field[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const match = line.match(HELP_LINE);
    if (!match) continue;
    const parsed = parseFlagSpec(match[1] ?? "");
    if (!parsed) continue;
    const help = (match[2] ?? "").replace(/\(default:.*\)/i, "").trim() || undefined;
    fields.push(
      fieldFromFlag({
        name: parsed.name,
        longFlag: parsed.longFlag,
        shortFlag: parsed.shortFlag,
        typeHint: parsed.typeHint,
        help,
        boolean: parsed.boolean,
      }),
    );
  }
  return fields;
}

export async function collectHelpText(target: string, cwd: string, timeoutMs = 4000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [target, "--help"], {
      cwd,
      env: { ...process.env, GUI4CLI_DETECT: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Timed out reading --help"));
    }, timeoutMs);
    child.stdout.on("data", (chunk: Buffer) => {
      out += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      out += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(out);
    });
  });
}
