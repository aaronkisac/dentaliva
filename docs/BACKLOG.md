# Dentaliva — Product Backlog (Phase 3)

Status: **Proposed — awaiting Checkpoint 3 approval.** Nothing has been created on GitHub yet.
On approval: create private repo `aaronkisac/dentaliva` → 10 milestones (epics) + labels + issues below + Projects board. One issue = one branch (`feat/<issue#>-short-name`) = one PR.

Estimates: **S** ≤ ½ day · **M** ≈ 1–2 days · **L** = 3+ (split before creation — none below are L).

---

## Global Definition of Done (every PR)

- All CI checks green: lint → typecheck → unit+coverage → build → E2E → axe; Lighthouse on UI-affecting PRs.
- Coverage thresholds hold: **100 %** `ui`, `lib`, `seo`, clinic schema helpers; **≥ 90 %** global.
- No new axe violations; keyboard + focus verified for UI changes.
- Components documented (JSDoc + usage notes in package README).
- PR links its issue (`Closes #n`); UI changes include screenshots or preview URL.
- No secrets in client code; any new env var added to the runbook + wrangler/GitHub config docs.
- Conventional Commits; reviewed against the issue's acceptance criteria.

## Standing decisions affecting stories

- **Storybook: not adopted for v1.** RTL + jest-axe tests and Playwright screenshots cover design verification; Storybook's build/maintenance cost isn't justified for a 1–2 developer flow. Revisit when multiple starter clients are active.
- **Changesets: not adopted** — packages are unpublished workspace code (recorded in ARCHITECTURE.md §3).
- Blog stub URLs (~100) become `redirect` documents → generated `_redirects` 301s.

---

## Epic 1 — Foundations (milestone: `1-foundations`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| FND-1 | Scaffold Turborepo (pnpm workspaces, `apps/web`, `apps/studio`, empty packages per ARCHITECTURE §3) | S | — | `pnpm i && pnpm build` green; turbo `tasks` pipeline runs lint/typecheck/test/build across workspace |
| FND-2 | `packages/config`: tsconfig bases (strict + `noUncheckedIndexedAccess`), ESLint flat (TS strict, jsx-a11y, import boundaries), Prettier, Tailwind v4 preset, Vitest preset w/ coverage thresholds | M | FND-1 | Config packages consumed by a sample package; boundary rule demonstrably fails on a bad import (fixture test) |
| FND-3 | GitHub repo setup: branch protection on `main` (all checks required), PR template, labels (`epic/*`, `type/*`, `size/*`), Projects board | S | FND-1 | Board + labels exist; PR template applies; protection blocks unechecked merges |
| FND-4 | CI pipeline (GitHub Actions): lint → typecheck → unit+coverage → build (web+studio); pnpm cache | M | FND-2 | Pipeline green on sample PR; failing checks block merge (verified once) |
| FND-5 | commitlint + Husky + lint-staged (Conventional Commits) | S | FND-1 | Bad commit message rejected locally + in CI |
| FND-6 | Renovate (weekly, grouped minors/patches) + `pnpm audit` CI gate | S | FND-4 | Config file in repo; audit gate demonstrably fails on vulnerable fixture |

## Epic 2 — Design tokens & design system (milestone: `2-design-system`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| DSN-1 | Token extraction: prototype `:root` → `packages/tokens` (`tokens.ts` → CSS vars; Tailwind `@theme` mapping); AA contrast-validated pairs (navy/gold) | M | FND-2 | Token unit tests; contrast test proves AA pairs; visual smoke page |
| DSN-2 | Typography: `next/font` self-hosted Cormorant Garamond + Montserrat; type scale tokens; fluid sizes | S | DSN-1 | Font files self-hosted at build (no Google request at runtime); scale snapshot test |
| DSN-3 | Primitives batch 1: Button (cva variants, `as`), Container/Section, Heading/Text, Link (internal/external) | M | DSN-1,2 | Render/variant/interaction tests + jest-axe; focus-visible from tokens |
| DSN-4 | Primitives batch 2: Card, Badge/Tag, Accordion (FAQ — keyboard-complete) | M | DSN-3 | Interaction tests (keyboard, aria-expanded) + jest-axe |
| DSN-5 | Primitives batch 3: Header (responsive nav + mobile menu, focus trap) + Footer | M | DSN-3 | Mobile menu E2E (open/navigate/close/Esc); axe; breakpoints 360–1440 screenshots |
| DSN-6 | Motion primitives: Reveal (IntersectionObserver, stagger) gated by `prefers-reduced-motion` | S | DSN-3 | Reduced-motion test (animation skipped); observer test |
| DSN-7 | Form primitives: Input, Textarea, Select, Checkbox, FieldError, FieldWrapper | M | DSN-3 | Error/aria wiring tests (`aria-describedby`, `aria-invalid`) + jest-axe |

