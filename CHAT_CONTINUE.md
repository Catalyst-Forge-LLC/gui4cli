# Continue here (new Cursor window)

This chat was about to die because the folder/repo is being renamed. **Read this file first**, then `docs/PHASE_1_BRIEF.md` and `.forgekit/workflow_tracking.json`. Do not re-litigate Phase 1 unless the user asks.

## What this project is

**Product working name:** ArgUI  
**npm package (published):** `gui4cli@0.0.0` — https://www.npmjs.com/package/gui4cli  
**Pitch:** Turn a Node.js CLI script into a desktop form (inputs, Run, live stdout/stderr) without rewriting the script. Hero: `npx gui4cli my-script.js` in under 30 seconds.

Unscoped **`argui` is not publishable** (npm 403: too similar to `arg`, `args`, `argv`). Keep the product name ArgUI if the user wants; the install name is `gui4cli`. Bins in the placeholder: `gui4cli` and `argui`.

## Where we left off (2026-08-13)

1. ForgeKit greenfield kickoff. Genesis folded into `docs/GENESIS.md`.
2. `docs/PHASE_1_BRIEF.md` is **locked**. Phase 1 exit criteria are met. **`currentPhase` is still `1-architecture`** — do **not** start Phase 2 (scaffold) until the user says so in the new chat.
3. Placeholder `gui4cli@0.0.0` is **live on npm**. No GitHub URL on the package (user asked not to mention the repo yet). Next real version cannot be `0.0.0` again — use `0.0.1` or `0.1.0`.
4. User is renaming the **GitHub repo** and the **local folder** (likely `argui` → `gui4cli`). After reopen, update `git remote` if GitHub’s rename did not already redirect.

Expected remote after rename: `git@github.com:Catalyst-Forge-LLC/gui4cli.git`  
Old remote: `git@github.com:Catalyst-Forge-LLC/argui.git` (GitHub usually redirects).

Local branch was `master`, several commits **ahead of `origin/master` and not all pushed**. After rename, `git status` / `git push -u origin master` (or `main` if they rename the branch).

## Read in this order

1. This file
2. `docs/PHASE_1_BRIEF.md` (locked architecture)
3. `docs/GENESIS.md` (what-not-how spec)
4. `.forgekit/workflow_tracking.json` (decisions D1–D10, gotchas)
5. `package.json` (placeholder only — not the app spine yet)

## Locked stack (do not substitute SvelteKit/PocketBase)

- TypeScript, ESM (`"type": "module"`), pnpm
- Desktop shell: **windowd** (or equivalent Node + webview). Neutralino/Tauri later
- Zod for field/config schema
- No DB, no auth, no LLM, no hosted web app
- Detect: Commander/yargs static first, `--help` fallback
- `--build` in v1 = generated project folder; `.exe` later (Windows-first)
- Show command preview (argv + cwd) before first Run

## Phase 2 spine (when the user says go)

Not a web CRUD app. Remap ForgeKit “CRUD / pnpm dev” to:

`npx gui4cli fixtures/<commander-or-yargs-script>` → form → Run → live output → exit code.

Then: `CONTEXT_PROMPT.md` (merge the brief), `README.md`, `TODO.md`, `.forgekit/IDEAS.md`. Do not dump extra ForgeKit templates.

## Do not

- Re-run a full Genesis / blank Phase 1 intake
- Publish another `0.0.0`
- Put the GitHub URL on npm until the user says so
- Treat `can-i-publish` or `npm publish --dry-run` as proof of the similarity filter (gotcha: they both said `argui` was fine)
- Add PocketBase, auth, or a SvelteKit app

## Suggested first message after reopen

> Read `CHAT_CONTINUE.md` and the locked brief. Confirm the folder/remote rename, then start Phase 2 when I say go.
