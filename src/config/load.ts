import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { Gui4CliError } from "../errors.js";
import { fieldSchema, type Field } from "../schema/form.js";

const configFieldSchema = fieldSchema.partial().extend({
  name: z.string().min(1),
  longFlag: z.string().min(1).optional(),
  label: z.string().min(1).optional(),
  type: fieldSchema.shape.type.optional(),
  required: z.boolean().optional(),
});

const configSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  entry: z.string().optional(),
  cwd: z.string().optional(),
  window: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional(),
  fields: z.array(configFieldSchema).optional(),
});

export type Gui4CliConfig = {
  title?: string;
  description?: string;
  entry?: string;
  cwd?: string;
  window?: { width?: number; height?: number };
  fields?: Field[];
};

export async function loadConfig(target: string, cwd: string): Promise<Gui4CliConfig | null> {
  const searchDirs = [dirname(target), cwd];
  for (const dir of searchDirs) {
    for (const name of ["gui4cli.config.js", "gui4cli.config.mjs", "gui4cli.json"]) {
      const path = join(dir, name);
      if (!existsSync(path)) continue;
      return readConfigFile(path);
    }
  }
  return null;
}

async function readConfigFile(path: string): Promise<Gui4CliConfig> {
  try {
    const raw = path.endsWith(".json")
      ? JSON.parse(await readFile(path, "utf8"))
      : ((await import(pathToFileURL(path).href)) as { default?: unknown }).default;
    const parsed = configSchema.parse(raw);
    return {
      ...parsed,
      fields: parsed.fields?.map((field) =>
        fieldSchema.parse({
          name: field.name,
          longFlag: field.longFlag ?? `--${field.name}`,
          shortFlag: field.shortFlag,
          type: field.type ?? "string",
          label: field.label ?? field.name,
          help: field.help,
          required: field.required ?? false,
          default: field.default,
          choices: field.choices,
          positional: field.positional,
        }),
      ),
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Gui4CliError(`The config file at ${path} is not valid.`, detail);
  }
}
