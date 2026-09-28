---
format_version: 0.1.0
id: lesson-a382e5e35ebe
kind: lesson
title: "Unscoped argui is 404 on the registry and passed can-i-publish, but npm
  publish "
record_status: active
created_at: 2026-08-13T22:33:00Z
updated_at: 2026-08-13T22:33:00Z
recorded_by:
  id: migration-import
  type: import
visibility: internal
relations: []
claims: []
data:
  context: Imported from workflow tracking gotchas[].
  problem: "Unscoped argui is 404 on the registry and passed can-i-publish, but
    npm publish returned 403: too similar to arg, args, argv. Dry-run and the
    probe both missed this."
  resolution: Published unscoped gui4cli@0.0.0. Product name later became GUI4CLI
    (d11). Do not trust dry-run or can-i-publish for similarity.
  limits: Imported as a historical assertion. Verification was not recorded.
  generalization_status: observed
---


