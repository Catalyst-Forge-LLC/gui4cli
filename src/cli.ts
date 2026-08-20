import { parseArgs } from "node:util";
import { detectForm } from "./detect/index.js";
import { formatUserError, Gui4CliError } from "./errors.js";
import { defaultBuildDir, writeBuildProject } from "./generate/project.js";
import { writeWindowApp } from "./generate/window.js";
import { lastRunPath, loadLastRun } from "./last-run/store.js";
import { resolveTarget } from "./resolve/target.js";
import { valuesFromDefaults } from "./run/argv.js";
import { openWindow } from "./window/open.js";

const HELP = `GUI4CLI — turn a Node CLI script into a desktop form.

Usage:
  gui4cli <script-or-folder> [--entry <path>] [--json]
  gui4cli <script-or-folder> --build [--out <dir>] [--force]

Options:
  --entry <path>   Use this file as the script (overrides folder bin/main)
  --json           Print the detected form and exit (no window)
  --build          Write a reusable project folder and exit (no .exe)
  --out <dir>      Folder for --build (default: <title>-gui in the current directory)
  --force          Replace an existing --out folder
  --help           Show this help

Examples:
  gui4cli fixtures/resize.js
  gui4cli fixtures/resize.js --build
  gui4cli . --entry bin/cli.js
`;

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      entry: { type: "string" },
      json: { type: "boolean", default: false },
      build: { type: "boolean", default: false },
      out: { type: "string" },
      force: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help || argv.includes("-h")) {
    process.stdout.write(HELP);
    return 0;
  }

  if (values.json && values.build) {
    throw new Gui4CliError("Use either --json or --build, not both.");
  }

  const { target, cwd } = await resolveTarget(positionals[0], values.entry, process.cwd());
  const spec = await detectForm(target, cwd);
  const last = await loadLastRun(target);
  const formValues = { ...valuesFromDefaults(spec.fields), ...last };

  if (values.json) {
    process.stdout.write(`${JSON.stringify({ spec, values: formValues }, null, 2)}\n`);
    return 0;
  }

  if (values.build) {
    const outDir = values.out ?? defaultBuildDir(spec.title, process.cwd());
    const dir = await writeBuildProject({
      spec,
      values: formValues,
      outDir,
      lastRunPath: lastRunPath(target),
      force: values.force,
    });
    process.stdout.write(`Wrote ${dir}\nRun it with: npx --yes windowd\n`);
    process.stdout.write(`The original script was not changed: ${spec.target}\n`);
    return 0;
  }

  const dir = await writeWindowApp({
    spec,
    values: formValues,
    nodePath: process.execPath,
    lastRunPath: lastRunPath(target),
    platform: process.platform,
  });
  process.stderr.write(`Opening ${spec.title} (${spec.fields.length} fields, detected via ${spec.source})…\n`);
  return openWindow(dir, spec);
}

const entry = process.argv[1] ?? "";
if (entry.endsWith("cli.ts") || entry.endsWith("cli.js") || entry.endsWith("gui4cli.js")) {
  main().then(
    (code) => process.exit(code),
    (error: unknown) => {
      process.stderr.write(`${formatUserError(error)}\n`);
      process.exit(error instanceof Gui4CliError ? 2 : 1);
    },
  );
}
