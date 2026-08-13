import { labelFromName, type Field, type FieldType } from "../schema/form.js";

const SKIP_FLAGS = new Set(["help", "version", "h", "V", "v"]);

export function shouldSkipFlag(name: string): boolean {
  return SKIP_FLAGS.has(name.replace(/^--?/, ""));
}

export function nameFromLongFlag(longFlag: string): string {
  return longFlag.replace(/^--/, "");
}

export function inferType(hint: string | undefined, help: string | undefined, name: string): FieldType {
  const blob = `${hint ?? ""} ${help ?? ""} ${name}`.toLowerCase();
  if (/\b(dir|directory|folder)\b/.test(blob)) return "directory";
  if (/\b(file|path|filename)\b/.test(blob)) return "file";
  if (/\b(number|int|integer|float|count|width|height|quality|port)\b/.test(blob)) {
    return "number";
  }
  return "string";
}

export function parseFlagSpec(spec: string): {
  shortFlag?: string;
  longFlag: string;
  name: string;
  boolean: boolean;
  typeHint?: string;
} | null {
  const parts = spec.split(",").map((part) => part.trim()).filter(Boolean);
  let shortFlag: string | undefined;
  let longFlag = "";
  let typeHint: string | undefined;
  let boolean = true;

  for (const part of parts) {
    const short = part.match(/^(-[A-Za-z0-9])$/);
    if (short) {
      shortFlag = short[1];
      continue;
    }
    const long = part.match(/^--([A-Za-z0-9][A-Za-z0-9-]*)(?:\s*[<[]([^>\]]+)[>\]])?/);
    if (long) {
      longFlag = `--${long[1]}`;
      if (long[2]) {
        boolean = false;
        typeHint = long[2];
      }
    }
  }

  if (!longFlag && shortFlag) {
    longFlag = `--${shortFlag.slice(1)}`;
  }
  if (!longFlag) return null;

  const name = nameFromLongFlag(longFlag);
  if (shouldSkipFlag(name)) return null;
  return { shortFlag, longFlag, name, boolean, typeHint };
}

export function fieldFromFlag(input: {
  name: string;
  longFlag: string;
  shortFlag?: string;
  type?: FieldType;
  typeHint?: string;
  help?: string;
  required?: boolean;
  default?: string | number | boolean;
  choices?: string[];
  boolean?: boolean;
  positional?: boolean;
}): Field {
  const type: FieldType = input.boolean
    ? "boolean"
    : input.choices && input.choices.length > 0
      ? "choice"
      : (input.type ?? inferType(input.typeHint, input.help, input.name));

  return {
    name: input.name,
    longFlag: input.longFlag,
    shortFlag: input.shortFlag,
    type,
    label: labelFromName(input.name),
    help: input.help,
    required: Boolean(input.required),
    default: input.default,
    choices: input.choices,
    positional: input.positional,
  };
}

export function mergeFields(base: Field[], overlay: Field[]): Field[] {
  const byName = new Map(base.map((field) => [field.name, field]));
  for (const field of overlay) {
    const existing = byName.get(field.name);
    byName.set(field.name, existing ? { ...existing, ...field } : field);
  }
  return [...byName.values()];
}
