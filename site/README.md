# gui4cli.dev

Marketing + docs site for [GUI4CLI](https://www.npmjs.com/package/gui4cli), built with [FilePress](https://getfilepress.com) (`getfilepress` on npm).

```bash
pnpm install
pnpm docs:build    # Markdown → docs/dist
pnpm dev           # docs build + FilePress preview
pnpm build         # → build/ (includes /docs mount)
```

From the repo root: `pnpm site:dev` / `pnpm site:build`.

Docs source: `docs/*.md` + `_nav.json`. FilePress mounts `docs/dist` at `/docs` via `paths` in `filepress.config.ts`.

If [LocalSlip](https://www.npmjs.com/package/localslip) is installed, this site stays on **5201** as `gui4cli-site` (5198 is already `haulout-site`).

```bash
localslip claim gui4cli-site --port 5201
```

## Deploy (Cloudflare Pages)

**Use one pipeline only.** Dual deploys overwrite each other.

```bash
pnpm ship
# = pnpm build && wrangler pages deploy build --project-name=gui4cli
```

Then attach **gui4cli.dev** in the Cloudflare dashboard.

### Git-connected Pages

| Setting | Value |
| --- | --- |
| Root directory | `site` |
| Build command | `pnpm install && pnpm build` |
| Output directory | `build` |
| Node | 20+ |

Pin `getfilepress` to a published `^0.1.28`. A `link:` dependency will not resolve on CF Pages.
