# ADR-002 — One Sanity project per domain, staging dataset included

Status: Proposed (Checkpoint 2) · Date: 2026-09-24

## Context

Sister domains (dentaliva.nl/.eu) will be independent sites with their own content. The brief asked us to evaluate (a) dataset-per-site in one project, (b) one dataset with a `site` field, (c) hybrid, against current Sanity plan limits. Verified limits (2026-09): free plan = **2 datasets/project, public only**, 10k docs/dataset, 20 seats, 2 GROQ webhooks; a 3rd dataset is **$999/mo even on Growth**; cross-dataset references are **Enterprise-only**; one Studio config binds one projectId.

## Decision

**One Sanity project per domain** (`dentaliva-com` now; `dentaliva-eu`, `dentaliva-nl` later). Each project gets `production` + `staging` datasets (fits the 2-dataset cap). Schema is shared code (`packages/sanity-schema`, `packages/clinic`) — sites differ by data, never by schema. Studio is one codebase deployed per domain via env (`SANITY_STUDIO_PROJECT_ID/DATASET`).

## Consequences

- Zero content coupling between domains; each domain gets its own webhook quota and document budget.
- No cross-dataset references needed — and they wouldn't be available below Enterprise anyway.
- Free-plan datasets are **public**: production reads need no token (good for static builds); staging drafts are world-readable at the API level → staging deployments protected with Cloudflare Access; no sensitive content in staging.
- Three Sanity projects to manage (acceptable: one clinic today; MCP/CLI automation keeps it cheap).

## Alternatives

- **(a) Dataset-per-site, one project**: breaks on plan limits (3+ datasets = $999/mo) and one-Studio-per-project makes editing awkward.
- **(b) One dataset + `site` field**: works within limits but couples all domains into one document pool; every query/migration/uniqueness rule must filter by site; webhook → rebuild is all-or-nothing unless filtered per site; rejected as the starter default.
- **(c) Hybrid**: unnecessary complexity at this scale.
