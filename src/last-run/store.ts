import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { formValuesSchema, type FormValues } from "../schema/form.js";

export function lastRunPath(target: string): string {
  const hash = createHash("sha1").update(target).digest("hex").slice(0, 16);
  return join(homedir(), ".gui4cli", "lastrun", `${hash}.json`);
}

export async function loadLastRun(target: string): Promise<FormValues | null> {
  try {
    const raw = JSON.parse(await readFile(lastRunPath(target), "utf8"));
    return formValuesSchema.parse(raw);
  } catch {
    return null;
  }
}

export async function saveLastRun(target: string, values: FormValues): Promise<void> {
  const path = lastRunPath(target);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(values, null, 2)}\n`, "utf8");
}
