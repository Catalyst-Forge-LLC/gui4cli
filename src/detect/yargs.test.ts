import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { detectYargs } from "./yargs.js";

const fixture = readFileSync(resolve("fixtures/clean.js"), "utf8");

describe("detectYargs", () => {
  it("reads the clean fixture options", () => {
    const fields = detectYargs("fixtures/clean.js", fixture);
    const names = fields.map((field) => field.name);
    expect(names).toEqual(["input", "pattern", "dry-run"]);
    expect(fields.find((field) => field.name === "input")?.required).toBe(true);
    expect(fields.find((field) => field.name === "dry-run")?.type).toBe("boolean");
    expect(fields.find((field) => field.name === "pattern")?.default).toBe("*.tmp");
  });
});
