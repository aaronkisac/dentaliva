# ADR-003 — No draft-mode visual editing; publish → webhook → rebuild

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

Sanity's Presentation tool requires two draft-mode HTTP endpoints; Next.js `output: 'export'` forbids Draft Mode (and middleware). Verified: Sanity's docs offer no static-export path for visual editing. Editors therefore cannot click-to-edit drafts in an iframe.

## Decision

v1 content flow: editors publish in Studio → Sanity **GROQ webhook** (published docs only) → Cloudflare Workers **deploy hook** → rebuild + deploy. Documented budget: **~2–3 min** publish-to-live. Editor preview = staging dataset + protected staging deployment (content visible without waiting for production), or wait out the production rebuild.

**Future options** (explicitly deferred, both compatible with this ADR): (1) stega-based click-to-edit over *published* content; (2) a "preview" deployment triggered by a draft webhook that builds with `perspective: previewDrafts` + a read token — build-time drafts, no server.

## Consequences

- Publish-to-live latency instead of instant draft preview — flagged to Aaron; accepted as the v1 default.
- Webhook quota on free plan (2) is sufficient: one production webhook per domain project.
- If the client later demands true visual editing, the escape hatch is a tiny always-on Worker serving draft-mode routes — a scoped, additive change (routing/`output` config), not a rewrite.

## Alternatives

- **Drop static export for SSR** to enable Presentation tool: rejected — inverts the architecture's core trade for one editor convenience.
- **Always-on preview server from day one**: rejected for v1 — operating cost/complexity before the client has asked for it.
