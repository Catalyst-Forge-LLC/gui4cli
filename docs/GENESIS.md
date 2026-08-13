**Project Spec: ArgUI — CLI → Desktop UI Generator**

Initial Agent Chat: https://grok.com/c/6aa6319e-cbd8-42a8-9dcf-8eefc98b80ef?rid=e80053a7-d22b-4de5-b5cb-35cef72a53ad

### One-sentence pitch
Turn any Node.js CLI script into a simple desktop form app with one command — inputs, run button, live output, and results — without rewriting the script.

Goal: zero-to-usable GUI in under 30 seconds for simple scripts.

---

### Core Idea
A tool that takes a Node.js script (or package) with CLI arguments and automatically generates a lightweight desktop app with:
- Auto-generated form for inputs
- Run button + live progress/output
- Results panel
- Optional packaging into a real `.exe`

The original script stays the source of truth and is never rewritten.

---

### High-Level Architecture

```
Input:  node script (or package entry)
        + optional config / comments / Commander/yargs definition

↓

Analysis:
  - Detect args (Commander, yargs, JSDoc/@param, config, or process.argv)
  - Infer types (string, number, boolean, file, choice)
  - Detect required vs optional + defaults

↓

Generation:
  - Create a small windowd / Neutralino / Tauri shell
  - Generate HTML/JS form based on detected args
  - Wire up run → spawn the original script → capture stdout/stderr/exit code
  - Show live output + final result

↓

Output:
  - Dev mode: `npx argui my-script.js` → opens window immediately
  - Project mode: generates a reusable folder
  - Build mode: generates a packageable project or single executable
```

---

### Primary User Flows

1. **Instant GUI (hero / happy path)**
   ```bash
   npx argui my-script.js
   ```
   - Detects arguments
   - Opens a desktop window with a generated form
   - User fills fields → clicks Run → sees live output and final result
   - No project scaffolding required

2. **Project mode**
   ```bash
   npx argui .
   # or
   npx argui --entry bin/cli.js
   ```
   - Looks at `package.json` `bin` / `main`
   - Generates a reusable project folder that can be developed further or packaged

3. **Build / Distribute**
   ```bash
   npx argui my-script.js --build
   ```
   - Produces a self-contained desktop app (or at least a ready-to-package windowd/Neutralino project)
   - Optional: single `.exe` for Windows

---

### What Gets Detected

**Argument sources (priority order)**
1. Commander.js / yargs definitions (preferred — richest metadata)
2. Simple JSDoc / `@param` style comments
3. Manual config file (`argui.config.js` or `argui.json`) or front-matter in the script
4. Fallback: basic `process.argv` heuristics + help text parsing

**Supported argument shapes (MVP)**

| Type | UI Control | Notes |
|------|------------|-------|
| string | Text input | |
| number | Number input | |
| boolean / flag | Checkbox | |
| choice / enum | Select / radio | From `.choices()` or similar |
| file / path | File picker | With optional filters |
| required vs optional | Visual indicator + validation | |
| default value | Pre-filled | |
| description / help | Tooltip or label helper text | |

**Subcommands (later / Phase 1.5)**
- Top-level tabs or a command selector
- Each subcommand gets its own form

---

### Generated UI Structure

A single desktop window containing:

**Header**
- Script / tool name
- Short description (from package or help text)

**Form area**
- Clean vertical list of fields
- Grouped if the CLI has option groups
- Clear required indicators
- File pickers open native dialogs

**Action bar**
- Primary **Run** button
- Optional secondary actions (Clear, Load last values, Save preset)

**Output panel**
- Live streaming stdout + stderr
- Collapsible or tabbed (Output / Errors)
- Exit code + duration shown after completion
- Copy button for results

**Status**
- Running indicator / spinner
- Success / failure state

Design goal: feel like a lightweight utility, not a full IDE. Minimal chrome, readable typography, good keyboard support (Tab, Enter to run).

---

### Configuration & Overrides

Users can influence generation without changing the original script:

```js
// argui.config.js (optional)
export default {
  title: "Image Resizer",
  description: "Batch resize images",
  entry: "./resize.js",
  fields: {
    input: { label: "Source folder", type: "directory" },
    quality: { min: 1, max: 100 },
    // hide or reorder fields, force types, etc.
  },
  window: {
    width: 720,
    height: 640
  }
}
```

Also support:
- Front-matter style comments in the script itself
- Environment variable for default theme / density

---

### Execution Model

- Form values are collected and turned into the correct CLI arguments
- Original script is spawned as a child process
- stdout/stderr stream into the UI in real time
- Working directory defaults to the script’s location (overridable)
- Environment variables can be passed through or lightly customized
- Cancel button kills the running process
- Optional: save last run config

The original script stays completely unchanged.

---

### Packaging Targets

**MVP target:** windowd (or equivalent lightweight Node + webview approach)
- Fast iteration
- Full Node access in the runner
- Simple mental model

**Secondary (later):** Neutralino or minimal Tauri shell for smaller final size.

Output modes:
- Dev / ephemeral window (default)
- Generated project folder
- Packaged desktop app (Windows first)

---

### Suggested MVP Scope

- Support Commander + yargs
- Basic form generation (string / number / boolean / file / choice)
- Live stdout streaming, exit code, duration, cancel
- windowd backend
- `npx argui <file>` works immediately
- Optional `argui.config.js` for overrides
- Detect `package.json` `bin` / `main` when given a directory

**Later**
- Subcommands
- Better type inference
- Watch mode
- Themes
- Single-file executable packaging
- Drag-and-drop support
- Neutralino / Tauri packaging path

---

### Explicit Non-Goals (v1)

- Becoming a full GUI framework
- Supporting every possible CLI style in the world
- Complex multi-window or multi-page applications
- Automatic reverse-engineering of highly dynamic / programmatic CLIs
- Replacing Electron for large production apps
- Accounts, cloud sync, multi-tenant SaaS, or a hosted web app

ArgUI optimizes for “I have a useful script, I want a usable form in under a minute.”

---

### Success Criteria (MVP)

- Works on a typical Commander or yargs script with zero config
- Generated form is understandable by a non-developer
- Live output feels responsive
- `npx argui script.js` is the happy path and just works
- The original script remains the source of truth
- Zero-to-usable GUI in under 30 seconds for simple scripts

---

### Example Use Cases

**1. Personal utilities**
`resize.js --input ./photos --width 1200 --quality 85 --output ./web`  
→ Form with folder pickers + number fields. A non-technical family member can use it.

**2. Internal tools / scripts for teammates**
A data-cleaning script with 7–8 flags and required paths. Instead of a README full of examples, you ship a small desktop form with a big Process button.

**3. Prototyping before building a real app**
You validate the logic as a CLI first. When people ask for a GUI, you run ArgUI instead of rewriting everything.

**4. Quick wrappers for existing packages**
Wrap an existing npm CLI (ffmpeg helpers, image processors, markdown converters, etc.) so the common flags become a permanent little app on your desktop.

---

### Rough Project Structure (generated)

```
my-tool-gui/
├── index.html          # auto-generated form
├── main.js             # windowd / Neutralino entry
├── runner.js           # spawns original script
├── package.json
└── original-script.js  # (or symlink)
```
