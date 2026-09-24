# ADR-004 — Single config-driven web app for all domains

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

Three domains will share design and code but have independent content, campaigns and possibly different sections. The brief requires: adding a domain = "configuration plus content, no refactor", and a documented "new site in under 1 hour" target.

## Decision

One `apps/web` codebase; a site is fully described by `apps/web/sites/<id>.config.ts` (domain, locales, Sanity project/dataset, feature flags, section presets). One **Workers project per domain** builds the same app with `SITE_ID` (+ Sanity ids) set. Page composition is config- + CMS-driven (section presets in site config, section content from Sanity), so sites can add/remove/reorder sections without code forks. Campaigns are CMS documents, not code.

## Consequences

- New domain = 1 config file + platform setup (Sanity project, Workers project, DNS, webhook) — hours, not weeks.
- All sites inherit fixes/features automatically; drift between domains is impossible by construction.
- Cost: the app carries light per-site config logic and `features`/`sections` flags — kept data-only and typed.
- `hreflang` alternates derive from each site's `sisterDomains` config (emitted in sitemaps) once ≥2 translated domains exist.

## Alternatives

- **App-per-domain** (`apps/web-tr`, `apps/web-eu`…): maximal freedom per site but guaranteed divergence — fixes must be applied N times; rejected as the starter default. Escape hatch: an app shell is cheap to split out later if a site truly diverges.
- **One deployment with host-based routing**: rejected — domains are separate sites/deploys per the brief; host-routing forces one runtime and shared blast radius.
