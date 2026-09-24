---
title: Detect
---

GUI4CLI does not ask an LLM what the flags are. It reads the file.

## Order

1. **Commander** — static AST (`option`, `argument`, required, defaults, choices)
2. **yargs** — same idea (`option`, `alias`, `choices`, `demandOption`)
3. **JSDoc** — `@param` tags (first-pass; thin)
4. **`--help`** — if the steps above found no fields, GUI4CLI may execute the script with `--help` and stop waiting after a timeout. That execution can have side effects. Use scripts you trust. A hang or an error does not undo work the script already did.
5. **Config** — `gui4cli.config.js` or `gui4cli.json` next to the script, merged after that attempt. Config does not skip `--help`.

Commander wins when it finds at least as many fields as yargs. Empty detect plus no config throws a plain error and tells you to add a config file.

`--json` skips the window, not the detection pipeline. Use it in CI.

## Config

When the script builds flags at runtime, write the fields yourself:

```js
// gui4cli.config.js
export default {
  title: 'Resize',
  fields: {
    width: { type: 'number', required: true, default: 800 },
    height: { type: 'number', default: 600 },
    out: { type: 'file', longFlag: '--out' }
  }
};
```

Zod validates the merged form before the window opens.

## Field types

| Type | Control |
| --- | --- |
| `string` | text |
| `number` | number |
| `boolean` | checkbox |
| `file` | text path (no native picker yet) |
| `choice` | select from `choices` |

## What detect does not do

It does not reverse-engineer highly dynamic CLIs, walk subcommands, or treat a failed `--help` spawn as a crash. Those scripts need config. Unknown flags are omitted, not guessed into the form.
