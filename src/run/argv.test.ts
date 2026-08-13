import { describe, expect, it } from "vitest";
import { fieldFromFlag } from "../detect/flags.js";
import { buildArgv, missingRequired, valuesFromDefaults } from "./argv.js";

const fields = [
  fieldFromFlag({ name: "input", longFlag: "--input", type: "directory", required: true }),
  fieldFromFlag({ name: "width", longFlag: "--width", type: "number", default: 1200 }),
  fieldFromFlag({ name: "verbose", longFlag: "--verbose", boolean: true }),
];

describe("buildArgv", () => {
  it("omits empty optionals and false flags", () => {
    const values = { ...valuesFromDefaults(fields), input: "./photos" };
    expect(buildArgv(fields, values)).toEqual(["--input", "./photos", "--width", "1200"]);
  });

  it("includes true boolean flags", () => {
    const values = { input: "./photos", width: 800, verbose: true };
    expect(buildArgv(fields, values)).toEqual(["--input", "./photos", "--width", "800", "--verbose"]);
  });

  it("lists missing required labels", () => {
    expect(missingRequired(fields, valuesFromDefaults(fields))).toEqual(["Input"]);
  });
});
