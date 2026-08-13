import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formSpecSchema } from "../schema/form.js";
import { writeWindowApp } from "./window.js";

describe("writeWindowApp", () => {
  it("writes index.html, app.js, and payload.js", async () => {
    const spec = formSpecSchema.parse({
      title: "Resize",
      target: "/tmp/resize.js",
      cwd: "/tmp",
      source: "commander",
      fields: [
        {
          name: "input",
          longFlag: "--input",
          type: "directory",
          label: "Input",
          required: true,
        },
      ],
    });
    const dir = await writeWindowApp({
      spec,
      values: { input: "" },
      nodePath: process.execPath,
      lastRunPath: "/tmp/lastrun.json",
      platform: process.platform,
    });
    expect(readFileSync(join(dir, "index.html"), "utf8")).toContain("Resize");
    expect(readFileSync(join(dir, "app.js"), "utf8")).toContain("buildArgv");
    expect(readFileSync(join(dir, "payload.js"), "utf8")).toContain("--input");
  });
});
