# Phase 0 — Tooling Setup Guide (Dentaliva Rebuild)

Verified against vendor docs on **2026-09-23**. Versions move fast — re-verify before acting on anything stale.

## Machine baseline (as found)

| Tool | Found | Target | Action |
|---|---|---|---|
| Node.js | v24.14.1 | v24 LTS (current patch 24.21.0 "Krypton") | None required; optional patch bump |
| pnpm | 11.1.2 | 12.x | `npm install -g pnpm@latest` |
| npm | 11.11.0 | — | Fine |
| gh CLI | 2.89.0, authed as `aaronkisac` (scopes: gist, read:org, repo, workflow) | 2.101.0 + `project` scope | `winget install --id GitHub.cli --source winget`, then `gh auth refresh -s project` |
| wrangler | not installed | — | **Intentionally deferred** — added as repo devDependency when scaffolded (Cloudflare's recommendation: local, not global) |
| turbo | not installed | — | DevDependency at scaffold time (`npx create-turbo@latest` to scaffold) |
| sanity CLI | — | use via npx | `npx sanity@latest <cmd>` — no global install (current documented idiom) |

**Dead ends to avoid:** corepack (removed from Node 25+ bundling; not a recommended pnpm path), `npm create sanity@latest` (no longer in docs — use `npx sanity@latest init`), global wrangler.

## ZCode configuration mechanics (verified)

- **MCP user scope**: `~/.zcode/cli/config.json` → `mcp.servers`. Fallback `~/.agents/mcp.json` is read **only if** the `.zcode` config defines no servers — so migrating means *merging* fallback servers into the primary file (done: `wordpress` was preserved).
- **MCP project scope**: `<repo>/.zcode/config.json` → `mcp.servers`. Read from repo root down to cwd; user overrides workspace for same-named servers; all scopes auto-connect at session start.
- **Schema is strict** — unknown keys silently drop the server.
  - stdio: `command` (string), `args[]`, optional `cwd`, `env`, `enabled`, `timeoutMs`
  - http/sse: `url`, optional `headers`, `enabled`, `timeoutMs`; `type: "http"`
- **Windows gotchas**: stdio `command` must be a string pointing at a `.cmd`/`.exe` (the `{"command":"cmd","args":["/c","npx",…]}` pattern works — see the `wordpress` entry); no `${VAR}` expansion in config files.
- **Skills**: `<repo>/.zcode/skills/<name>/SKILL.md` (project) / `~/.zcode/skills/` (user) / `~/.agents/skills/` (cross-tool fallback). Frontmatter needs `name` + `description` (≤ 1024 chars) or the skill is dropped; optional `when_to_use`.
- **AGENTS.md**: `~/.zcode/AGENTS.md` (user) then `<repo>/AGENTS.md` (workspace, searched upward from cwd).
- No documented "import MCP config from Claude Code/Codex" feature — the `.agents/mcp.json` fallback and `.claude-plugin`/`.codex-plugin` manifest compatibility are the bridges.

## MCP servers — added (user scope)

Config lives in `~/.zcode/cli/config.json`. All are HTTP-transport remote servers; auth happens on first tool call.

| Server | URL | Purpose | Auth |
|---|---|---|---|
| `sanity` | `https://mcp.sanity.io` | 40+ tools: GROQ queries, documents CRUD, schema, datasets, releases, studio deploys | OAuth in browser on first call (~7-day session); API-token header optional |
| `cloudflare-docs` | `https://docs.mcp.cloudflare.com/mcp` | Official Cloudflare docs lookup | CF OAuth |
| `cloudflare-bindings` | `https://bindings.mcp.cloudflare.com/mcp` | Workers/Pages resources (KV, R2, bindings config) | CF OAuth |
| `cloudflare-builds` | `https://builds.mcp.cloudflare.com/mcp` | Workers Builds / deploy status | CF OAuth |
| `context7` | `https://mcp.context7.com/mcp` | Version-current library docs (Next.js, Sanity, turbo) | Free API key optional (`Authorization: Bearer …` for higher limits) |
| `wordpress` | stdio `cmd /c npx -y @cavort-it-systems/wordpress-mcp` | Pre-existing (ABC-hotel work) — preserved verbatim | env |

## MCP servers — deliberately skipped / deferred

| Server | Reason |
|---|---|
| GitHub (`https://api.githubcopilot.com/mcp/`) | `gh` CLI already authed and covers issues/milestones/projects/PRs (`gh project …` needs the `project` scope). Revisit if native in-chat GitHub tools are missed. |
| Playwright MCP (`npx @playwright/mcp@latest`) | ZCode's browser-use plugin already covers interactive browsing/reference-site inspection. Revisit for E2E authoring convenience. |
| Next.js DevTools (`npx next-devtools-mcp@latest`) | Real and current (Next 16 exposes `/_next/mcp`), but needs a running dev server — add at **project scope** when the app scaffold exists. Tools: `get_errors`, `get_routes`, `get_compilation_issues`, docs gateway. |
| Figma (`https://mcp.figma.com/mcp`) | Only if we route design through Figma (Phase 1 Q1/Q2). Remote server works on all plan seats. |
| Framer | No MCP server exists. `npx @framer/agent setup` installs agent skills — not needed; the public deployed template is our reference. |

## CLIs — install/upgrade commands (Windows, Git Bash)

```bash
# pnpm 12 (npm-based install is pnpm's current Windows recommendation)
npm install -g pnpm@latest

# gh CLI upgrade
winget install --id GitHub.cli --source winget

# Projects v2 scope (device flow — opens browser, enter one-time code)
gh auth refresh -s project
gh auth status && gh project list   # verify
```

Later, inside the monorepo: `pnpm add -D wrangler turbo @lhci/cli` (versions as of 2026-09-23: wrangler 4.137.0, turbo 2.11.3, @lhci/cli 0.15.1, sanity 6.16.0, next 16.3.6, next-sanity 13.3.4, playwright 1.63.0, vitest 5.0.1, @axe-core/playwright 4.13.0, jest-axe 11.0.0, next-intl 4.14.6).

## Verification checklist (Checkpoint 0)

1. Restart ZCode (or Settings → MCP) → `sanity`, `cloudflare-docs`, `cloudflare-bindings`, `cloudflare-builds`, `context7`, `wordpress` all show **connected**.
2. Smoke-test: sanity `whoami`; cloudflare-docs one query.
3. `gh auth status` shows `project` scope; `gh project list` returns (possibly empty) list.
4. `pnpm --version` → 12.x.

## Platform facts this project relies on (verified 2026-09-23)

- **Cloudflare**: Pages docs open with "Are you sure you want to use Pages?" — Workers with static assets is the recommended path for new projects. `_headers`/`_redirects` work natively; deploy hooks exist for both (Sanity webhook → deploy hook is a documented pattern); static-asset requests on Workers are free; custom domains on Workers require Cloudflare-managed DNS. Turnstile is free (≤ 20 widgets, server-side Siteverify validation mandatory). Workers has a native Rate Limiting binding (10s/60s periods). Resend publishes an official Workers send guide.
- **Sanity**: free plan = 2 datasets/project (public only), 10k docs/dataset, 20 seats, 2 GROQ webhooks; Growth = private datasets, 4 webhooks, 3rd+ dataset $999/mo; cross-dataset refs = Enterprise only. Presentation tool requires Draft Mode endpoints → incompatible with `output: 'export'`. TypeGen GA (`sanity schema extract` → `sanity typegen generate`, config in `sanity.cli.ts`). Live Content API available on free plans.
- **Next.js 16**: static export forbids rewrites/redirects/headers/middleware(proxy)/draft mode/ISR/server actions; custom image `loaderFile` is the supported path; `app/sitemap.ts`/`app/robots.ts` prerender at build; params/searchParams must be awaited; Turbopack default bundler.
