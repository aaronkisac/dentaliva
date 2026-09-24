# ADR-001 — Static export on Cloudflare Workers with static assets

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

The brief fixed "Cloudflare Pages" but asked us to verify Cloudflare's current direction. As of 2026-09: the Pages docs open with "Are you sure you want to use Pages?" and state Workers is "Cloudflare's primary platform… Start new projects with Workers." Workers static assets reached feature parity for everything we need.

## Decision

Deploy each domain as a **Workers project with static assets**: `output: 'export'` → `out/` as the assets directory, plus a Worker script handling `POST /api/callback` (`run_worker_first: ["/api/*"]`). `_headers` and `_redirects` are supported natively (replacing Next's forbidden `headers()`/`redirects()` config). Deploy hooks exist for Workers Builds (Sanity webhook target). PR previews are automatic.

## Consequences

- We follow the platform Cloudflare actively develops; Pages legacy risk avoided.
- Custom domains **require Cloudflare-managed DNS** — must be confirmed for dentaliva.com (and later .eu/.nl) before first deploy. This is the one dimension where Pages is more permissive.
- Static export constraints apply (no draft mode, middleware, rewrites/headers/redirects, ISR, server actions) — embraced here and compensated in ADR-003/006/007.

## Alternatives

- **Cloudflare Pages** (as briefed): still supported with static-export guide + deploy hooks, but explicitly not recommended for new projects.
- **SSR/`@cloudflare/next-on-pages`-style rendering**: rejected — content-driven marketing sites are static-first; SSR adds runtime cost and failure modes for near-zero benefit.
