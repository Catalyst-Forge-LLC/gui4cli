import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { detectForm } from "./index.js";

async function fixture(config?: object) {
  const dir = await mkdtemp(join(tmpdir(), "gui4cli-detect-"));
  const target = join(dir, "script.cjs");
  const marker = join(dir, "executed.txt");
  await writeFile(target, `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'executed');\nconsole.log('  --from-help <value>  help field');\n`);
  if (config) await writeFile(join(dir, "gui4cli.json"), JSON.stringify(config));
  return { dir, target, marker };
}

describe("configured detection", () => {
  it("uses explicit fields without executing the target for help", async () => {
    const f = await fixture({ fields: [{ name: "input", type: "file" }] });
    try {
      const spec = await detectForm(f.target, f.dir);
      expect(existsSync(f.marker)).toBe(false);
      expect(spec.fields.map((field) => field.name)).toEqual(["input"]);
    } finally { await rm(f.dir, { recursive: true, force: true }); }
  });

  it("keeps static fields and lets config override matching fields", async () => {
    const f = await fixture({ fields: [{ name: "width", type: "number", default: 900 }, { name: "output", type: "file" }] });
    try {
      await writeFile(f.target, `const program = new Command();\nprogram.option('--width <number>', 'width', '800').option('--verbose', 'logs');\n`);
      const spec = await detectForm(f.target, f.dir);
      expect(spec.fields.map((field) => field.name)).toEqual(["width", "verbose", "output"]);
      expect(spec.fields[0].default).toBe(900);
      expect(existsSync(f.marker)).toBe(false);
    } finally { await rm(f.dir, { recursive: true, force: true }); }
  });

  it("retains help fallback when config only changes presentation", async () => {
    const f = await fixture({ title: "My script" });
    try {
      const spec = await detectForm(f.target, f.dir);
      expect(spec.title).toBe("My script");
      expect(spec.fields.map((field) => field.name)).toEqual(["from-help"]);
      expect(existsSync(f.marker)).toBe(true);
    } finally { await rm(f.dir, { recursive: true, force: true }); }
  });
});
