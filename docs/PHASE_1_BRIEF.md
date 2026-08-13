# GUI4CLI — Phase 1 architecture brief

_Structured capture of planning and architecture **before** code scaffolding. Goal: Phase 2 (or a new agent/session) can start from this file + `.forgekit/workflow_tracking.json` without re-reading the whole Phase 1 chat._

**Status:** `locked`  
**Last updated:** 2026-08-13  
**Source:** `docs/GENESIS.md` (v1 + v2 folded)  
**Locked by:** user confirmation (2026-08-13) — proposed stack, platforms, detect strategy, and `--build` depth accepted.  
**Name amendment (2026-08-13):** product is **GUI4CLI** (was ArgUI). npm / `npx` / primary bin stay `gui4cli`. Architecture otherwise unchanged.

---

## 1. Problem and outcome

**What we are building (2–4 sentences):**

GUI4CLI turns a Node.js CLI script (or package entry) into a lightweight desktop form app without rewriting the script. It detects arguments, opens a window with labeled fields, runs the original process, and streams live output plus exit code. The original script stays the source of truth. Goal: a usable GUI in under 30 seconds for a typical Commander or yargs script.

**Project archetype:** `product` — a local developer tool others can install (`npx gui4cli`). Not an internal-only app and not a one-shot. No accounts, tenancy, or payments in v1; later-phase payment/business-plan rows stay in tracking until we explicitly prune them.

**What “done” looks like for v1 (measurable where possible):**

- `npx gui4cli fixtures/resize.js` (or equivalent Commander/yargs fixture) opens a window with the detected fields in under 30 seconds.
- A non-developer can fill the form, click Run, see live stdout/stderr, then see exit code + duration.
- Cancel stops the child process.
- Optional `gui4cli.config.js` can override labels/types without editing the script.
- The original script file is never modified.

---

## 2. Users and hero flow

**Primary user(s):**

1. **Author (v1 buyer):** a Node developer who already has a CLI and wants a form for themselves or teammates.
2. **Operator (v1 success check):** a non-developer who can use the generated window without reading flags.

**The single most important workflow (hero flow) end-to-end:**

`npx gui4cli my-script.js` → detect args (Commander/yargs first) → open one desktop window → fill fields → Run → live output → exit code + duration. No project folder required.

**Secondary workflows (if any) for v1:**

- `npx gui4cli .` or `npx gui4cli --entry bin/cli.js` — resolve `package.json` `bin` / `main`.
- Optional `gui4cli.config.js` / `gui4cli.json` / script front-matter overrides.
- Save / reload last run values (local file only).
- `--build` may generate a reusable project folder; a real `.exe` can slip to later if packaging is the long pole.

---

## 3. Constraints

- **Technical:** Local-only. No accounts, cloud sync, or hosted backend. Original script is never rewritten. Spawn as a child process; stream stdout/stderr; cwd defaults to the script directory (overridable). Windows is the first packaging target. Detection is code-owned (structured schema), not LLM-inferred. Runs longer than a few seconds must show staged progress (running / streaming / done / failed), not a frozen window. Detect/spawn failures must be plain language, not raw stack traces as the only message.
- **Business / timeline:** Ship the instant-GUI happy path before polish, themes, or extra shells.
- **Explicit non-goals for v1:** See §10.

**State persistence:** Local files only (last-run JSON, optional generated project). No PocketBase, no auth, no `localStorage` web-app model.

**Content generation:** None. Forms come from CLI metadata + optional config. Skip §6a.

**Exports / tenancy / live search:** N/A. The “export” is a running process and optional packaged app, not PDF/DOCX.

---

## 4. Stack and tooling

_Confirmed 2026-08-13._

