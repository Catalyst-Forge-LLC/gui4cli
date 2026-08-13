import type { Field, FormValues } from "../schema/form.js";

export function valuesFromDefaults(fields: Field[]): FormValues {
  const values: FormValues = {};
  for (const field of fields) {
    if (field.default !== undefined) {
      values[field.name] = coerce(field, field.default);
    } else if (field.type === "boolean") {
      values[field.name] = false;
    } else {
      values[field.name] = "";
    }
  }
  return values;
}

export function buildArgv(fields: Field[], values: FormValues): string[] {
  const argv: string[] = [];
  for (const field of fields) {
    const value = values[field.name];
    if (field.positional) {
      if (value !== undefined && value !== "" && value !== false) {
        argv.push(String(value));
      }
      continue;
    }
    if (field.type === "boolean") {
      if (value === true) argv.push(field.longFlag);
      continue;
    }
    if (value === undefined || value === "") continue;
    argv.push(field.longFlag, String(value));
  }
  return argv;
}

export function previewCommand(nodePath: string, target: string, argv: string[], cwd: string): string {
  const quoted = [nodePath, target, ...argv].map(quote).join(" ");
  return `${quoted}\n(in ${cwd})`;
}

export function missingRequired(fields: Field[], values: FormValues): string[] {
  return fields
    .filter((field) => field.required && field.type !== "boolean")
    .filter((field) => {
      const value = values[field.name];
      return value === undefined || value === "";
    })
    .map((field) => field.label);
}

function coerce(field: Field, value: string | number | boolean): string | number | boolean {
  if (field.type === "number") return typeof value === "number" ? value : Number(value);
  if (field.type === "boolean") return Boolean(value);
  return String(value);
}

function quote(part: string): string {
  return /[\s"]/.test(part) ? `"${part.replaceAll('"', '\\"')}"` : part;
}
