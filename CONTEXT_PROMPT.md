# GUI4CLI — Project Context Prompt

_Copy into a new chat to continue. Architecture was locked in `docs/PHASE_1_BRIEF.md` and merged here on 2026-08-13. Keep `docs/PHASE_1_BRIEF.md` as the dated audit trail._

## Handoff from Phase 1

GUI4CLI turns a Node.js CLI script into a desktop form without rewriting the script. Hero: `npx gui4cli my-script.js` → detect args → one window → Run → live stdout/stderr → exit code + duration. Goal: usable GUI in under 30 seconds for a typical Commander or yargs script.

**Users:** Author (Node developer with a CLI) and Operator (non-developer who can use the form).

**v1 non-goals:** full GUI framework, subcommands, themes, Neutralino/Tauri, Electron replacement, accounts/cloud/SaaS, PocketBase, auth, payments, LLM, live search, document exports, raw non-Node CLIs.

## Tech Stack

- **Product shape:** TypeScript CLI package (`gui4cli`) + generated desktop window. Not SvelteKit, not PocketBase, not a hosted web app.
- **Language:** TypeScript, ESM only (`"type": "module"`), Node >= 20
- **Package manager:** pnpm
- **Desktop shell:** windowd (NW.js + Vite). Neutralino/Tauri later.
- **UI:** Generated HTML/CSS/JS in a temp folder
- **Persistence:** `~/.gui4cli/lastrun/*.json` only
- **Schema:** Zod for FormSpec, Field, and config
- **Key dependencies:** `zod`, `windowd`; fixtures use `commander` and `yargs`

## Project Structure

```
src/
  cli.ts              # npx entry
  detect/             # Commander / yargs / JSDoc / --help
  schema/             # Zod FormSpec
  generate/           # window HTML + app.js
  run/                # argv + process-tree kill
  config/             # gui4cli.config.js / .json
  resolve/            # file / folder / --entry
  last-run/           # local JSON
  window/             # spawn windowd
fixtures/             # resize.js (Commander), clean.js (yargs)
site/                 # FilePress site + /docs (gui4cli-site, port 5201)
docs/                 # GENESIS, PHASE_1_BRIEF (internal)
```

## Data Model

| Entity | Purpose | Key fields |
| ------ | ------- | ---------- |
| Target | Script or package entry | absolute path, cwd |
| Field | One form control | name, longFlag, type, required, default, choices |
| FormSpec | Window payload | title, description, fields, source, window size |
| Run | One spawn | argv, cwd, exitCode, duration, streams |
| Config | Optional overrides | title, fields[], window |
| LastRun | Saved values per target | FormValues JSON |

Target → detect + config merge → FormSpec → user submit → Run. LastRun keyed by target hash.

**Detect order:** Commander/yargs static AST → JSDoc → config merge → `--help` fallback. Do not reverse-engineer highly dynamic CLIs.

## Key Architectural Decisions

- **D1 (Phase 1):** Local CLI + desktop window, not a web SaaS. WHY: genesis is one-command local; accounts would be unused.
- **D3 (Phase 1):** Instant GUI is the v1 hero; `--build` / project folder is secondary. WHY: under-30-seconds needs an ephemeral window.
- **D4 (Phase 1):** windowd (or equivalent Node + webview) for MVP. WHY: full Node in the runner, faster than Tauri for a script wrapper.
- **D5 (Phase 1):** Never rewrite the original script; spawn + stream. WHY: the CLI stays source of truth.
- **D6 (Phase 1):** Code-owned Zod schema + optional config. No LLM inference. WHY: CLI metadata is structured; config is the escape hatch.
- **D7 (Phase 1):** Windows-first for packaged apps. Instant GUI wherever windowd works.
- **D8 (Phase 1):** No LLM, live search, multi-tenant, or document exports in v1.
- **D11 (Phase 1):** Product name GUI4CLI; npm/npx/bin `gui4cli`. Config: `gui4cli.config.js` / `gui4cli.json`.
- **D15 (Phase 2):** Drop the `argui` bin. WHY: leftover name; product is GUI4CLI only.
- **D12 (Phase 2):** Open the window by writing a temp folder and spawning `windowd`. WHY: matches windowd's `index.html` + Node-in-renderer model; first launch may download ~200 MB NW.js.
- **D13 (Phase 2):** `--build` writes a reusable GUI folder that wraps the original script in place. WHY: the script's `node_modules` must still resolve; a copied file would lose Commander/yargs. No `.exe` in this step.
- **D14 (Phase 2):** Marketing + docs are a FilePress site in `site/`, same shape as ollanet (`pages/`, `docs/` → `/docs`, Wrangler Pages). LocalSlip lease `gui4cli-site` on **5201**. WHY: sibling sites already ship this way; do not invent a SvelteKit marketing app. 5198 is already `haulout-site`.

