**Project Spec: ArgUI - CLI → Desktop UI Generator**

Initial Agent Chat: https://grok.com/c/6aa6319e-cbd8-42a8-9dcf-8eefc98b80ef?rid=e80053a7-d22b-4de5-b5cb-35cef72a53ad

### Core Idea
A tool (working name candidates below) that takes a Node.js script (or package) with CLI arguments and automatically generates a lightweight desktop app with:
- Auto-generated form for inputs
- Run button + live progress/output
- Results panel
- Optional packaging into a real `.exe`

Goal: zero-to-usable GUI in under 30 seconds for simple scripts.

---

### High-Level Architecture

```
Input:  node script (or package entry)
        + optional config / comments / Commander/yargs definition

↓

Analysis:
  - Detect args (Commander, yargs, process.argv, or simple JSDoc/@param)
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
  - Dev mode: `npx clidesk my-script.js` → opens window immediately
  - Build mode: generates a packageable project or single executable
```

---

### Key Features (MVP)

1. **Argument Detection**
   - Support Commander.js and yargs first (most common)
   - Fallback: parse `process.argv` + simple comments / JSDoc
   - Manual override via a small `clidesk.json` or frontmatter

2. **UI Generation**
   - Text inputs, number inputs, checkboxes, selects, file pickers
   - Grouping / sections if subcommands exist
   - Defaults pre-filled
   - “Run” button + optional “Watch” mode

3. **Execution**
   - Spawns the original Node script with the collected args
   - Streams stdout/stderr live into the UI
   - Shows exit code + duration
   - Optional: save last run config

4. **Packaging**
   - Primary target: **windowd** (fastest, full Node access)
   - Secondary: Neutralino or lightweight Tauri
   - One-command “make me an .exe”

5. **Developer Experience**
   ```bash
   npx clidesk script.js                  # instant GUI
   npx clidesk script.js --build          # generate project
   npx clidesk .                          # detect package.json main/bin
   ```

---

### Example Use Cases

**1. Personal utilities**
You have a script `resize-images.js` that takes `--input`, `--width`, `--quality`, `--output`.  
One command turns it into a small desktop tool your non-technical family can use.

**2. Internal tools / scripts for teammates**
A data-cleaning script with 8 flags. Instead of writing docs + teaching people the flags, you give them a simple window with labeled fields and a big “Process” button.

**3. Prototyping before building a real app**
You have a working CLI prototype. Run `npx clidesk` to get a usable GUI in seconds, then decide later whether to invest in a proper Electron/Tauri app.

**4. Quick wrappers for existing packages**
Wrap popular CLI tools (ffmpeg helpers, image processors, markdown converters, etc.) without rewriting them.

---

### Suggested MVP Scope

- Support Commander + yargs
- Basic form generation (string / number / boolean / file)
- Live stdout streaming
- windowd backend
- `npx clidesk <file>` works immediately
- Optional `clidesk.config.js` for overrides

Later:
- Subcommands
- Better type inference
- Themes
- Single-file executable packaging
- Drag-and-drop support

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
