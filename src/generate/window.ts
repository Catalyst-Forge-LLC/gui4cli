import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { FormSpec, FormValues } from "../schema/form.js";
import { windowAppJs, windowStyles } from "./window-app.js";

export type WindowPayload = {
  spec: FormSpec;
  values: FormValues;
  nodePath: string;
  lastRunPath: string;
  platform: NodeJS.Platform;
};

export async function writeWindowApp(payload: WindowPayload): Promise<string> {
  const dir = join(tmpdir(), `gui4cli-window-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(payload.spec.title)}</title>
    <style>${windowStyles}</style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(payload.spec.title)}</h1>
      <p class="desc">${escapeHtml(payload.spec.description ?? "Fill the form, review the command, then Run.")}</p>
      <p id="status" class="muted" data-phase="ready">Ready</p>
    </header>
    <main>
      <form id="form"></form>
      <section>
        <h2>Command preview</h2>
        <pre id="preview" class="preview"></pre>
        <div class="actions">
          <button type="button" id="run">Run</button>
          <button type="button" id="cancel" disabled>Cancel</button>
          <span id="result" class="muted"></span>
        </div>
      </section>
      <section>
        <h2>Output</h2>
        <pre id="output" class="output"></pre>
      </section>
    </main>
    <script type="module" src="./app.js"></script>
  </body>
</html>
`;
  await writeFile(join(dir, "index.html"), html, "utf8");
  await writeFile(join(dir, "app.js"), windowAppJs, "utf8");
  await writeFile(
    join(dir, "payload.js"),
    `export const payload = ${JSON.stringify(payload, null, 2)};\n`,
    "utf8",
  );
  return dir;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
