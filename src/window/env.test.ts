import { describe, expect, it } from "vitest";
import { windowProcessEnv } from "./env.js";

describe("windowProcessEnv", () => {
  it("strips inspector hooks that close Chromium/NW.js windows", () => {
    const env = windowProcessEnv({
      PATH: "/usr/bin",
      NODE_OPTIONS: "--enable-source-maps --inspect=127.0.0.1:9229",
      VSCODE_INSPECTOR_OPTIONS: "session=1",
      NODE_INSPECT_RESUME_ON_START: "1",
    });
    expect(env.PATH).toBe("/usr/bin");
    expect(env.NODE_OPTIONS).toBe("--enable-source-maps");
    expect(env.VSCODE_INSPECTOR_OPTIONS).toBeUndefined();
    expect(env.NODE_INSPECT_RESUME_ON_START).toBeUndefined();
  });
});
