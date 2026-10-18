# Runbook: Deploys — production, staging, domain (DEP-1)

First deploy and ongoing deploys of the site to Cloudflare Workers with static
assets. The Workers config lives in `apps/web/wrangler.jsonc`:

- **Root config = production** → Worker `dentaliva-com`, `MOCK_EXTERNAL=0`
  (real Turnstile + Resend), rate-limit namespace `1001`.
- **`env.staging`** → Worker `dentaliva-com-staging`, `MOCK_EXTERNAL=1` (can
  never send real mail), rate-limit namespace `1002`.

One-time prerequisite (account owner, browser OAuth):

```bash
cd apps/web
npx wrangler login        # opens the browser; log in with the Cloudflare account
npx wrangler whoami       # must list the account
```

First deploy on a **new** account also needs a workers.dev subdomain
(dashboard: the deploy error links the onboarding page, or via API:
`PUT /accounts/{id}/workers/subdomain {"subdomain":"<name>"}`). Recorded for
dentaliva 2026-09-27: subdomain **`dentaliva.workers.dev`** →
`dentaliva-com.dentaliva.workers.dev` (prod) and
`dentaliva-com-staging.dentaliva.workers.dev` (staging).

## 1. Staging (5 min)

```bash
pnpm --filter @dentaliva/web deploy:staging
# → https://dentaliva-com-staging.<account-subdomain>.workers.dev
```

Lock the URL behind Cloudflare Access (dashboard, one-time):

1. Zero Trust → **Access → Applications → Add an application → Self-hosted**.
2. Application domain: `dentaliva-com-staging.<account-subdomain>.workers.dev`.
3. Policy: **Allow** → Emails → the operator's address (One-time PIN).
4. Open the staging URL: the Access login must appear before any content.

Staging runs with `MOCK_EXTERNAL=1`, so form submissions are validated but no
real mail leaves the Worker — safe to share for review.

## 2. Production (10 min)

Secrets **before** the first deploy, so `/api/callback` is functional the
moment the site is reachable (all four are Worker secrets, none in git):

```bash
cd apps/web
npx wrangler secret put TURNSTILE_SECRET   # Turnstile widget secret key
npx wrangler secret put RESEND_API_KEY     # Resend sending key
npx wrangler secret put NOTIFY_EMAIL       # info@dentaliva.com
npx wrangler secret put MAIL_FROM          # "Dentaliva <mail.dentaliva.com>" — after the Resend domain is verified
pnpm --filter @dentaliva/web deploy:prod
# → https://dentaliva-com.<account-subdomain>.workers.dev
```

`deploy:prod` / `deploy:staging` always build first (`next build` → static
export → generated `_headers`/`_redirects` ship with the deploy).

The public Turnstile **site key** goes into `apps/web/.env` /
`.env.example` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and needs a rebuild.

## 3. Custom domains (5 min + propagation)

Requires the `dentaliva.com` zone on Cloudflare nameservers (ARCHITECTURE.md
Risk #1 — registrar-side change, the one step outside this repo).

1. Dashboard → Workers & Pages → `dentaliva-com` → **Settings → Domains &
   Routes → Add → Custom domain**: `dentaliva.com`, then `www.dentaliva.com`
   (Cloudflare creates the DNS records; keep one canonical — redirect `www`
   to apex).
2. Verify: `curl -sI https://dentaliva.com` → `200`, HSTS + per-route CSP
   present; a legacy blog URL from `_redirects` returns `301`.

## Verification

- [x] Staging URL serves the site; `/api/callback` answers validation errors
      (mock mode — no mail). _Access lock still pending — see below._
- [x] Production workers.dev URL serves the site with HSTS + per-route CSP
      (verified 2026-09-27); a legacy blog URL from `_redirects` returns `301`.
- [x] `/api/callback` behaves: staging `200 {ok:true}` in mock mode;
      production answers `400 Doğrulama başarısız` until `TURNSTILE_SECRET`
      is set (fail-loud, by design).
- [ ] Rate-limit binding: deployed (5 req/60s) but **permissive by design** —
      Cloudflare's Workers rate limiting is eventually consistent and
      per-isolate, so short bursts can exceed the limit. Treat it as abuse
      shaping, not a hard quota; Turnstile is the real bot gate.

## Related (separate issues, need the same login)

- **DEP-3** — Workers → `dentaliva-com` → Settings → **Deploy Hooks**: create
  `sanity-publish`, paste the URL into a Sanity manage webhook (create/update/
  delete, all docs). Rebuild budget ~2–3 min (ADR-003).
- **DEP-4** — Cloudflare API token (Workers deploy permission) as repo secret
  `CLOUDFLARE_API_TOKEN`, then wire PR previews / main→production.
- **DEP-5** — enable Cloudflare Web Analytics on the zone/Worker.

> Template use (`docs/runbooks/new-site.md`): these names are per-site values
> in `apps/web/wrangler.jsonc` (`name`, Access domain, deploy hooks) — repeat
> steps 1–3 for each new client.

## 4. Second instance: dentaliva.eu (INT milestone 12)

Same codebase, second site — ADR-002/004 delivered end to end (2026-10-18):

- **Site config**: `apps/web/sites/eu.ts` (projectId `84n9qnfg`, domain
  `www.dentaliva.eu`, en locale, `/services`-style segments).
- **Workers**: `wrangler.eu.jsonc` → `dentaliva-eu` (prod, namespaces 1003)
  and `dentaliva-eu-staging` (mock mode, namespace 1004), `LOCALE=en`,
  `NOTIFY_FALLBACK=info@dentaliva.eu`.
- **Build**: `node scripts/build-site.mjs --site eu [--env staging]` sets the
  full site-scoped env from the registry; tokens are per-project
  (`SANITY_READ_TOKEN_EU` — anonymous v1 reads omit documents, so real
  content builds need the token).
- **Deploy**:
  ```bash
  pnpm --filter @dentaliva/web deploy:eu:staging   # dentaliva-eu-staging
  pnpm --filter @dentaliva/web deploy:eu:prod      # dentaliva-eu (needs secrets)
  ```
- **Recorded 2026-10-18**: staging live at
  `https://dentaliva-eu-staging.dentaliva.workers.dev` — 11 page types 200,
  TR segments 404 (prune), legacy `/dental-implant/` → 301
  `/services/dental-implant` (105 CMS redirect rules served from
  `out/_redirects`), HSTS + per-route CSP verified.
- **Secrets still pending (account owner)**: `TURNSTILE_SECRET`,
  `RESEND_API_KEY`, `NOTIFY_EMAIL`, `MAIL_FROM` for `dentaliva-eu` (+ staging
  mocks fine without), `SANITY_READ_TOKEN_EU` repo secret, Resend domain
  verify for `dentaliva.eu`, Turnstile widget for the eu domain, DNS →
  Cloudflare nameservers + custom domains.
- **Studio**: `https://dentaliva-eu.sanity.studio` (built with
  `SANITY_STUDIO_DEFAULT_LOCALE=en` → en-required, tr-optional fields).
