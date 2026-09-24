# ADR-006 — Images via Sanity CDN custom loader

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

`output: 'export'` disables Next.js image optimization (default loader). The brief requires responsive `srcset`/`sizes`, AVIF/WebP, correct LCP priority, and CLS-free placeholders.

## Decision

`images: { loader: 'custom', loaderFile: '.../sanity-loader.ts' }`. The loader builds **Sanity/imgix CDN URLs**: width-per-descriptor `srcset` with `sizes`, `auto=format` (AVIF/WebP), `fit=crop` honoring hotspot/crop metadata, quality tokens, DPR caps. Every image renders intrinsic `width`/`height`; hero/LCP images use `priority` and a LQIP blur-up (from Sanity asset metadata) painted in a token color. Alt text is mandatory (localized) in the `imageWithAlt` schema object — the type system rejects missing alt at build.

## Consequences

- Zero image processing at origin/deploy; CDN cache hits for all domains (URL-based, per-domain builds share hotspot-aware crops).
- Depends on Sanity CDN availability — accepted (it is the system of record for assets).
- `next/image` layout/placeholder APIs still function; only the URL generation is custom.

## Alternatives

- **`images.unoptimized: true`**: no srcset/responsive behavior by default; rejected.
- **Self-hosted image pipeline at build** (sharp resize into `out/`): bloats deploys and rebuild times; rejected for a CMS-driven starter.
- **Cloudflare Images/Resizing**: extra product + cost; Sanity CDN already provides resize/format/crop.
