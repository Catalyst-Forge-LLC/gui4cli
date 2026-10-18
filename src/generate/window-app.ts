export const windowAppJs = `import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { payload } from "./payload.js";

const statusEl = document.getElementById("status");
const formEl = document.getElementById("form");
const previewEl = document.getElementById("preview");
const outputEl = document.getElementById("output");
const runBtn = document.getElementById("run");
const cancelBtn = document.getElementById("cancel");
const resultEl = document.getElementById("result");

const values = { ...payload.values };
let child = null;
let startedAt = 0;

function setStatus(phase, text) {
  statusEl.dataset.phase = phase;
  statusEl.textContent = text;
}

function quote(part) {
  return /[\\s"]/.test(part) ? '"' + part.replaceAll('"', '\\\\"') + '"' : part;
}

function buildArgv() {
  const argv = [];
  for (const field of payload.spec.fields) {
    const value = values[field.name];
    if (field.positional) {
      if (value !== undefined && value !== "" && value !== false) argv.push(String(value));
      continue;
    }
    if (field.type === "boolean") {
      if (value === true) argv.push(field.longFlag);
      continue;
    }
    if (value === undefined || value === "") continue;
    argv.push(field.longFlag, String(value));
  }
  return argv;
}

function updatePreview() {
  const argv = buildArgv();
  previewEl.textContent = [payload.nodePath, payload.spec.target, ...argv].map(quote).join(" ")
    + "\\n(in " + payload.spec.cwd + ")";
}

function missingRequired() {
  return payload.spec.fields
    .filter((field) => field.required && field.type !== "boolean")
    .filter((field) => values[field.name] === undefined || values[field.name] === "")
    .map((field) => field.label);
}

function fieldControl(field) {
  const wrap = document.createElement("label");
  wrap.className = "field";
  const title = document.createElement("span");
  title.className = "field-label";
  title.textContent = field.label + (field.required ? " (required)" : "");
  wrap.appendChild(title);
  if (field.help) {
    const help = document.createElement("span");
    help.className = "field-help";
    help.textContent = field.help;
    wrap.appendChild(help);
  }

  let input;
  if (field.type === "boolean") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(values[field.name]);
    input.addEventListener("change", () => {
      values[field.name] = input.checked;
      updatePreview();
    });
  } else if (field.type === "choice" && field.choices) {
    input = document.createElement("select");
    for (const choice of field.choices) {
      const opt = document.createElement("option");
      opt.value = choice;
      opt.textContent = choice;
      if (String(values[field.name]) === choice) opt.selected = true;
      input.appendChild(opt);
    }
    input.addEventListener("change", () => {
      values[field.name] = input.value;
      updatePreview();
    });
  } else {
    input = document.createElement("input");
    input.type = field.type === "number" ? "number" : "text";
    input.value = values[field.name] === undefined ? "" : String(values[field.name]);
    input.placeholder = field.type === "directory" || field.type === "file" ? "Path" : "";
    input.addEventListener("input", () => {
      values[field.name] = field.type === "number" && input.value !== "" ? Number(input.value) : input.value;
      updatePreview();
    });
  }
  input.id = "field-" + field.name;
  wrap.appendChild(input);
  return wrap;
}

function appendOutput(stream, text) {
  const span = document.createElement("span");
  span.className = stream;
  span.textContent = text;
  outputEl.appendChild(span);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function killTree(pid) {
  if (payload.platform === "win32") {
    spawn("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    return;
  }
  try { process.kill(-pid, "SIGTERM"); } catch { try { process.kill(pid, "SIGTERM"); } catch {} }
}

function finish(code) {
  const ms = Date.now() - startedAt;
  child = null;
  runBtn.disabled = false;
  cancelBtn.disabled = true;
  const phase = code === 0 ? "done" : "failed";
  setStatus(phase, code === 0 ? "Done" : "Failed");
  resultEl.textContent = "Exit code " + code + " · " + (ms / 1000).toFixed(1) + "s";
}

function run() {
  const missing = missingRequired();
  if (missing.length) {
    setStatus("failed", "Missing required fields");
    resultEl.textContent = "Fill in: " + missing.join(", ");
    return;
  }
  const argv = buildArgv();
  outputEl.replaceChildren();
  resultEl.textContent = "";
  setStatus("running", "Running");
  runBtn.disabled = true;
  cancelBtn.disabled = false;
  startedAt = Date.now();
  try {
    writeFileSync(payload.lastRunPath, JSON.stringify(values, null, 2) + "\\n");
  } catch {}

  child = spawn(payload.nodePath, [payload.spec.target, ...argv], {
    cwd: payload.spec.cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: payload.platform !== "win32",
  });
  child.stdout.on("data", (chunk) => {
    setStatus("streaming", "Streaming output");
    appendOutput("stdout", chunk.toString("utf8"));
  });
  child.stderr.on("data", (chunk) => {
    setStatus("streaming", "Streaming output");
    appendOutput("stderr", chunk.toString("utf8"));
  });
  child.on("error", (error) => {
    appendOutput("stderr", error.message + "\\n");
    finish(1);
  });
  child.on("close", (code) => finish(code ?? 1));
}

function cancel() {
  if (!child || child.pid == null) return;
  killTree(child.pid);
  appendOutput("stderr", "\\nCancelled.\\n");
}

for (const field of payload.spec.fields) {
  formEl.appendChild(fieldControl(field));
}
updatePreview();
setStatus("ready", "Ready — review the command, then Run");
runBtn.addEventListener("click", run);
cancelBtn.addEventListener("click", cancel);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) run();
});
`;

