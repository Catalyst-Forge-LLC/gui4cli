import { describe, expect, it } from "vitest";
import { parseHelpText } from "./help.js";

describe("parseHelpText", () => {
  it("reads commander-style help lines", () => {
    const fields = parseHelpText(`
Usage: resize [options]

Options:
  -i, --input <path>     source folder
  -w, --width <number>   output width (default: "1200")
  --verbose              print extra logs
  -h, --help             display help for command
`);
    expect(fields.map((field) => field.name)).toEqual(["input", "width", "verbose"]);
    expect(fields.find((field) => field.name === "width")?.type).toBe("number");
  });
});