## Critical Patterns

- Zod validates FormSpec and config at the boundary. Do not pass raw detect objects to the window.
- User-facing errors use `Gui4CliError` (plain sentence + optional detail). Do not show a stack as the only message.
- Long runs use status phases: ready / running / streaming / done / failed.
- Show command preview (argv + cwd) before Run.
- On Windows, cancel must `taskkill /T /F` the child tree.
- `--json` prints the spec without opening a window (tests and CI).
- When spawning windowd, drop `NODE_OPTIONS` and `VSCODE_INSPECTOR_OPTIONS` entirely. The JS Debug Terminal's `--require` bootloader is enough to kill NW.js on first launch.
- Generated windows ship `vite.config.js` with HMR off. Vite's first-load reload fires windowd's `beforeunload` close signal.
- If windowd exits within 5s with code 0, open once more and say so in plain language.

## Design Philosophy

- Lightweight utility, not an IDE.
- Keyboard: Tab through fields; Ctrl/Cmd+Enter to Run.
- Fail clearly: “Couldn't detect arguments — add gui4cli.config.js.”

## Writing/Voice Rules

- No LLM-generated product copy. Errors are short and actionable. Site and docs follow Smell Check (`docs/smellcheck.md`, `node_modules/smellcheck/rules/core.md`).

## My Preferences

- TypeScript ESM only; pnpm; no CommonJS.
- Do not introduce PocketBase, auth, or SvelteKit.
- Do not publish another `0.0.0`. GitHub is public: `https://github.com/Catalyst-Forge-LLC/gui4cli` belongs on the package and site.
- Commit after substantive work; do not push unless asked.

## Current Feature State

### Complete

- Phase 1 brief locked; product named GUI4CLI; npm latest is `gui4cli@0.0.2`.

### In Progress

- Phase 2 spine works end to end. `--build` writes a reusable windowd folder that wraps the original script in place.
- FilePress site live at https://gui4cli.dev (LocalSlip `gui4cli-site` on 5201). npm latest is `gui4cli@0.0.2` (CLI unchanged since that tarball).

### Not Started

- Windows `.exe`, JSDoc depth, Neutralino/Tauri.

## Anti-Patterns to Avoid

- Treating `can-i-publish` or `npm publish --dry-run` as proof of npm's similarity filter (`argui` failed after both said yes).
- Scaffolding a SvelteKit + PocketBase app because ForgeTrail templates default to that.
- Frozen window with no status while a script runs.
- Empty form when detect fails (must tell the user to add a config file).

## Recent Changes

### Session 2026-09-10

- Dropped `argui`. Public GitHub on package + site. SVG mark (terminal → form drawer) plus illustrated `og.png`. FilePress blog routes stripped from the static build and redirected home.

### Session 2026-09-05

- FilePress marketing + `/docs` site in `site/`, modeled on ollanet/localslip. Lease `gui4cli-site` → 5201. Live at https://gui4cli.dev. Root README is the npm README — keep it consumer-first (`npx gui4cli`), not a checkout guide.

### Session 2026-08-20

- First `pnpm dev` after a pause often failed to show the window; the second try worked. Cleared all inspector `NODE_OPTIONS` for windowd, disabled Vite HMR, retry once on a sub-5s exit.
- `--build` writes a reusable GUI folder (`<title>-gui`) that wraps the original script in place.

### Session 2026-08-13

- Started Phase 2 scaffolding: CLI spine, fixtures, windowd launch, Phase 2 docs.
