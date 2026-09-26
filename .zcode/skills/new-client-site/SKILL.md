---
name: new-client-site
description: Bu starter'dan yeni bir müşteri sitesi açarken kullan — site config, Sanity projesi, Workers deploy, DNS/webhook ve doğrulama adımlarının kaynağı.
when_to_use: Yeni dikey/müşteri için repo kopyalanırken, SITE_ID/site config eklerken veya deploy sonrası doğrulama yaparken.
---

# New client site (Dentaliva starter)

**Birincil kaynak: `docs/runbooks/new-site.md`** — dakika hedefli tam kontrol
listesi (STR-2 dry run'ı ile doğrulandı). Bu skill yalnızca hızlı referans.

## Sıra

1. `gh repo clone` → `pnpm install` → token'sız `pnpm --filter web build`
   (boş CMS build'i çalışmalı — kırılırsa template bozulmuş demektir).
2. `apps/web/sites/<id>.ts` + `apps/web/src/config.ts` registry kaydı +
   `SITE_ID` env. → bilinmeyen `SITE_ID` build'i yüksek sesle patlatır.
3. Sanity: `npx sanity@latest init`, production(+staging) dataset'ler, viewer
   read token → `SANITY_READ_TOKEN`. CORS: Studio hostname + localhost:3333.
4. `apps/studio` deploy: `npx sanity deploy`.
5. İçerik seed: siteSettings + homePage + en az birer treatment/doctor/branch
   - KVKK (publisheD dokümanlar; draft render edilmez).
6. Workers: `npx wrangler deploy` + secret'lar (TURNSTILE_SECRET,
   RESEND_API_KEY, NOTIFY_EMAIL, MAIL_FROM).
7. DNS Cloudflare nameserver'larında → Workers custom domain + Resend DKIM.
8. Sanity webhook → Cloudflare deploy hook (publish → rebuild ~2-3 dk).
9. CI secret'ları → ilk yeşil build → canlı doğrulama (headers, form, Lighthouse).

## Kritik kırmızı çizgiler

- Dikey spesifik şema `packages/clinic`'te, site config `apps/web/sites/`'te —
  core paketlere (ui/tokens/seo/lib) clinic mantığı sızmaz.
- Yeni `"use client"` = `use-client-audit.mjs` allowlist + gerekçe.
- Build'ler fresh clone'da çalışmak zorunda (`.next` cache'ine güvenme —
  bayat route cache NAP verisini bayat bırakabilir; CI fresh clone kullanır).
