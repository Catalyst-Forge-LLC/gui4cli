---
title: Why a form, not a rewrite
date: 2026-09-05
description: The script stays the source of truth. The window is a wrapper.
tags: [notes]
---

A Node CLI already knows its flags. Commander and yargs write them in the source. GUI4CLI reads that, draws inputs, and spawns the same file.

Rewriting the script as a “real app” would fork the truth. The form would drift. Bugs would have two homes.

So the window is a wrapper. **Run** is `node your-script.js …` with live stdout and stderr. `--build` keeps an absolute path to that file so `commander` still resolves from the script's `node_modules`.

That also means this is not an `.exe` factory and not a hosted SaaS. Point it at a script. Fill the form. Watch the process you already trust.
