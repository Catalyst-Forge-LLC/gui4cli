import type { Field } from "../schema/form.js";
import { objectProps, parseSource, primitiveLiteral, stringLiteral, walkCalls } from "./ast.js";
import { fieldFromFlag, parseFlagSpec } from "./flags.js";

export function detectCommander(fileName: string, source: string): Field[] {
  const sf = parseSource(fileName, source);
  const fields: Field[] = [];

  walkCalls(sf, (call, method) => {
    if (method !== "option" && method !== "requiredOption") return;
    const spec = stringLiteral(call.arguments[0]);
    if (!spec) return;
    const parsed = parseFlagSpec(spec);
    if (!parsed) return;

    const help = stringLiteral(call.arguments[1]);
    let defaultValue = primitiveLiteral(call.arguments[2]);
    let choices: string[] | undefined;

    const obj = objectProps(call.arguments[1]);
    if (obj.size > 0) {
      const described = stringLiteral(obj.get("description") ?? obj.get("desc"));
      defaultValue = primitiveLiteral(obj.get("default")) ?? defaultValue;
    }

    fields.push(
      fieldFromFlag({
        name: parsed.name,
        longFlag: parsed.longFlag,
        shortFlag: parsed.shortFlag,
        typeHint: parsed.typeHint,
        help,
        required: method === "requiredOption",
        default: defaultValue,
        choices,
        boolean: parsed.boolean,
      }),
    );
  });

  return uniqueFields(fields);
}

function uniqueFields(fields: Field[]): Field[] {
  const seen = new Set<string>();
  return fields.filter((field) => {
    if (seen.has(field.name)) return false;
    seen.add(field.name);
    return true;
  });
}