| Area | Choice | Status | Notes / WHY |
| ---- | ------ | ------ | ----------- |
| Product shape | TypeScript CLI package (`gui4cli`) + generated desktop window | confirmed | Matches `npx gui4cli script.js`. Not a SvelteKit/PocketBase web app. |
| Language | TypeScript, ESM only (`"type": "module"`) | confirmed | Repo convention; typed source. |
| Package manager | pnpm | confirmed | Repo convention. |
| Desktop shell (MVP) | windowd (or equivalent Node + webview) | confirmed | Fast iteration, full Node in the runner. Neutralino/Tauri later. |
| UI in the window | Generated HTML/CSS/JS (minimal chrome) | confirmed | Lightweight utility, not an IDE. |
| Persistence | Local JSON (last run / presets); no DB | confirmed | Single-user, local tool. |
| Auth / storage | None | confirmed | Explicit non-goal. |
| Arg schema | Zod (or equivalent) for detected fields + config | confirmed | Code owns structure; validate config at the boundary. |
| Styling | Small CSS in the generated window | confirmed | Readable type, keyboard (Tab, Enter to run). |
| Deploy / distribute | npm package `gui4cli` (unscoped); product name GUI4CLI; Windows-first packaged app later | confirmed | `gui4cli@0.0.0` is live. Unscoped `argui` failed similarity (arg/args/argv). Instant GUI does not require an installer. |
| CI | GitHub Actions (lint/test) when the spine exists | confirmed | Not a v1 user-facing requirement. |
| Fixtures | Sample Commander + yargs scripts in-repo | confirmed | Hero-flow proof without a customer script. |

**Folder shape (GUI4CLI repo, proposed):**

```
src/
  cli.ts              # npx entry
  detect/             # Commander / yargs / JSDoc / argv / config
  schema/             # shared field types (Zod)
  generate/           # form HTML + window bootstrap
  run/                # spawn, stream, cancel, cwd/env
  config/             # gui4cli.config.js loader
fixtures/             # Commander + yargs sample scripts
docs/                 # GENESIS, this brief
```

Generated app folder (when project/build mode runs) stays as in genesis: `index.html`, `main.js`, `runner.js`, `package.json`, original script or symlink.

---

## 5. Data model (sketch)

**Core entities:**

- **Target** — script path or package entry (`bin` / `main` / `--entry`).
- **Field** — name, type (`string` \| `number` \| `boolean` \| `choice` \| `file` \| `directory`), required, default, help, choices, constraints (min/max, filters).
- **FormSpec** — title, description, fields[], option groups, window size.
- **Run** — argv built from form values, cwd, env, startedAt, endedAt, exitCode, stdout/stderr streams.
- **Config** — optional overrides (`gui4cli.config.js` / `.json` / front-matter).
- **LastRun** — last values per target, stored locally.

**Relationships:**

Target → (detect + config merge) → FormSpec → (user submit) → Run. LastRun is keyed by Target.

**Existing data / migration:** none.

**Detection priority (locked in genesis):**

1. Commander.js / yargs definitions
2. JSDoc / `@param`
3. `gui4cli.config.js` / `gui4cli.json` / script front-matter
4. `process.argv` heuristics + help text

Do not attempt to reverse-engineer highly dynamic / programmatic CLIs in v1.

---

## 6. Integrations and external systems

| Integration | Purpose | Auth / secrets | Risk notes |
| ----------- | ------- | -------------- | ---------- |
| Node child_process | Run the original script | none | PATH, cwd, env leaks; cancel must actually kill the process tree on Windows |
| windowd (or equiv.) | Desktop window | none | Pin a known-good approach in Phase 2; have a fallback if the package is immature |
| Commander / yargs (read-only) | Arg metadata | none | Static parse vs execute-to-introspect is an open question (§9) |
| npm / npx | Distribution of GUI4CLI itself | none | Package name is `gui4cli` (unscoped `argui` blocked by npm similarity) |

No LLM, payments, email, analytics, or search APIs in v1.

---

## 6a. Content-generation pattern

Skipped — no LLM-produced content.

---

## 7. Hardest problems and risks

1. **Arg detection fidelity** — Commander/yargs configs are often built at runtime. Static parse may miss fields; executing the CLI to scrape `--help` is brittle and can have side effects.
2. **windowd (or shell) viability** — if the MVP shell is immature, packaging and “opens a window in 30s” both slip.
3. **Windows process cancel** — killing a spawned Node script plus its children is easy to get wrong; leftover processes break trust.
4. **Dynamic / unusual CLIs** — users will try ffmpeg wrappers and custom parsers; v1 must fail clearly (“couldn’t detect args — add gui4cli.config.js”) instead of generating an empty or wrong form.
5. **Scope creep into a GUI framework** — themes, subcommands, watch, and extra shells can delay the hero path.

---

## 8. Architectural decisions (numbered)

