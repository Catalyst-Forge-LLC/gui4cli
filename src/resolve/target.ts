import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { Gui4CliError } from "../errors.js";

type Pkg = {
  main?: string;
  bin?: string | Record<string, string>;
};

export async function resolveTarget(input: string | undefined, entry: string | undefined, cwd: string): Promise<{
  target: string;
  cwd: string;
}> {
  if (entry) {
    const target = resolvePath(entry, cwd);
    assertFile(target, `Could not find the entry file at ${entry}.`);
    return { target, cwd: dirname(target) };
  }

  if (!input) {
    throw new Gui4CliError(
      "Pass a script file or a project folder.",
      "Example: gui4cli fixtures/resize.js",
    );
  }

  const path = resolvePath(input, cwd);
  if (!existsSync(path)) {
    throw new Gui4CliError(
      `Could not find ${input}.`,
      "Check the path, or pass --entry if the script lives somewhere else.",
    );
  }

  const info = await stat(path);
  if (info.isFile()) {
    return { target: path, cwd: dirname(path) };
  }
  if (info.isDirectory()) {
    const fromPkg = await entryFromPackage(path);
    return { target: fromPkg, cwd: path };
  }

  throw new Gui4CliError(`Could not use ${input} as a script or folder.`);
}

function resolvePath(input: string, cwd: string): string {
  return isAbsolute(input) ? input : resolve(cwd, input);
}

function assertFile(path: string, message: string): void {
  if (!existsSync(path)) {
    throw new Gui4CliError(message);
  }
}

async function entryFromPackage(dir: string): Promise<string> {
  const pkgPath = resolve(dir, "package.json");
  if (!existsSync(pkgPath)) {
    throw new Gui4CliError(
      `No package.json in ${dir}.`,
      "Pass a script file, or use --entry path/to/cli.js.",
    );
  }
  const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as Pkg;
  const bin =
    typeof pkg.bin === "string"
      ? pkg.bin
      : pkg.bin
        ? Object.values(pkg.bin)[0]
        : undefined;
  const rel = bin ?? pkg.main;
  if (!rel) {
    throw new Gui4CliError(
      `package.json in ${dir} has no bin or main field.`,
      "Add one, or run gui4cli --entry path/to/cli.js.",
    );
  }
  const target = resolve(dir, rel);
  assertFile(target, `package.json points at ${rel}, but that file is missing.`);
  return target;
}
