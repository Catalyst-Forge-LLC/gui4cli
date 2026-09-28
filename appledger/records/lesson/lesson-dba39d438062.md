---
format_version: 0.1.0
id: lesson-dba39d438062
kind: lesson
title: First pnpm dev after a pause often printed a ready checkmark then exited;
  the se
record_status: active
created_at: 2026-08-20T15:00:00Z
updated_at: 2026-08-20T15:00:00Z
recorded_by:
  id: migration-import
  type: import
visibility: internal
relations: []
claims: []
data:
  context: Imported from workflow tracking gotchas[].
  problem: First pnpm dev after a pause often printed a ready checkmark then
    exited; the second try showed the window. JS Debug Terminal still injects
    NODE_OPTIONS=--require bootloader (not only --inspect). Vite HMR's first
    reload also fires windowd's beforeunload close signal.
  resolution: Clear NODE_OPTIONS entirely for the windowd child. Disable HMR in
    the generated vite.config.js. Retry once if windowd exits within 5s with
    code 0.
  limits: Imported as a historical assertion. Verification was not recorded.
  generalization_status: observed
---


