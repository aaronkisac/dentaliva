---
name: sanity-schema
description: Dentaliva starter'da içerik modeli değiştirirken kullan — packages/clinic doküman şemaları, locale alanlar, GROQ sorguları, typegen ve %100 kapsam kuralı.
when_to_use: Yeni içerik tipi eklerken, alan değiştirirken, GROQ sorgusu yazarken veya Studio şemasını deploy ederken.
---

# Sanity schema workflow (Dentaliva starter)

## Katmanlar

- **Dikey şemalar** `packages/clinic/src/documents/*` — treatment, doctor,
  branch, faq, testimonial, legalPage, siteSettings, homePage, blogPost,
  redirect. Yeni içerik tipi buraya (veya yeni dikey paketine) girer.
- **Jenerik çekirdek** `packages/sanity-schema/src/*` — `localeString` /
  `localeText` (tr zorunlu, en opsiyonel; `pickLocalized` ile oku), `imageWithAlt`
  (alt metin zorunlu), SEO object, `validation` yardımcıları. Dikey şemalar
  bunları kullanır, tersi asla.
- **Sorgular** `packages/sanity-schema/queries/*` — `defineQuery` ile; liste
  sorguları sadece `_type`, slug, name/görünen alanları projecte eder. Sorgu
  sonuç tipleri `apps/web/src/content/*` içinde el yazısı arayüzlerle eşleşir.

## Değişiklik sonrası zorunlu adımlar

```bash
cd apps/studio
npx sanity schema extract --force    # schema.json güncelle (--force şart)
npx sanity typegen generate          # packages/sanity-schema/sanity.types.ts
```

- Şema değişikliği Studio'ya deploy gerektirir: `npx sanity deploy` (deploy
  auth'u ilk çağrıda tarayıcı OAuth ister).
- `packages/clinic` ve `packages/sanity-schema` coverage eşiği **%100** — yeni
  alan/yardımcı için test yazmadan geçmez (`pnpm --filter @dentaliva/clinic test`).
- `redirect` dokümanı eklemek üretimde `public/_redirects` üretir
  (`apps/web/scripts/generate-redirects.mjs`, prebuild).
- Boş dataset senaryosunu unutma: `generateStaticParams` boş dönemez — seed
  fallback (`_seed` + `SeedPlaceholder`) pattern'i korunmalı (STR-1).
