# Agent guidelines (GUI4CLI)

## Git commits

- Use `git commit -m` or `git commit -F <file>` only.
- Do **not** add unrequested attribution trailers (e.g. `Co-authored-by`, `Signed-off-by`, `Made-with`, generator stamps) unless the user explicitly asks.
- Prefer short, purpose-focused messages (why over what).
- Do not push unless the user asks.

## ForgeKit

- Project lifecycle state lives in `.forgekit/workflow_tracking.json`.
- Lock `docs/PHASE_1_BRIEF.md` before scaffolding application code.
- Pause at phase transitions for explicit user approval.
