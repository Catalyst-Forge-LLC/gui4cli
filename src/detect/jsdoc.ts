import type { Field } from "../schema/form.js";
import { fieldFromFlag, shouldSkipFlag } from "./flags.js";

const PARAM = /@param\s+(?:\{([^}]+)\}\s+)?(?:\[)?(-{0,2}[\w-]+)(?:\])?\s*-?\s*(.*)/g;

export function detectJsdoc(source: string): Field[] {
  const fields: Field[] = [];
  for (const match of source.matchAll(PARAM)) {
    const typeHint = match[1];
    const rawName = match[2] ?? "";
    const help = match[3]?.trim() || undefined;
    const name = rawName.replace(/^--/, "");
    if (!name || shouldSkipFlag(name)) continue;
    fields.push(
      fieldFromFlag({
        name,
        longFlag: `--${name}`,
        typeHint,
        help,
        required: !match[0].includes("["),
        boolean: /boolean|flag/i.test(typeHint ?? ""),
      }),
    );
  }
  return fields;
}
