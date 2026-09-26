# Dentaliva — Account & Asset Handover Checklist

Handover transfers **ownership** of every account and artifact from the
developer (Aaron Kisac) to the client. Sign the checkboxes as each item is
completed; the site is considered handed over when all boxes are ticked.

Canonical sources of truth (all in this repo, `main` branch):

- **Architecture & decisions:** `docs/ARCHITECTURE.md` + `docs/adr/ADR-001..007`
- **Backlog / board:** `docs/BACKLOG.md` + GitHub Project (Delivery board)
- **New-site runbook:** `docs/runbooks/new-site.md`
- **Agent rules:** `AGENTS.md`, ZCode skills in `.zcode/skills/`

> Note: when this repo is used as a template for a new client, transfer the
> _new_ client's accounts (not dentaliva's) using the same checklist.

## 1. Domain & DNS

- [ ] dentaliva.com registrar account: credentials transferred **or** ownership
      confirmed with client-held email; 2FA re-enrolled by client.
- [ ] Nameservers moved to / confirmed on **Cloudflare** nameservers.
- [ ] DNS records exported and shared with client (A/CNAME, MX, SPF, DKIM
      records added for Resend sending domain).
- [ ] Client can log in to Cloudflare and view the zone.

## 2. Cloudflare (Workers, domains, Turnstile)

- [ ] Cloudflare account ownership transferred to client (or client creates an
      account and the Worker + domain are moved/invited to it).
- [ ] Workers project `dentaliva-com` visible in client's dashboard.
- [ ] Custom domains attached: apex + `www` (canonical redirect working).
- [ ] Deploy hook URL created and shared (used by the Sanity webhook, step 5).
- [ ] Turnstile widget for dentaliva.com visible in client's dashboard; **site
      key** documented in `apps/web/.env.example`; **secret key** rotated to a
      value only the client knows.
- [ ] `wrangler login` performed with a client-owned account and verified with
      `npx wrangler whoami` on the client's machine.

## 3. Sanity (Content Lake + Studio)

- [ ] Sanity project `86x2hbzv` ownership transferred to client's Sanity
      account (or project invited and admin handed over).
- [ ] Client has admin on `production` and `staging` datasets.
- [ ] All API tokens reviewed: developer personal tokens **revoked**; a fresh
      viewer token is created by the client and stored as CI secret.
- [ ] Studio deployed to `dentaliva-com.sanity.studio` from a client-owned
      account; client can log in and edit documents.
- [ ] Webhook (publish → deploy hook) visible under the client's Sanity
      project; last test rebuild fired successfully.

## 4. GitHub (repo, CI, board)

- [ ] Repository `aaronkisac/dentaliva` transferred to the client's
      organization/account, **or** client added as owner and developer demoted
      after acceptance.
- [ ] Branch protection on `main` (CI required check, no force push) confirmed.
- [ ] Repository secrets updated under client control: `SANITY_READ_TOKEN`
      (+ Cloudflare API token when DEP-4 previews are wired).
- [ ] Project board (Delivery) transferred/shared; all 55 issues resolved or
      explicitly accepted as out of scope.
- [ ] Client performed (or witnessed) one full edit → publish → rebuild cycle.

## 5. Email delivery (Resend)

- [ ] Resend account ownership transferred to client.
- [ ] Sending domain (e.g. `mail.dentaliva.com`) verified with DKIM records
      visible in the client's DNS.
- [ ] API key rotated to a client-held key and updated in the Worker secret
      (`RESEND_API_KEY`).
- [ ] Test submission of the callback form received at the client's inbox
      (`NOTIFY_EMAIL`).

## 6. Credentials & secrets hygiene

- [ ] Every secret listed above rotated so no developer-held value works.
- [ ] Password manager entries for all client accounts shared via secure
      channel and then changed by the client.
- [ ] 2FA enabled and recovery codes stored by the client for: registrar,
      Cloudflare, Sanity, GitHub, Resend.
- [ ] Developer access removed or reduced to read-only, per client decision.

## 7. Acceptance

- [ ] Client walked through this checklist with the developer.
- [ ] `docs/BACKLOG.md` closed out; any deferred items logged as new issues in
      the client's repo.
- [ ] Developer confirms: no personal credentials remain valid on any account.
- [ ] Client signs off (date + name):

      Handover completed on ______ by ____________________
