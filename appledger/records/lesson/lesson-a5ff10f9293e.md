---
format_version: 0.1.0
id: lesson-a5ff10f9293e
kind: lesson
title: pnpm nests windowd under .pnpm, so joining ../.bin from package.json
  misses node
record_status: active
created_at: 2026-08-13T23:06:00Z
updated_at: 2026-08-13T23:06:00Z
recorded_by:
  id: migration-import
  type: import
visibility: internal
relations: []
claims: []
data:
  context: Imported from workflow tracking gotchas[].
  problem: pnpm nests windowd under .pnpm, so joining ../.bin from package.json
    misses node_modules/.bin. spawn('windowd') then ENOENT because windowd is
    not on PATH. The official shim also expects bun.
  resolution: Launch windowd/bin/cli.ts with bun if present, otherwise node + tsx.
    Do not spawn a bare 'windowd' name.
  limits: Imported as a historical assertion. Verification was not recorded.
  generalization_status: observed
---


