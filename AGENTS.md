# AGENTS.md — Dentaliva Rebuild

Shared memory for ZCode sessions on this project. ZCode keeps no memory across sessions — **this file and `docs/` are the source of truth**. Keep the phase/status table current after every checkpoint.

> Canonical copy: **`aaronkisac/dentaliva`** (seeded 2026-09-24 with all planning docs). This prototype-repo copy is kept in sync during planning for session memory; Phase 4 makes `dentaliva` the only working repo.

---

## Project

Rebuilding **Dentaliva** (dental clinic, Istanbul; local + dental-tourism patients) as a **Next.js (App Router) + Sanity headless CMS** static-first site on **Cloudflare**, as a **Turborepo monorepo** that doubles as a **reusable client starter** (next clinic/hotel/service business must spin up in hours).

Two goals of equal weight:
1. Production-grade Dentaliva site (architecture, code quality, UX, performance, a11y, testing).
2. Reusable starter — every architectural decision is judged against this.

## Current phase & status

| Phase | Scope | Status |
|---|---|---|
| 0 — Tooling setup | MCP servers, CLIs, ZCode config | **Done 2026-09-24** — MCP config written (verify in Settings → MCP after ZCode restart); gh 2.101 ✓; pnpm 12.6 installed (stale `C:\Program Files\nodejs\pnpm*` shims shadow it — needs elevated `del`, non-blocking); `gh project` scope still missing — run `gh auth refresh -s project -h github.com` before Phase 3 |
| 1 — Discovery | 14 numbered questions | **Closed 2026-09-24** — Aaron accepted all defaults ("ok you can go on"); decisions recorded below |
| 2 — Architecture | `docs/ARCHITECTURE.md` + `docs/adr/ADR-001…007` | **Approved 2026-09-24 (Checkpoint 2)** |
| 3 — Backlog | `docs/BACKLOG.md` — 10 epics, **55 issues** | **Complete 2026-09-24** — private repo `aaronkisac/dentaliva` seeded; 10 milestones, labels, issues #1–#55; **Dentaliva Delivery** board live (all 55 items, Status=Todo): https://github.com/users/aaronkisac/projects/1 |
| 4 — Execution | One issue → one branch → one PR | Blocked on Checkpoint 3 + explicit go |

**Checkpoints (⏸) are hard stops.** Do not continue past 0/1/2/3 without Aaron's explicit reply. Do not use Goal mode / full-access mode until Phase 4 is explicitly approved. **No application code until Phase 4.**

## Fixed decisions (do not re-open)

Next.js App Router + TypeScript strict + Tailwind; `output: 'export'` static-first; Sanity (Content Lake + Studio, no self-hosted CMS); GitHub (single Turborepo repo, Issues + Milestones + Projects board, PR-per-change linked to issue, GitHub Actions CI, branch protection on `main`); Vitest + RTL (unit/component), Playwright (E2E), axe (a11y); v1 = Turkish site only but i18n/multi-domain ready from day one; SEO manager owns meta copy/keywords — editable in Sanity without code.

**Approved deviations/recommendations (confirmed at Checkpoint 0):**
- **Cloudflare Workers with static assets instead of Pages** — Cloudflare's docs direct new projects to Workers ("primary platform"). Feature parity for our needs (`_headers`/`_redirects`, deploy hooks, PR previews, free static requests). Constraint: custom domains require DNS on Cloudflare nameservers.
- **One Sanity *project* per domain** (not dataset-per-site): free plan = 2 datasets/project (public only), 3rd dataset $999/mo, cross-dataset refs are Enterprise-only. Each domain project gets production + staging datasets. Shared schema in `packages/sanity-schema`.
- **No draft-mode visual editing** — Presentation tool needs Draft Mode HTTP endpoints; static export forbids them. v1: publish → Sanity webhook → deploy hook → rebuild (~2–3 min). Preview-from-drafts (build-time preview deployment) is the Phase 2 fallback option.
- **ReoDental licence**: free "Remix" Framer template, no explicit terms → layout-pattern inspiration only; no copying of assets or copy.

**Defaults in force until overridden:** design = navy/gold prototype direction (ReoDental for layout patterns); v1 = core pages + ~30 curated blog posts; new private repo `aaronkisac/dentaliva` in a fresh folder **outside OneDrive**; analytics = Cloudflare Web Analytics only (cookieless, no banner); email via Resend; small PRs (≤ ~400 lines); prototype repo left untouched/online.

## Engineering standards (all phases)

