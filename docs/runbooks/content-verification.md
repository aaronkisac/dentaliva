# Runbook: Content verification (MIG-5)

Sign-off checklist for the migrated content: the production dataset is
verified programmatically, then spot-checked page-by-page against the live
site, and finally accepted by the client.

**Dataset:** Sanity project `86x2hbzv`, `production` (staging stays empty
until preview deploys need it — DEP-4).

## 1. Programmatic verification

```bash
cd packages/migration
node verify.mjs                 # add --dataset staging to target the other dataset
```

Checks (exit 1 on any ❌):

- Dataset counts equal the NDJSON outputs: 24 treatment, 19 doctor, 3 branch,
  24 blogPost, 110 redirect (+ 1 authored `legalPage.kvkk`).
- Every migrated `_id` exists; every featured-image reference resolves to an
  uploaded asset (42 uploaded, 42 referenced).
- Zero hotlinks to `dentaliva.com/wp-content` remain in dataset text.
- `legalPage.kvkk` has a real TR body (the KVKK page renders from it).
- No duplicate redirect from-slugs.

Known, accepted warnings:

- `doctor.dt-sehmus-saygin` has no featured photo (matches the live page).
- `legalPage.kvkk` is dataset-only — authored per decision #6, not crawled.

## 2. Manual spot checks (page vs live)

Serve the build locally (`pnpm --filter @dentaliva/web build && npx wrangler
dev --port 8788` from `apps/web`) and compare each pair — title tag, H1, hero
image, and body substance. NAP values must match the canonical decision (+90
212 555 54 82 · info@dentaliva.com · Avcılar–Başakşehir–Altunizade · daily
9:00–23:00 · WhatsApp wa.me/905308405482).

| #   | Live (www.dentaliva.com)                            | Local                                             | Notes                                     |
| --- | --------------------------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| 1   | `/implant-tedavisi/`                                | `/hizmetlerimiz/implant-tedavisi`                 | Sample doc: also carries EN copy — see §3 |
| 2   | `/protez-dis-tedavisi/`                             | `/hizmetlerimiz/protez-dis-tedavisi`              | Hero image + body from migrated assets    |
| 3   | `/dt-dila-das/`                                     | `/hekimlerimiz/dt-dila-das`                       | Name, unvan, photo                        |
| 4   | `/dt-sehmus-saygin/`                                | `/hekimlerimiz/dt-sehmus-saygin`                  | The no-photo doctor — placeholder OK?     |
| 5   | `/altunizade/`                                      | `/subelerimiz/altunizade`                         | Address, phone, map/geo                   |
| 6   | `/kvkk/`                                            | `/kvkk`                                           | Authored doc — client legal review        |
| 7   | `/blog/en-iyi-ve-guvenilir-dis-dolgusu-cesitleri/`  | `/blog/en-iyi-ve-guvenilir-dis-dolgusu-cesitleri` | Body, date, excerpt                       |
| 8   | `/blog/dis-ipi-nedir-nasil-kullanilmalidir/` (stub) | `/`                                               | `_redirects` 301 to home (SEO-4)          |

- [ ] Spots 1–8 compared by a human; differences are Studio-fixable, not code.

## 3. EN placeholder policy (client review)

v1 is Turkish-only; **EN is authored fresh later, not machine-migrated**
(PGT-9: an empty locale falls back to TR at render). The dataset currently
holds 7 hand-written EN values left from the sample-seed era — `implant-
tedavisi` name/summary/body and four doctor `title`s ("Dt." unvanları). They
are correct Turkish-market English and safe to keep, but the client should
confirm: **keep as seeds for the future EN site, or clear them?**

- [ ] Client decision recorded: keep EN seeds / clear EN fields.

## 4. Known content gaps (not migration defects — content tasks)

- `homePage` doc: none yet — the home page renders the code-composed fallback
  sections (`apps/web/src/content/home.ts`) until it is authored in Studio.
- `testimonial` docs: none yet — live reviews (Trustindex) must be re-entered
  manually per decision #4; pick a curation with the client.
- `faq` docs: none yet — treatment-level FAQs migrated inline where the live
  pages had them; standalone FAQ documents are optional content work.

## 5. Client sign-off

Walk through §2 with the client; record gaps acceptance:

      Verified by ____________________  Date ______

On sign-off, close #34. Any remaining content work becomes new issues in the
client's repo, not scope creep here.
