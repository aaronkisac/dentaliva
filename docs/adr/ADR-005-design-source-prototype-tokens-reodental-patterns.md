# ADR-005 — Design source: prototype token system; ReoDental for layout patterns only

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

Two design references exist and they conflict: the ReoDental Framer template (briefed) is warm off-white/bronze with Geist; the existing dental-clinic prototype is a complete navy/gold system (navy `#0c1f38`, champagne gold `#c9a35c`, Cormorant Garamond + Montserrat, hairline/diamond motifs) with a finished 4-page TR/EN design. ReoDental is a free "Remix" marketplace template with **no explicit licence terms**; it also shows template-churn artifacts (placeholder counters, leftover mailto). Default accepted at Checkpoint 0: prototype direction wins.

## Decision

- `packages/tokens` derives from the **prototype's** `css/style.css :root` system (colors, type scale, spacing, shadows, breakpoints, motion) — promoted to a reviewed, contrast-validated token set.
- **ReoDental is mined for layout/section patterns only** (hero structures, service grids, testimonial/FAQ composition at 360–1440 px). No ReoDental assets, copy, or mailto/brand remnants are copied.
- The prototype's HTML is not ported; its I18N dictionary and section inventory seed the Sanity content model.

## Consequences

- Brand-coherent, already-complete visual language; no palette translation work.
- Licence risk eliminated (inspiration-only, own implementation).
- If the client later produces brand assets (logo vector, guidelines), tokens update in one package.

## Alternatives

- **Faithful ReoDental clone**: rejected — palette/type contradict the approved navy/gold direction, and licence terms are unstated.
- **ReoDental layout + token reskin**: kept as a *technique* (extract layout patterns, map tokens), not as the source of truth.