## Epic 3 — Sanity schema & Studio (milestone: `3-sanity-schema-studio`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| SAN-1 | `packages/sanity-schema` kernel: `defineLocalizedField` ({tr,en}, tr required), `seo` object, `imageWithAlt` (mandatory localized alt + hotspot), `blockSection`, `cta`, `stat`, `openingHours` | M | FND-2 | Schema validation tests (missing alt rejected, empty tr rejected); TypeGen extracts |
| SAN-2 | Clinic core documents: `treatment`, `doctor`, `branch` (fields per ARCHITECTURE §5, slug validation) | M | SAN-1 | Validation tests (unique slugs, required refs); preview structures compile |
| SAN-3 | Clinic supporting documents: `faq`, `testimonial`, `legalPage`, `siteSettings`, `homePage`, `redirect`, `blogPost` | M | SAN-1 | Validation tests; `redirect` from→to uniqueness |
| SAN-4 | `apps/studio`: structure/desks per document type, form previews, per-domain deploy config (env: project/dataset) | M | SAN-2,3 | Studio builds; env switch picks correct project/dataset (test fixture) |
| SAN-5 | TypeGen + query library: `prebuild` wiring (`schema extract` → `typegen generate`), typed GROQ queries in `packages/sanity-schema/queries.ts` | M | SAN-2,3 | Queries typecheck against generated types; query unit tests against fixture dataset |
| SAN-6 | Platform: create `dentaliva-com` project + `production`/`staging` datasets, CORS for domains, deploy Studio (needs Aaron's Sanity account) | S | SAN-4 | Datasets exist; Studio deployed; anonymous read works on production |

## Epic 4 — Page templates & composition (milestone: `4-page-templates`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| PGT-1 | Site config system: `sites/<id>.config.ts` schema (typed), env wiring (`SITE_ID`), feature flags | M | FND-2 | Config validation tests; unknown `SITE_ID` fails build with clear error |
| PGT-2 | App shell: root layout, header/footer from `siteSettings`, static-export-safe plumbing, 404 | M | SAN-5, DSN-5 | Build emits static HTML; settings-driven NAP renders; axe green |
| PGT-3 | Section composition engine + home template (section presets from site config, content from `homePage`) | M | PGT-2 | Preset reordering reflected in build; E2E home journey |
| PGT-4 | Treatment templates: list + detail (`generateStaticParams` from Sanity) | M | PGT-3 | All seeded treatments prerender; detail E2E; JSON-LD spot (Epic 6 wires) |
| PGT-5 | Doctor templates: list + detail | S | PGT-3 | Prerender count matches fixture; axe |
| PGT-6 | Branch templates: list + detail | S | PGT-3 | as above |
| PGT-7 | Static pages: about, gallery (grid + lightbox a11y), contact (map link, NAP), legal | M | PGT-2 | axe; lightbox keyboard tests |
| PGT-8 | Blog templates: index (pagination at build), post detail (portable text renderers) | M | PGT-3 | Posts prerender; code/link/blockquote renderers tested |
| PGT-9 | Localization rendering rules: empty `en` falls back per policy; TR-only v1 ships no locale segment | S | SAN-1 | Fallback unit tests |
| PGT-10 | Chatbot JSON API: `force-static` route handlers emitting prototype contract (`/api/clinic|services|doctors|faq|slots.json`), feature-flagged | S | SAN-5, PGT-1 | Contract tests vs prototype `api/*.json` shapes |

## Epic 5 — Content migration (milestone: `5-content-migration`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| MIG-1 | Crawler: sitemap-driven fetch of dentaliva.com → normalized JSON (pages, treatments, doctors, branches, FAQ, reviews) | M | — | Fixture-based transform tests; robots-respecting rate limit |
| MIG-2 | Transform → Sanity NDJSON: core content types; NAP reconciliation vs live site (live wins; deviations logged) | M | MIG-1, SAN-3 | Round-trip validation; NAP diff report reviewed |
| MIG-3 | Blog transform: ~30 curated posts → `blogPost`; ~100 stubs → `redirect` docs | M | MIG-2 | Redirect count matches stub list; portable text valid |
| MIG-4 | Asset pipeline: download live CDN images → Sanity assets; alt text seeding; LQIP metadata | M | MIG-2 | Import manifest verified; no hotlinks remain |
| MIG-5 | Import + verify: `sanity import`, page-vs-live spot checks, EN placeholder policy review with client | M | MIG-4, PGT-4–8 | Checklist sign-off; TR site fully renders from Sanity only |

## Epic 6 — SEO hooks (milestone: `6-seo`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| SEO-1 | `packages/seo`: metadata builder (title/description/canonical/OG/Twitter) from `seo` objects + fallbacks (100 % coverage pkg) | M | SAN-1 | Snapshot + fallback tests; validation of lengths |
| SEO-2 | JSON-LD: `Dentist`/`MedicalClinic` (siteSettings), `BreadcrumbList`, `FAQPage` | M | SEO-1, PGT-3 | Schema.org validation tests; rendered on templates |
| SEO-3 | `app/sitemap.ts` + `app/robots.ts` per domain; hreflang alternates from `sisterDomains` (dormant until ≥2 domains) | S | PGT-1 | Sitemap XML snapshot; hreflang pairs emitted when configured |
| SEO-4 | `_redirects` generation from `redirect` docs at build (301 plan) | S | SAN-3, PGT-1 | Generated file matches redirect docs; 301 E2E via wrangler dev |

## Epic 7 — Callback form & Worker (milestone: `7-callback-form`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| FRM-1 | `packages/lib/forms`: Zod schema (name, TR phone, optional time, KVKK consent), TR error copy (100 % coverage pkg) | S | FND-2 | Schema unit tests (invalid TR phones, missing consent) |
| FRM-2 | Client form: RHF + Turnstile (invisible) + honeypot + consent checkbox/aydınlatma link + inline success/error states | M | FRM-1, DSN-7 | Component tests (validation, states); E2E via FRM-4 mock |
| FRM-3 | Worker `POST /api/callback`: Zod → Turnstile Siteverify → rate-limit binding (5/60 s per IP) → Resend → 200; 400/429/502 mapping; no persistence | M | FRM-1 | Worker tests w/ mocked Siteverify+Resend; secrets not in bundle (CI grep) |
| FRM-4 | E2E form journey: `wrangler dev` + `MOCK_EXTERNAL=1` — success, validation failure, rate-limit, mail-failure paths | S | FRM-2,3 | 4 E2E scenarios green in CI |

## Epic 8 — Performance & accessibility hardening (milestone: `8-perf-a11y`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| PRF-1 | LCP/CLS pass: hero `priority` + LQIP, font display, `sizes` audit, layout stability | M | PGT-3, ADR-006 | Field of lab metrics: LCP < 2.0 s (Moto G/slow 4G), CLS < 0.05 |
| PRF-2 | A11y audit: keyboard sweep all templates, focus management, landmarks, reduced motion | M | PGT-4–8 | axe clean on all templates; manual keyboard checklist documented |
| PRF-3 | Lighthouse CI wiring + budgets (≥95×4); lhci↔Lighthouse-13 compat verified, else plain-lighthouse fallback | M | DEP-1 | CI runs against preview URL; budgets enforced (verified once by deliberate failure) |
| PRF-4 | Bundle budget: first-load JS ≤ 90 KB gzip shared; `"use client"` audit | S | FND-4 | CI check from build stats fails on regression |

## Epic 9 — Deployment & rebuild pipeline (milestone: `9-deployment`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| DEP-1 | Workers projects: `dentaliva-com` production + staging (Cloudflare Access on staging), custom domain (**needs DNS confirmed**) | M | FND-1 | Deploys serve static build; staging behind Access; domain resolves |
| DEP-2 | `_headers`: CSP + HSTS + security headers as reviewed code | S | DEP-1 | Header assertions in E2E; CSP report-clean |
| DEP-3 | Sanity webhook → deploy hook; rebuild-latency runbook (~2–3 min) | S | SAN-6, DEP-1 | Content publish triggers rebuild (verified live); latency measured |
| DEP-4 | PR previews + `main` → production via Workers Git integration | M | DEP-1 | Preview URL per PR verified; production deploys only from `main` |
| DEP-5 | Cloudflare Web Analytics beacon (cookieless, no banner) | S | DEP-1 | Beacon present; no cookies introduced (E2E assertion) |

## Epic 10 — Starter extraction & "new site" docs (milestone: `10-starter`)

| ID | Story | Est | Depends | Tests / AC |
|---|---|---|---|---|
| STR-1 | Genericize repo as GitHub template repository: clinic specifics confined to `packages/clinic` + sites config; seed/README for new clients | M | all core | Fresh `git clone` + checklist produces a building site (dry run) |
| STR-2 | `docs/runbooks/new-site.md` — the "under 1 hour" checklist (config file → Sanity project/datasets → Workers → DNS → webhook → Turnstile/Resend → seed) | M | DEP-3 | Runbook validated by a real dry-run; timings recorded |
| STR-3 | ZCode project skills in `.zcode/skills/`: `component-authoring`, `pr-workflow`, `sanity-schema`, `new-client-site` | M | STR-2 | Skills load in ZCode; each has frontmatter name/description/when_to_use |
| STR-4 | Handover: AGENTS.md/architecture docs moved into new repo as canonical; client access transfer checklist (Sanity, Cloudflare, GitHub) | S | STR-1 | Checklist reviewed; repo marked template |

---

**Totals**: 10 epics · **55 issues** (20 S, 35 M; SAN-6 and DEP-1 need platform accounts/DNS) — all individually shippable, dependency-ordered. Critical path: FND → DSN → SAN → PGT → MIG/SEO/FRM → PRF/DEP → STR.
