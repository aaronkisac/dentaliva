# Dentaliva Starter

Reusable multi-site starter — **Next.js (static export) · Sanity · Cloudflare Workers with static assets · Turborepo**.

The first production site is [dentaliva.com](https://www.dentaliva.com), a Turkish dental clinic. A new client site swaps the **vertical package** (`packages/clinic`) and the **site config** (`apps/web/sites/`) — the core never changes.

## Stack

| Layer       | Choice                                                  | Decision record                                              |
| ----------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Rendering   | Next.js 16, `output: "export"` on Workers static assets | [ADR-001](docs/adr/ADR-001-static-export-on-workers.md)      |
| Content     | One Sanity project per domain (production + staging)    | [ADR-002](docs/adr/ADR-002-one-sanity-project-per-domain.md) |
| Rebuilds    | Publish → deploy hook → rebuild (no draft mode)         | [ADR-003](docs/adr/ADR-003-no-draft-mode-webhook-rebuild.md) |
| Site config | Single `sites/<id>.ts` drives domain behavior           | [ADR-004](docs/adr/ADR-004-single-config-web-app.md)         |
| Images      | Sanity CDN via custom next/image loader                 | [ADR-006](docs/adr/ADR-006-sanity-cdn-image-loader.md)       |
| Forms       | Turnstile + Zod + Resend in a Worker                    | [ADR-007](docs/adr/ADR-007-callback-form-worker.md)          |

Full map: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Repository layout

```
apps/web             Next.js app (static export) — routes, sections, content fetches
apps/web/sites/      PER-SITE config: domain, Sanity target, nav, features, section order
apps/web/worker      Cloudflare Worker: /api/callback (Turnstile → Zod → Resend)
apps/studio          Sanity Studio (deployed per site)
packages/clinic      PER-VERTICAL document schemas (treatment, doctor, branch, …)
packages/sanity-schema  Generic kernel: localization, image URL, GROQ queries, validation
packages/ui          Design-system primitives (server-first; client surfaces are audited)
packages/tokens      Design tokens (CSS variables + Tailwind v4 @theme)
packages/seo         Sitemap, robots, redirects builders
packages/lib         Shared pure logic (form schema, worker handler)
packages/config      Shared ESLint/tsconfig/vitest presets
packages/migration   One-off WordPress → Sanity migration tooling (excluded from coverage)
```

**What is clinic-specific** (swap these for a new vertical): `packages/clinic`, `apps/web/sites/*`, route folders under `apps/web/app/*` (Turkish slugs are per-vertical by design), and the demo copy defaults in `apps/web/components/sections/*`.

## Quickstart

```bash
pnpm install
pnpm --filter web dev        # http://localhost:3000 (empty content until Sanity is wired)
pnpm build                   # requires SANITY_READ_TOKEN for real content
pnpm test                    # unit + coverage gates (100% for ui/lib/seo)
```

Quality gates run in CI on every PR: lint (strict + jsx-a11y), typecheck, coverage, build, bundle budget, `"use client"` audit, Playwright E2E (axe, keyboard, form journey) against `wrangler dev`, and Lighthouse budgets. See `.github/workflows/ci.yml`.

## Starting a new client site

Follow [docs/runbooks/new-site.md](docs/runbooks/new-site.md) — the under-one-hour checklist:

1. Create the Sanity project + datasets, deploy the Studio.
2. Add `apps/web/sites/<id>.ts`, register it in `apps/web/src/config.ts`, set `SITE_ID`.
3. Swap `packages/clinic` schemas for the vertical's content model (or keep them for clinic clients).
4. Set env vars (`SANITY_READ_TOKEN`, form secrets) in CI and the Worker.
5. Deploy the Worker project, attach the custom domain, verify headers + budgets.

## Repo conventions

- One issue → one branch (`feat/<n>-<slug>`) → one PR; CI must be green before merge (`scripts/merge-pr.mjs`).
- Commits follow Conventional Commits (commitlint + husky + lint-staged).
- `AGENTS.md` holds the automation/agent rules for this repo.