**D1. Product, not a web SaaS.** Local CLI + desktop window. Rejected: SvelteKit + PocketBase + auth. WHY: genesis is a one-command local tool; accounts would be unused architecture.

**D2. CLI name is `argui`.** Superseded 2026-08-13: product is GUI4CLI; primary command is `gui4cli`. Original rationale: matches the then-repo and folded genesis. Rejected: `clidesk`.

**D3. Instant GUI is the v1 hero; project/build are secondary.** Rejected: generating a project folder as the only mode. WHY: “under 30 seconds” requires an ephemeral window.

**D4. windowd (or equivalent Node + webview) for MVP; Neutralino/Tauri later.** WHY: full Node access in the runner, faster iteration. Revisit if the shell cannot open a window reliably on Windows.

**D5. Original script is never rewritten; spawn + stream.** WHY: the CLI remains source of truth; GUI4CLI is a wrapper.

**D6. Detection is a code-owned schema (Zod), merged with optional config.** Rejected: LLM inference of flags. WHY: structured CLI metadata should not go through a model; config is the escape hatch.

**D7. Windows-first for packaged apps; instant GUI should still aim to work wherever Node + the shell work.** Exact macOS/Linux support for v1 is an open question (§9).

**D8. No LLM, no live search, no multi-tenant, no document exports.** WHY: not in the product; record so Phase 2 does not pull Default-A web stack.

**D11. Product name is GUI4CLI.** npm / `npx` / primary bin are `gui4cli`. `argui` is an optional alias only. Config files are `gui4cli.config.js` / `gui4cli.json`. WHY: user confirmed 2026-08-13. Supersedes D2 and the ArgUI product-name part of D10.

---

## 9. Open questions (before or during Phase 2)

| # | Question | Resolution |
| - | -------- | ---------- |
| Q1 | Stack table in §4 | **Locked.** TypeScript / ESM / pnpm / windowd / Zod / no DB. |
| Q2 | Instant GUI platforms | **Locked.** Instant GUI wherever windowd works; packaged `.exe` is Windows-first. |
| Q3 | Detect strategy | **Locked.** Hybrid: static Commander/yargs first, `--help` only as fallback. |
| Q4 | `--build` depth in v1 | **Locked.** Generated project folder first; real `.exe` later. |
| Q5 | npm name | **Locked.** Unscoped `gui4cli@0.0.0` published 2026-08-13. Product name GUI4CLI; primary bin `gui4cli`; `argui` remains an optional alias. Unscoped `argui` is blocked by npm similarity. |
| Q6 | Dangerous scripts | **Locked.** Show command preview (argv + cwd) before first Run. No sandbox. |

---

## 10. Explicitly out of scope (v1)

- Full GUI framework; multi-window / multi-page apps
- Every CLI style; highly dynamic programmatic CLIs
- Subcommands, watch mode, themes, drag-and-drop
- Neutralino / Tauri packaging path
- Replacing Electron for large production apps
- Accounts, cloud sync, multi-tenant SaaS, hosted web app
- PocketBase, auth, payments, LLM features, live web search
- PDF / DOCX / PPTX exports
- Non-Node CLIs as a first-class target (wrapping `ffmpeg` via a Node script is fine; parsing raw ffmpeg flags is not)

---

## 11. First feature batch (post-scaffold)

1. CLI entry: `gui4cli <file>` / `gui4cli .` / `--entry` / `--help`
2. Detect Commander + yargs → FormSpec (Zod); fixtures for both
3. Merge optional `gui4cli.config.js`
4. Open windowd window with generated form (string / number / boolean / file / choice)
5. Run: spawn, stream stdout/stderr, exit code, duration, cancel
6. Last-run values (local JSON)
7. Plain-language errors when detection or spawn fails, with “add a config file” as the escape hatch
8. Project-folder generate (`--build` or project mode) if the hero path is already green
9. Windows `.exe` only if 1–7 are solid

---

## 12. Handoff checklist (before leaving Phase 1)

- [x] User has confirmed stack, folder shape, data sketch, hero flow, and v1 boundaries
- [x] This brief is **locked** (no `[draft]` ambiguity) or remaining items are only in §9 Open questions
- [x] `.forgekit/workflow_tracking.json` updated: `decisions[]` for each major D#; `phases["1-architecture"]` notes summarize sign-off
- [x] Phase 2 opener will read **this file** + `.forgekit/workflow_tracking.json` first
