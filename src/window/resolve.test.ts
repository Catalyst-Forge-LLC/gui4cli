import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveWindowdLaunch } from "./resolve.js";

describe("resolveWindowdLaunch", () => {
  it("points at a real windowd cli and a real runner", () => {
    const launch = resolveWindowdLaunch();
    expect(existsSync(launch.cli)).toBe(true);
    expect(existsSync(launch.command)).toBe(true);
    for (const arg of launch.prefixArgs) {
      expect(existsSync(arg)).toBe(true);
    }
  });
});
