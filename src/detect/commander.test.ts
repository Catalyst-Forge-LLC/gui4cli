import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { detectCommander } from "./commander.js";

const fixture = readFileSync(resolve("fixtures/resize.js"), "utf8");

describe("detectCommander", () => {
  it("reads the resize fixture options", () => {
    const fields = detectCommander("fixtures/resize.js", fixture);
    const names = fields.map((field) => field.name);
    expect(names).toEqual(["input", "output", "width", "quality", "verbose"]);
    expect(fields.find((field) => field.name === "input")?.required).toBe(true);
    expect(fields.find((field) => field.name === "width")?.type).toBe("number");
    expect(fields.find((field) => field.name === "verbose")?.type).toBe("boolean");
    expect(fields.find((field) => field.name === "output")?.default).toBe("./out");
  });
});
