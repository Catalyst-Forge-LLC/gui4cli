import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "choice",
  "file",
  "directory",
]);

export type FieldType = z.infer<typeof fieldTypeSchema>;

export const fieldSchema = z.object({
  name: z.string().min(1),
  longFlag: z.string().min(1),
  shortFlag: z.string().optional(),
  type: fieldTypeSchema,
  label: z.string().min(1),
  help: z.string().optional(),
  required: z.boolean(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  choices: z.array(z.string()).optional(),
  positional: z.boolean().optional(),
});

export type Field = z.infer<typeof fieldSchema>;

export const detectSourceSchema = z.enum([
  "commander",
  "yargs",
  "jsdoc",
  "config",
  "help",
  "merged",
]);

export type DetectSource = z.infer<typeof detectSourceSchema>;

export const formSpecSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  target: z.string().min(1),
  cwd: z.string().min(1),
  source: detectSourceSchema,
  fields: z.array(fieldSchema),
  window: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional(),
});

export type FormSpec = z.infer<typeof formSpecSchema>;

export const formValuesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export type FormValues = z.infer<typeof formValuesSchema>;

export function labelFromName(name: string): string {
  return name
    .replace(/^--?/, "")
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