export const windowStyles = `:root {
  color-scheme: light;
  --bg: #f6f4ef;
  --surface: #fffdf8;
  --ink: #1f1b16;
  --muted: #5c564d;
  --line: #d9d2c5;
  --accent: #2f5d50;
  --danger: #8a2f2f;
  --ok: #2f5d50;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; overflow: hidden; }
body {
  font: 14px/1.4 "Segoe UI", system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: baseline;
  padding: 10px 16px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
  flex-shrink: 0;
}
h1 { margin: 0; font-size: 1.1rem; }
h2 { margin: 0 0 6px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
.desc, .muted { color: var(--muted); margin: 2px 0 0; }
#status { margin: 0; white-space: nowrap; }
main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(320px, 1.2fr);
  gap: 12px;
  padding: 12px 16px 16px;
}
.form-pane, .run-pane {
  min-height: 0;
  min-width: 0;
  overflow: auto;
}
.run-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
.field-label { font-weight: 600; }
.field-help { color: var(--muted); font-size: 0.8rem; }
input, select {
  font: inherit;
  padding: 6px 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
}
input[type="checkbox"] { width: 1.1rem; height: 1.1rem; }
.preview, .output {
  background: #1f1b16;
  color: #f6f4ef;
  border-radius: 8px;
  padding: 8px 10px;
  overflow: auto;
  white-space: pre-wrap;
  font: 12px/1.4 ui-monospace, Consolas, monospace;
}
.preview { max-height: 4.6em; flex-shrink: 0; }
.output { flex: 1; min-height: 120px; }
.output .stderr { color: #f0b4b4; }
.actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
@media (max-width: 720px) {
  main { grid-template-columns: 1fr; }
}
button {
  font: inherit;
  border: 0;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
}
#run { background: var(--accent); color: #fff; }
#cancel { background: #ece7dc; color: var(--ink); }
#cancel:disabled, #run:disabled { opacity: 0.5; cursor: not-allowed; }
#status[data-phase="running"], #status[data-phase="streaming"] { color: var(--accent); }
#status[data-phase="done"] { color: var(--ok); }
#status[data-phase="failed"] { color: var(--danger); }
`;
