import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { Gui4CliError } from "../errors.js";
import { formSpecSchema, labelFromName, type DetectSource, type Field, type FormSpec } from "../schema/form.js";
import { loadConfig, type Gui4CliConfig } from "../config/load.js";
import { detectCommander } from "./commander.js";
import { collectHelpText, parseHelpText } from "./help.js";
import { detectJsdoc } from "./jsdoc.js";
import { detectYargs } from "./yargs.js";
import { mergeFields } from "./flags.js";

export async function detectForm(target: string, cwd: string): Promise<FormSpec> {
  const source = await readFile(target, "utf8");
  const config = await loadConfig(target, cwd);

  const commander = detectCommander(target, source);
  const yargs = detectYargs(target, source);
  const jsdoc = detectJsdoc(source);

  let fields: Field[] = [];
  let detectSource: DetectSource = "merged";

  if (commander.length >= yargs.length && commander.length > 0) {
    fields = commander;
    detectSource = "commander";
  } else if (yargs.length > 0) {
    fields = yargs;
    detectSource = "yargs";
  } else if (jsdoc.length > 0) {
    fields = jsdoc;
    detectSource = "jsdoc";
  }

  if (fields.length === 0) {
    try {
      const help = parseHelpText(await collectHelpText(target, cwd));
      if (help.length > 0) {
        fields = help;
        detectSource = "help";
      }
    } catch {
      // Help can have side effects or hang; config is the escape hatch.
    }
  }

  if (config?.fields) {
    fields = mergeFields(fields, config.fields);
    detectSource = fields.length > 0 ? "merged" : "config";
  }

  if (fields.length === 0) {
    throw new Gui4CliError(
      "Couldn't detect arguments for this script.",
      "Add a gui4cli.config.js next to the script with a fields object, then try again.",
    );
  }

  const title = config?.title ?? labelFromName(basename(target).replace(/\.[cm]?[jt]s$/, ""));
  const spec = formSpecSchema.parse({
    title,
    description: config?.description,
    target,
    cwd: config?.cwd ?? cwd,
    source: detectSource,
    fields,
    window: config?.window,
  });
  return spec;
}
