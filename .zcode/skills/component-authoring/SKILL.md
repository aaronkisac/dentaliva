---
name: component-authoring
description: Dentaliva starter'da (packages/ui veya apps/web) React bileşeni yazarken/güncellerken kullan — server-first kurallar, token kullanımı, erişilebilirlik ve test zorunlulukları.
when_to_use: Yeni UI bileşeni eklerken, mevcut bileşeni değiştirirken veya "use client" sınırına dokunurken.
---

# Component authoring (Dentaliva starter)

## Server-first

- Components are **server components by default**. `"use client"` requires a
  real reason (state, effects, dialogs, observers) AND an entry in
  `apps/web/scripts/use-client-audit.mjs` ALLOWED with a one-line
  justification — CI fails otherwise.
- Data fetching happens in server components via the GROQ content modules in
  `apps/web/src/content/*` (never in `packages/ui`).

## Styling

- Tailwind v4 with tokens from `@dentaliva/tokens` — colors are semantic
  (`bg-navy text-white border-gold`), spacing/type via `var(--dvn-*)` tokens.
  Never hardcode hex values.
- Compose classes with `cn()` from `packages/ui/src/cn.ts`.
- Brand buttons/links: `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-gold` (WCAG 2.2 keyboard-only rings).
- Motion: keep durations on tokens; anything animated must respect
  `prefers-reduced-motion` (the global rule in `apps/web/app/globals.css`
  covers CSS; JS animations must short-circuit via `matchMedia` like
  `packages/ui/src/reveal.tsx`).

## Images

- Always `next/image` with the custom Sanity loader: explicit `width`/`height`
  (CLS), a `sizes` string, `placeholder="blur"` + `blurDataURL={lqipUrl(...)}`,
  and `priority` only for the LCP image. Helper: `refDimensions` +
  `lqipUrl` from `@dentaliva/sanity-schema/image-url`.

## Accessibility (CI-enforced)

- One `<h1>` per page; heading levels in order (axe `heading-order`).
- Touch targets ≥ 24px (Lighthouse `target-size`).
- Form fields: label + `aria-invalid`/`aria-describedby` wiring exists in
  `packages/ui/src/field.tsx` — reuse it.
- New UI primitives in `packages/ui` get a `tests/<name>.test.tsx` with a
  "has no axe violations" case (`expectNoA11yViolations` helper). Coverage
  gate for the package is 100%.

## Tests + gates before opening a PR

```bash
pnpm --filter @dentaliva/ui test        # or the touched package
pnpm lint && pnpm typecheck && pnpm test
pnpm --filter web build && pnpm --filter web test:bundle
npx playwright test --filter web        # from apps/web: axe + keyboard + headers + form
```
