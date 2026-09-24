# Dentaliva — Architecture

Status: **Proposed** — awaiting Checkpoint 2 approval (Aaron). Decisions are detailed in `docs/adr/ADR-001…007`.
Verified against current docs 2026-09-23/24. Versions move; re-check before upgrading.

---

## 1. Goals & constraints

1. Production-grade Dentaliva site (dentaliva.com, Turkish, v1) — LCP < 2.0 s (Moto G Power / slow 4G), CLS < 0.05, INP < 200 ms, Lighthouse ≥ 95 ×4, WCAG 2.2 AA.
2. Reusable starter: next client (clinic/hotel/service) live in **hours** — configuration + content, no refactor.
3. Sister domains (dentaliva.nl Dutch, dentaliva.eu English) will be **independent sites** (own content, campaigns, possibly different sections) sharing design + code.

Fixed: Next.js App Router + TS strict + Tailwind, `output: 'export'`, Sanity Content Lake, Cloudflare **Workers with static assets** (ADR-001), Turborepo on GitHub (PR per change, CI, branch protection), Vitest + RTL + Playwright + axe.

## 2. Stack (verified 2026-09-23)

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.3.x |
| Language/UI | TypeScript (strict + `noUncheckedIndexedAccess`), React | 19.x |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) + CSS custom properties from tokens | 4.x |
| CMS | Sanity Studio v6 / Content Lake, TypeGen for typed GROQ | 6.16 / next-sanity 13 |
| Hosting | Cloudflare Workers + static assets (1 project per domain), Worker for `/api/*` | wrangler 4.x |
| Forms | React Hook Form + Zod, Cloudflare Turnstile, Resend | zod 4.x |
| Monorepo | Turborepo + pnpm workspaces | turbo 2.11, pnpm 12, Node 24 LTS |
| Testing | Vitest 5 + RTL + jest-axe; Playwright 1.63 + @axe-core/playwright; @lhci/cli (maintenance mode — see §9) | current |

## 3. Monorepo layout

```
dentaliva/
├── apps/
│   ├── web/                     # Next.js app — one codebase, N deployments (ADR-004)
│   │   ├── sites/               #   per-domain site configs (site.com TR, site.eu EN, …)
│   │   ├── app/                 #   routes (static-export safe only)
│   │   ├── worker/              #   Worker entry: POST /api/callback (form), static assets alongside
│   │   └── wrangler.jsonc
│   └── studio/                  # Sanity Studio — shared codebase, deployed per domain via env
├── packages/
│   ├── tokens/                  # single source of design tokens → CSS vars + Tailwind @theme
│   ├── ui/                      # design-system primitives (100% coverage)
│   ├── clinic/                  # vertical module: clinic Sanity schema + section components (ADR/§5)
│   ├── sanity-schema/           # shared schema kernel, GROQ queries, TypeGen types
│   ├── seo/                     # meta, canonical, hreflang, JSON-LD, sitemap/robots builders (100%)
│   ├── lib/                     # i18n dictionary, validation schemas (form), fetchers, utils (100%)
│   └── config/                  # eslint flat, tsconfig bases, tailwind preset, vitest preset, prettier
├── docs/ (ARCHITECTURE.md, adr/, runbooks)
├── turbo.json, pnpm-workspace.yaml, .github/workflows/
└── AGENTS.md
```

Deviation from the brief's suggestion: added **`packages/clinic`** (approved Q11 default) so the clinic domain model is a swappable vertical; the starter core is `ui + tokens + sanity-schema + seo + lib + config`. `apps/docs`-style extras deliberately omitted — READMEs + this doc suffice at this scale. `changesets` not adopted: packages are unpublished workspace code, versions ride git tags (documented decision).

## 4. Multi-site & i18n strategy (ADR-002, ADR-004)

**One Sanity project per domain** (free plan allows it; Growth pricing would not): `dentaliva-com` today; `dentaliva-eu`, `dentaliva-nl` later. Each project: `production` + `staging` datasets (2-dataset cap). Free-plan datasets are public → production reads need **no token**; staging builds use a read token and its Workers URL is protected with Cloudflare Access.

**One web app, N deployments.** A site is fully described by `apps/web/sites/<id>.config.ts`:

```ts
export const site = {
  id: 'com', domain: 'www.dentaliva.com', locales: ['tr'], defaultLocale: 'tr',
  sanity: { projectId: '…', dataset: 'production', stagingDataset: 'staging' },
  i18n: { sisterDomains: ['dentaliva.eu', 'dentaliva.nl'] },   // feeds hreflang alternates
  features: { callbackForm: true, chatbotApi: true, blog: true, careers: false },
  sections: { home: ['hero','quickServices','about','videoTestimonials','reviews','gallery','doctors','faq','cta'] },
} as const
```