- Readable, boring, well-named code. No dead code, no `any`, no unexplained `eslint-disable`.
- Static/server-first; minimal client JS; `"use client"` only where interactivity requires it.
- Strict separation: no hardcoded copy in components, no design values outside tokens.
- Every reusable component: typed, accessible (WCAG 2.2 AA), responsive, token-driven, tested (render/variants/interaction/a11y).
- Coverage: 100% for `packages/ui`, `packages/lib`, `packages/seo`; ≥ 90% global. Every exclusion documented.
- Conventional Commits; Husky + lint-staged; commitlint.
- Document the "why" in ADRs/READMEs. When unsure, ask — don't guess.

## Key facts & sources (verified 2026-09-23)

- **Prototype (this repo)**: static HTML/CSS/JS; keep = TR/EN content seed (`api/*.json`, I18N dict in `js/main.js`), navy/gold tokens (`css/style.css :root`), chatbot API contract (`API.md`, `serverless/appointments.js`). HTML pages: throwaway. **NAP data conflict**: prototype (Bağcılar / +90 546 455 6 455 / smildentaliva@gmail.com / Mon–Sat 9–22) contradicts live site (+90 212 555 54 82 / info@dentaliva.com / Avcılar-Başakşehir-Altunizade / daily 9–23) — reconcile during migration; live site wins by default.
- **dentaliva.com** (content source): ~56 pages (24 treatments, 19 doctors, 3 branches, about/gallery/contact/KVKK/careers) + 134 blog posts (~30 substantial, ~100 stubs). TR-only (no `/en`); EN authored fresh. Trustindex reviews, YouTube testimonials (`@dentaliva`), WhatsApp `wa.me/905308405482`, Elementor popup forms.
- **ReoDental** (design reference): https://reodental.framer.website/ — 2 pages, warm off-white/bronze/Geist; layout patterns only.
- **Tooling guide**: `docs/phase0-tooling.md` (verified install steps, MCP config, versions).

## Resolved decisions (Phase 1 defaults accepted by Aaron, 2026-09-24)

1. **Design**: navy/gold prototype direction; ReoDental = layout patterns only (ADR-005). Brand assets: none provided — extract logo from live site as interim, flag to client.
2. **v1 pages**: home, about, 24 treatments, 19 doctors, 3 branches + branch pages, gallery, contact, KVKK/legal. Careers **dropped**.
3. **Blog**: ~30 substantial posts migrate; ~100 stubs → `redirect` docs → `_redirects` 301 plan (SEO manager reviews).
4. **Migration**: one-off script (fresh crawl → transform → NDJSON → `sanity import`); reviews re-entered as Sanity `testimonial` (no Trustindex embed); YouTube via stored video IDs (privacy-enhanced embeds).
5. **Canonical NAP**: live site wins — +90 212 555 54 82 / info@dentaliva.com / Avcılar–Başakşehir–Altunizade / daily 9:00–23:00; WhatsApp wa.me/905308405482.
6. **Form**: Resend, sender `mail.dentaliva.com`, recipient `info@dentaliva.com` (confirm before Phase 4 form work); KVKK text adapted from existing /kvkk page, client signs off.
7. **Accounts**: private repo `aaronkisac/dentaliva`; Sanity + Cloudflare under Aaron, transferred at handover; no client GitHub access for now.
8. **Analytics**: Cloudflare Web Analytics only — cookieless, no cookie banner; no GA4/GTM in v1.
9. **Environments**: PR preview deploys + staging dataset per Sanity project (Cloudflare Access on staging URLs).
10. **Studio UX**: no draft-mode visual editing; publish → webhook → rebuild ~2–3 min (ADR-003).
11. **Starter scope**: generic core (`ui/tokens/sanity-schema/seo/lib/config`) + clinic vertical isolated in `packages/clinic` (ADR-004 layout).
12. **Chatbot API**: no known production consumers of prototype `/api/*`; prototype repo stays untouched/online. Contract preserved in v1 via static route handlers (feature-flagged).
13. **DNS**: unconfirmed — dentaliva.com on Cloudflare nameservers is a deploy-time blocker (Risk #1 in ARCHITECTURE.md).
14. **Timeline**: no hard deadline; small PRs ≤ ~400 lines; S/M/L estimates.

## Remaining open items (non-blocking, tracked in ARCHITECTURE.md §12)

- DNS on Cloudflare nameservers (Risk #1) · brand assets (Risk #9) · form recipient confirmation (Risk #10) · KVKK aydınlatma metni owner sign-off · MCP server smoke-test after ZCode restart · `gh auth refresh -s project` before Phase 3 backlog creation.
