import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { formSpecSchema } from "../schema/form.js";
import { defaultBuildDir, slugify, writeBuildProject } from "./project.js";

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

describe("writeBuildProject", () => {
  it("slugifies the default folder name", () => {
    expect(slugify("Image Resizer")).toBe("image-resizer");
    expect(defaultBuildDir("Resize", "/apps")).toMatch(/resize-gui$/);
  });

  it("writes a reusable windowd project without touching the original script", async () => {
    const outDir = join(tmpdir(), `gui4cli-build-${Date.now()}`);
    const dir = await writeBuildProject({
      spec,
      values: { input: "" },
      outDir,
      lastRunPath: join(outDir, ".lastrun.json"),
    });
    expect(existsSync(join(dir, "index.html"))).toBe(true);
    expect(existsSync(join(dir, "package.json"))).toBe(true);
    expect(existsSync(join(dir, "runner.js"))).toBe(true);
    expect(existsSync(join(dir, "README.md"))).toBe(true);
    expect(existsSync(join(dir, "vite.config.js"))).toBe(true);
  });

  it("refuses a non-empty folder without --force", async () => {
    const outDir = join(tmpdir(), `gui4cli-build-exists-${Date.now()}`);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "keep.txt"), "nope\n");
    await expect(
      writeBuildProject({
        spec,
        values: { input: "" },
        outDir,
        lastRunPath: join(outDir, ".lastrun.json"),
      }),
    ).rejects.toThrow(/already exists/);
  });
});
