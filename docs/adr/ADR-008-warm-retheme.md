# ADR-008: Warm re-theme (ReoDental-inspired palette)

## Date

2026-09-28

## Status

Accepted (Aaron's choice over "keep navy/gold" and a hybrid option)

## Context

Aaron reviewed the rebuilt site and expected the ReoDental reference
(https://reodental.framer.website/) to show visually. ADR-005 restricted
that reference to layout patterns only (unclear Framer licence), which kept
the prototype's navy/gold identity. The section skeleton already followed
the shared layout patterns; the gap was purely the **palette mood**:
ReoDental is warm off-white + espresso darks + bronze, while the site was
ivory + navy + gold with a serif display face.

## Decision

Re-theme at the token layer only (`packages/tokens/src/tokens.ts` values),
keeping every semantic key name (`navy` → warm espresso dark, `gold` →
bronze) so Tailwind utilities, contrast pairs and components keep working:

| Token                | Before              | After                        |
| -------------------- | ------------------- | ---------------------------- |
| ivory (bg)           | `#faf7f2`           | `#faf9f6`                    |
| navy2/3 (dark ramp)  | `#122b4a`/`#1a3a5f` | `#241d15`/`#322a1f`          |
| navy (dark sections) | `#0c1f38`           | `#1c1610`                    |
| gold (accent)        | `#c9a35c`           | `#c09a55`                    |
| goldDeep/Soft        | `#a8823d`/`#e6cfa0` | `#96733f`/`#e3d2ab`          |
| ink / muted (text)   | `#2a3648`/`#6b7686` | `#2b2620`/`#7a746b`          |
| line/gradient/shadow | navy/gold tints     | warm tints of the new values |

Typography is unchanged (Cormorant Garamond + Montserrat) — the serif
display matches the reference's elegant mood without copying it. The
palette is our own interpretation, not a verbatim copy (ADR-005 licence
rule still enforced: no reference assets or copy).

## Consequences

- Token-level swap: one file + generated CSS; components unchanged.
- WCAG pair assertions (packages/tokens) still pass; prohibited pairs
  still fail as designed. axe E2E clean.
- The "navy"/"gold" key names are now historical — renaming them to
  `primary`/`accent` is possible later but is deliberate churn and stays
  out of scope.