Build/deploy: one **Workers project per domain**, each built from the same app with `SITE_ID=com` (+ Sanity ids as env). Different sections per site = config + CMS-driven composition; campaigns = CMS documents with scheduling. Within-domain locale routing (`/en`) is **deferred**: EN ships as the .eu domain; the schema is localized from day one so adding a locale segment later is additive.

**hreflang**: emitted per domain from `i18n.sisterDomains` in `app/sitemap.ts` (Google accepts sitemap hreflang) once ≥2 domains have translated equivalents; until then self-canonical only. robots.txt + sitemap.xml are per-domain build outputs.

**New site in under 1 hour** (runbook target):
1. `cp apps/web/sites/com.ts apps/web/sites/<id>.ts` + edit (~10 min)
2. Sanity: create project + production/staging datasets, deploy Studio with env (MCP/CLI) (~15 min)
3. Cloudflare: create Workers project + secrets, bind domain (DNS must be on CF nameservers), create deploy hook (~15 min)
4. Sanity webhook → deploy hook; Turnstile widget; Resend domain DKIM (~10 min)
5. Seed content (migration NDJSON or Studio) → build goes green (~10 min)

## 5. Content model (Sanity)

All schema lives in `packages/sanity-schema` (kernel) + `packages/clinic` (vertical types); sites differ by **data**, never by schema. Localized fields use a shared `defineLocalizedField` helper (`{tr, en}` fieldsets — no plugin lock-in, TypeGen-friendly); `tr` required, `en` optional in v1.

**Documents**: `homePage` (singleton), `treatment`, `doctor`, `branch`, `blogPost`, `faq`, `testimonial`, `legalPage`, `siteSettings` (singleton: NAP, hours, WhatsApp, socials, map), `redirect` (from → to, feeds `_redirects`).
**Objects**: `seo` (metaTitle, metaDescription, ogImage, noIndex, canonicalOverride), `imageWithAlt` (asset, localized alt, hotspot), `blockSection` (portable text), `cta`, `stat`, `openingHours`.
**Clinic types**: `treatment` (slug, summary, body, steps/benefits, faqs→refs, doctors→refs, priceNote, image, seo), `doctor` (name, title, bio, photo, socials, treatments→refs), `branch` (address, geo, phone, hours, mapLink, seo).
**Chatbot JSON API preserved**: `force-static` route handlers emit the prototype's contract (`/api/clinic|services|doctors|faq|slots.json`) from Sanity content — same shapes, now CMS-driven (feature-flagged per site).

Migration: fresh crawl → transform → NDJSON → `sanity import`; ~30 curated posts; ~100 stub posts become `redirect` docs (301 plan); top reviews re-entered as `testimonial`; YouTube kept as stored video IDs (privacy-enhanced embeds). **NAP reconciled against live site** (live wins: +90 212 555 54 82 / info@dentaliva.com / Avcılar–Başakşehir–Altunizade / daily 9–23) — client confirms at content review.

## 6. Data flow

- **Build-time GROQ**, typed with TypeGen: `sanity schema extract` → `sanity typegen generate` wired as `prebuild`; queries in `packages/sanity-schema/queries.ts` via `defineQuery()`. `generateStaticParams` derives routes from fetched slugs. Public dataset → anonymous client; staging/preview builds inject a read token.
- **Content updates**: Sanity GROQ webhook (published docs only) → Cloudflare Workers **deploy hook** → rebuild + deploy. Documented budget: **~2–3 min** publish-to-live. No draft mode, no Presentation tool (ADR-003); editors verify on staging (separate dataset + protected Workers URL) or wait out the production rebuild.
- **Images** (ADR-006): `images.loader: 'custom'` + `loaderFile` building Sanity/imgix CDN URLs — responsive `srcset`/`sizes`, AVIF/WebP via `auto=format`, hotspot-aware crops, `priority` on the LCP hero, intrinsic width/height + LQIP blur placeholder (CLS-safe).

## 7. Design system

- **Tokens** (`packages/tokens`): single `tokens.ts` — color (navy `#0c1f38`, gold `#c9a35c`, ivory/ink scale), type scale (Cormorant Garamond + Montserrat via `next/font`, self-hosted at build), spacing, radii, shadows, breakpoints, motion, z-index. Emitted as CSS custom properties; Tailwind v4 `@theme` (in `packages/config`) maps them to utilities. **No design values outside tokens** (lint-enforced via import boundaries).
- **Components** (`packages/ui`): composition-first; variants via `cva`; `forwardRef` on interactive elements; polymorphic `as` only where justified (Button, Section). Copy never hardcoded — content flows from CMS through props.
- **A11y**: semantic landmarks + skip link; keyboard-complete patterns (accordion, mobile menu, focus trap where needed); ARIA only where semantics fall short; token-validated contrast pairs (navy/gold combos checked for AA in token tests).
- **Motion**: durations/easings are tokens; reveal-on-scroll (IntersectionObserver, staggered) **gated by `prefers-reduced-motion`**; no parallax; ambient hero animation pauses under reduced motion.

