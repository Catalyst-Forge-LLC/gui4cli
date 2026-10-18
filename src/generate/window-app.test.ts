import { spawn } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { detectForm } from "../detect/index.js";
import { windowAppJs } from "./window-app.js";

// Execute the generated renderer with a tiny DOM double and a real child process.
// NW.js has its own process.execPath; it must never be used to run the CLI.
class Element {
  textContent = "";
  dataset: Record<string, string> = {};
  children: Element[] = [];
  handlers: Record<string, () => void> = {};
  value = "";
  disabled = false;
  scrollHeight = 0;
  scrollTop = 0;
  appendChild(child: Element) { this.children.push(child); }
  replaceChildren() { this.children = []; }
  addEventListener(name: string, handler: () => void) { this.handlers[name] = handler; }
}

describe("generated desktop runner", () => {
  it("previews and runs the fixture with the supplied Node, even inside NW.js", async () => {
    const target = fileURLToPath(new URL("../../fixtures/resize.js", import.meta.url));
    const spec = await detectForm(target, dirname(target));
    const elements = new Map<string, Element>();
    const get = (id: string) => {
      if (!elements.has(id)) elements.set(id, new Element());
      return elements.get(id)!;
    };
    let completed: Promise<number | null> | undefined;
    const launch = vi.fn((...args: Parameters<typeof spawn>) => {
      const child = spawn(...args);
      completed = new Promise((resolve, reject) => {
        child.once("close", resolve);
        child.once("error", reject);
      });
      return child;
    });
    const renderer = windowAppJs.replace(/^import .*;\r?\n/gm, "");
    runInNewContext(renderer, {
      payload: {
        spec, values: { input: "./photos", output: "./small", width: 800, quality: 85 },
        nodePath: process.execPath, lastRunPath: "unused-test-path", platform: process.platform,
      },
      process: { execPath: "C:\\NW.js\\nw.exe", env: process.env },
      spawn: launch, writeFileSync: vi.fn(),
      document: { getElementById: get, createElement: () => new Element(), addEventListener: vi.fn() },
    });
    const quotedNode = /[\s"]/.test(process.execPath) ? '"' + process.execPath + '"' : process.execPath;
    expect(get("preview").textContent.startsWith(quotedNode + " ")).toBe(true);
    expect(get("preview").textContent).not.toContain("nw.exe");
    get("run").handlers.click();
    expect(launch).toHaveBeenCalledWith(process.execPath,
      [target, "--input", "./photos", "--output", "./small", "--width", "800", "--quality", "85"],
      expect.objectContaining({ cwd: dirname(target) }));
    expect(await completed).toBe(0);
    expect(get("output").children.map(child => child.textContent).join("")).toContain('"width": "800"');
    expect(get("status").textContent).toBe("Done");
    expect(get("result").textContent).toMatch(/^Exit code 0/);
  });
});
