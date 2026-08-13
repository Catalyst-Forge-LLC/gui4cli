import ts from "typescript";
import type { Field, FieldType } from "../schema/form.js";
import { objectProps, parseSource, primitiveLiteral, stringLiteral, walkCalls } from "./ast.js";
import { fieldFromFlag, nameFromLongFlag, shouldSkipFlag } from "./flags.js";

const YARGS_TYPES = new Set(["string", "number", "boolean", "array"]);

export function detectYargs(fileName: string, source: string): Field[] {
  const sf = parseSource(fileName, source);
  const fields: Field[] = [];

  walkCalls(sf, (call, method) => {
    if (method !== "option" && method !== "options" && method !== "positional") return;

    if (method === "options") {
      const props = objectProps(call.arguments[0]);
      for (const [name, value] of props) {
        const field = fieldFromYargs(name, objectProps(value), false);
        if (field) fields.push(field);
      }
      return;
    }

    const name = stringLiteral(call.arguments[0]);
    if (!name || shouldSkipFlag(name)) return;
    const field = fieldFromYargs(name, objectProps(call.arguments[1]), method === "positional");
    if (field) fields.push(field);
  });

  return uniqueFields(fields);
}

function fieldFromYargs(
  rawName: string,
  props: Map<string, ts.Expression>,
  positional: boolean,
): Field | null {
  const name = nameFromLongFlag(rawName.startsWith("-") ? rawName : `--${rawName}`);
  if (shouldSkipFlag(name)) return null;

  const typeText = stringLiteral(props.get("type"));
  const type: FieldType | undefined =
    typeText && YARGS_TYPES.has(typeText)
      ? typeText === "array"
        ? "string"
        : (typeText as FieldType)
      : undefined;

  const alias = stringLiteral(props.get("alias"));
  const help = stringLiteral(props.get("describe") ?? props.get("description") ?? props.get("desc"));
  const required =
    primitiveLiteral(props.get("demandOption")) === true ||
    primitiveLiteral(props.get("required")) === true ||
    primitiveLiteral(props.get("demand")) === true;
  const defaultValue = primitiveLiteral(props.get("default"));
  const choices = stringArray(props.get("choices"));

  return fieldFromFlag({
    name,
    longFlag: `--${name}`,
    shortFlag: alias ? (alias.startsWith("-") ? alias : `-${alias}`) : undefined,
    type,
    help,
    required: required || positional,
    default: defaultValue,
    choices,
    boolean: type === "boolean",
    positional,
  });
}

function stringArray(node: ts.Expression | undefined): string[] | undefined {
  if (!node || !ts.isArrayLiteralExpression(node)) return undefined;
  const values = node.elements
    .map((el) => stringLiteral(el))
    .filter((value): value is string => Boolean(value));
  return values.length > 0 ? values : undefined;
}

function uniqueFields(fields: Field[]): Field[] {
  const seen = new Set<string>();
  return fields.filter((field) => {
    if (seen.has(field.name)) return false;
    seen.add(field.name);
    return true;
  });
}
