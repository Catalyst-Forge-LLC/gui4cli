---
title: Detect
---

GUI4CLI does not ask an LLM what the flags are. It reads the file.

## Order

1. **Commander** — static AST (`option`, `argument`, required, defaults, choices)
2. **yargs** — same idea (`option`, `alias`, `choices`, `demandOption`)
3. **JSDoc** — `@param` tags (first-pass; thin)
4. **Config** — `gui4cli.config.js` or `gui4cli.json` next to the script, merged on top
5. **`--help`** — spawn the script with `--help` and parse the text (thin; skipped if it hangs or has side effects)

Commander wins when it finds at least as many fields as yargs. Empty detect plus no config throws a plain error and tells you to add a config file.

`--json` is the same pipeline with no window. Use it in CI.

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
