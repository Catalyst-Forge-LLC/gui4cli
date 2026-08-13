# GUI4CLI — Feature Backlog

Seeded from `docs/PHASE_1_BRIEF.md` §11. Flat list until Phase 6 (brand pillars). Process `.forgekit/IDEAS.md` here periodically.

## Hero path (Phase 2)

- [x] CLI entry: `gui4cli <file>` / `gui4cli .` / `--entry` / `--help`
- [x] Detect Commander + yargs → FormSpec (Zod); fixtures for both
- [x] Merge optional `gui4cli.config.js` / `gui4cli.json`
- [x] Open windowd window with generated form (string / number / boolean / file / choice)
- [x] Run: spawn, stream stdout/stderr, exit code, duration, cancel
- [x] Last-run values (local JSON)
- [x] Plain-language errors when detection or spawn fails
- [x] Prove the window opens (`windowd` + NW.js; first run downloaded ~200 MB)
- [x] Click through Run → live output → exit code in the window
- [x] Compact two-column window so form + preview + output fit on a typical laptop screen
- [ ] `--help` fallback coverage on a script with no static options

## After the hero path is green

- [ ] Project-folder generate (`--build`) if 1–7 stay solid
- [ ] Windows `.exe` only after the instant GUI is trustworthy
- [ ] JSDoc / `@param` detection beyond the first-pass parser
- [ ] Directory picker that feels native (not only a text path)

## Foundation

- [ ] GitHub Actions lint/test when the spine is stable
- [ ] Drop or keep the `argui` bin alias (product decision)
- [ ] Point `origin` at `Catalyst-Forge-LLC/gui4cli` after the GitHub rename