## 8. Callback form (ADR-007)

Client: RHF + Zod (shared schema in `packages/lib/forms`) — name, phone (TR format), optional preferred time, **KVKK consent checkbox** linking the aydınlatma metni, Turnstile widget (invisible), honeypot.
Worker (`apps/web/worker`, same deployment as assets): parse → Zod → **Turnstile Siteverify (mandatory)** → rate-limit binding (per-IP 5/60 s) → **Resend** (verified `mail.dentaliva.com` → clinic inbox) → JSON 200. Errors: 400 validation / 429 rate / 502 mail — mapped to inline TR copy. **No persistence** anywhere (no KV/D1); PII lives only in the clinic's mailbox. Fallback: phone/WhatsApp link on failure UX.

## 9. Quality gates

- **Lint/type**: ESLint flat (strict TS, `jsx-a11y`, import boundaries between packages), Prettier, `tsc --noEmit` strict.
- **Vitest**: coverage **100 %** `ui`, `lib`, `seo`, `clinic` schema helpers; **≥ 90 %** global; every exclusion carries an inline reason. Component tests: render/variants/interaction + jest-axe.
- **Playwright**: critical journeys (home → treatment → doctor → form submit success/failure with Turnstile/Resend mocked via `wrangler dev` + `MOCK_EXTERNAL=1`), axe scans per template, screenshots at 360/768/1024/1440 vs reference.
- **Performance**: Lighthouse CI budgets (LCP < 2.0 s mobile profile, CLS < 0.05, INP < 200 ms, ≥ 95 ×4) run against the Workers preview URL. ⚠ `@lhci/cli` is maintenance-mode (0.15.1, mid-2025) — verify Lighthouse-13 compat at implementation; fallback is plain `lighthouse` + assertion script (same budgets). Bundle budget: first-load JS ≤ 90 KB gzip/shared route, checked from `next build` output in CI.
- **Repo hygiene**: Conventional Commits (commitlint), Husky + lint-staged, branch protection requiring all checks.

## 10. CI/CD & environments

GitHub Actions (PR): lint → typecheck → unit+coverage → build (web + studio) → Playwright (static build served locally; form journey under `wrangler dev`) → Lighthouse on preview deploy. All required for merge.
Deploys: Cloudflare Workers Git integration per domain project — PR → preview URL; `main` → production. Content publish → Sanity webhook → deploy hook (independent of git). Staging = staging dataset + protected staging deployment. Renovate (weekly, grouped minor/patch; major PRs individually); `pnpm audit` gate in CI.

## 11. Security

- Secrets only as Worker/GitHub env (`TURNSTILE_SECRET`, `RESEND_API_KEY`); client bundle sees only the Turnstile site key. Production dataset reads are anonymous (public dataset) — no token in build output.
- `_headers` (static-export-safe, no Next `headers()`): CSP (self; Sanity+imgix images; Turnstile scripts/frame; youtube-nocookie frames; fonts self), HSTS, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, COOP. Generated and reviewed as code.
- KVKK: consent checkbox + aydınlatma metni link on the form; no server-side PII persistence (documented stance; mailbox retention is the clinic's control).
- Dependency strategy: Renovate + lockfile + audit gate (choice over Dependabot: better monorepo/pnpm grouping).

## 12. Risks & open questions

| # | Risk / question | Mitigation / owner |
|---|---|---|
| 1 | **DNS on Cloudflare nameservers unconfirmed** for dentaliva.com | Blocker only at first deploy; confirm with client (Aaron) |
| 2 | NAP conflicts (prototype vs live site) | Live wins by default; client confirms during content review |
| 3 | ReoDental licence has no explicit terms | Layout patterns only; no asset/copy reuse (ADR-005) |
| 4 | lhci ↔ Lighthouse 13 compatibility unverified | Fallback: plain lighthouse CLI + assertions, same budgets |
| 5 | Free-plan **staging datasets are public** | Cloudflare Access on staging URLs; no sensitive drafts in staging |
| 6 | Editors may expect visual editing | Set expectation at handoff; rebuild ~2–3 min; revisit stega/draft-preview later (ADR-003) |
| 7 | ~100 blog URLs dropped | `redirect` docs → `_redirects` 301s; SEO manager reviews list |
| 8 | Turkish slug transliteration | Slug helper with TR-aware transliteration, unit-tested |
| 9 | Brand assets (logo vector) not yet provided | Extract from live site as interim; flag for client |
| 10 | Form recipient email unconfirmed | Default `info@dentaliva.com`; confirm before Phase 4 form work |
