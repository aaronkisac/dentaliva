# Runbook: New client site under one hour

Checklist for spinning up a new client site from this template. Each step
carries a **target** timing; the **recorded** column holds what a real dry run
actually took (see [Validation status](#validation-status)).

Total target: **≤ 60 minutes** of operator time (DNS propagation and the first
CI run are wall-clock waits, not operator time).

## Prerequisites (one-time, not in the hour)

- Node 24 + pnpm 12 (`npm i -g pnpm`), `gh` CLI authenticated.
- Accounts: GitHub (this repo), Sanity, Cloudflare, Resend.
- Tool access: `npx sanity@latest`, `npx wrangler@latest` (no global installs).
- Registrant access to the client's DNS (Cloudflare nameservers required for
  Workers custom domains + Resend DKIM).

## Checklist

| #   | Step                                   | Target | Recorded                                             |
| --- | -------------------------------------- | ------ | ---------------------------------------------------- |
| 0   | Clone + install                        | 5 min  | **2 min** (clone + `pnpm install`, dry run)          |
| 1   | Site config file                       | 10 min | ⏳                                                   |
| 2   | Sanity project + datasets + read token | 10 min | ⏳ (executed once for dentaliva: ~8 min incl. OAuth) |
| 3   | Studio env + deploy                    | 5 min  | ⏳ (dentaliva: ~4 min)                               |
| 4   | Content seed                           | 15 min | ⏳ (varies with vertical)                            |
| 5   | Workers project + secrets              | 5 min  | ⏳                                                   |
| 6   | DNS + custom domain                    | 5 min  | ⏳ (propagation: wall clock, 5–30 min)               |
| 7   | Sanity webhook → deploy hook           | 5 min  | ⏳                                                   |
| 8   | Turnstile + Resend keys                | 5 min  | ⏳                                                   |
| 9   | CI secrets + first green build         | 5 min  | ⏳ (dentaliva CI round trip: ~5 min)                 |

### 0. Clone + install (2 min measured)

```bash
gh repo clone aaronkisac/dentaliva <client> && cd <client>
pnpm install
pnpm --filter web build   # token-less: proves the empty-CMS build (STR-1 dry run: exit 0)
```

### 1. Site config file (10 min)

- `apps/web/sites/<id>.ts` — copy `com.ts`; set `domain`, `locales`, `sanity.{projectId,dataset,stagingDataset}`, `nav`, `features`, `sections.home` order.
- Register in `apps/web/src/config.ts` (`registry` map).
- Route folders under `apps/web/app/*` are per-vertical: rename the Turkish slugs if the vertical isn't a clinic, update the nav hrefs to match.
- Demo copy defaults live in `apps/web/components/sections/*` — replace with the client's tone.
- Brand tokens: `packages/tokens/src` (+ `packages/config/tailwind/theme.css`).
- Set `SITE_ID=<id>` in `apps/web/.env` (and CI env later). An unknown `SITE_ID` fails the build loudly.

### 2. Sanity project + datasets (10 min)

```bash
npx sanity@latest init                     # creates project, ties apps/studio
npx sanity@latest dataset create production --visibility public
npx sanity@latest dataset create staging   --visibility private
# Read token (Content Lake → API → Tokens): viewer role, feeds SANITY_READ_TOKEN
```

Free plan fits 2 datasets per project = production + staging (ADR-002).
CORS: allow the Studio hostname + `http://localhost:3333`.

### 3. Studio env + deploy (5 min)

- `apps/studio/.env`: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET=production`.
- `npx sanity@latest deploy` → `<client>-com.sanity.studio`. Sanity project ID is
  baked into `apps/web/sites/<id>.ts` — the web build never embeds secrets.

### 4. Content seed (15 min)

Minimum for a building site: `siteSettings`, `homePage` (hero/about/gallery),
one `treatment`, one `doctor`, one `branch`, KVKK legal page, optional blog posts.
For clinic verticals, reuse `packages/migration` crawl/transform/import tooling
against the old site. Publish (drafts don't render — ADR-03 webhook rebuild).

### 5. Workers project + secrets (5 min)

```bash
cd apps/web
npx wrangler deploy                       # first deploy creates the project
npx wrangler secret put TURNSTILE_SECRET  # step 8
npx wrangler secret put RESEND_API_KEY    # step 8
npx wrangler secret put NOTIFY_EMAIL      # where callback leads to
npx wrangler secret put MAIL_FROM         # e.g. mail.<client-domain>
```

Static assets + `_redirects` + `_headers` (per-route CSP) ship with the deploy.

### 6. DNS + custom domain (5 min + propagation)

- Move the domain to Cloudflare nameservers (client/registrar action — often the
  only step outside our control).
- Workers → Settings → Domains: attach apex + `www` (redirect to canonical).
- Resend domain + DKIM records (needed before the callback form mails).

### 7. Sanity webhook → deploy hook (5 min)

- Cloudflare Workers → Deploy Hooks: create `sanity-publish`.
- Sanity → Manage → Webhooks: POST to the hook URL on `create/update/delete`
  for all document types. Editors publish → rebuild lands in ~2–3 min (ADR-003).

### 8. Turnstile + Resend keys (5 min)

- Cloudflare Turnstile: add widget for the domain (invisible mode), copy the
  **site key** into `apps/web/.env` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and the
  **secret key** into the Worker secret (step 5).
- Resend: verify the sending domain, create API key → Worker secret.

### 9. CI secrets + first green build (5 min)

- Repo → Settings → Secrets: `SANITY_READ_TOKEN` (+ Cloudflare API token when
  wiring preview deploys, DEP-4).
- Push any change → CI must pass all gates: lint, typecheck, coverage, build,
  bundle budget, use-client audit, E2E (axe/keyboard/form journey), Lighthouse.
- Verify live: security headers (`curl -sI https://<domain>`), callback form
  end-to-end, Lighthouse against production.

## Verification (before handover)

- [ ] `pnpm build` green locally with the real token; page count matches content.
- [ ] Live domain serves 200 + HSTS + per-route CSP; `/_redirects` legacy URLs work.
- [ ] Callback form: real submission received at `NOTIFY_EMAIL`.
- [ ] Sanity publish → rebuild webhook fires (edit a doc, watch the deploy).
- [ ] Lighthouse ≥ 95 per category on production (PRF-3 budget moves here).

## Validation status

- ✅ Executed: step 0 (STR-1 dry run — fresh clone, install 35 s, token-less
  build exit 0, 23 static pages) and the CI round trip (dentaliva repo, ~5 min).
- ✅ Executed once on the founding site (dentaliva): Sanity project/datasets/
  Studio deploy (~12 min total), Workers config, webhook, Turnstile/Resend —
  see repo history (#70–#72, #94, #104).
- ⏳ Pending live validation on a SECOND site (blocked on a real client /
  Cloudflare credentials — DEP-1): steps 1, 4–9 timings above are targets, to
  be re-recorded at first use and updated here.
