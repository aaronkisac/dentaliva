# ADR-007 — Callback form: same-deployment Worker + Turnstile + Zod + Resend, zero persistence

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

The callback form (name, phone, optional preferred time, KVKK consent) must reach the clinic by email **without persisting personal data**, with spam protection, server-side validation, and rate limiting. Hosting is Workers with static assets (ADR-001).

## Decision

The form API ships **inside the same Workers deployment** as the assets (`run_worker_first: ["/api/*"]`) — no second service to operate. Pipeline: JSON parse → **Zod** (shared schema in `packages/lib/forms`, also used client-side by RHF — one source of truth) → **Turnstile Siteverify** (mandatory server-side; tokens single-use, 300 s TTL) → native **rate-limit binding** (per-IP, 5/60 s) → **Resend** `emails.send()` (verified `mail.dentaliva.com`, clinic inbox `info@dentaliva.com` — recipient to be confirmed) → JSON 200. **No KV/D1/R2 writes anywhere.** Error semantics: 400 field errors / 429 rate-limited / 502 mail failure, mapped to inline TR copy; failure UX offers phone/WhatsApp fallback. KVKK: required consent checkbox + aydınlatma metni link; PII exists only in transit and in the clinic's mailbox (documented stance).

## Consequences

- One deploy, one domain, no cross-service latency or auth for the form path; Workers free tier comfortably covers clinic traffic.
- Secrets (`TURNSTILE_SECRET`, `RESEND_API_KEY`) live only as Worker secrets; the client bundle holds only the Turnstile site key.
- Resend is a new vendor dependency (official Cloudflare Workers guide exists); swap point is a single `sendEmail` module.
- The prototype's chatbot booking contract (`serverless/appointments.js` semantics) informs the error/response shape, keeping chatbot integration conventions consistent.

## Alternatives

- **Separate form Worker/project**: operationally pointless at this traffic; rejected.
- **Pages Functions**: superseded by ADR-001.
- **Third-party form services** (Formspree et al.): PII passes through another processor + monthly cost; rejected for a KVKK-sensitive flow we can own end-to-end.
