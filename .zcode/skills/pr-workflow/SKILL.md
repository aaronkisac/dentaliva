---
name: pr-workflow
description: Dentaliva repo'sunda issue bazlı değişiklik açarken/birleştirirken kullan — branch adı, Conventional Commits, kapılar, merge-pr.mjs ve board senkronu akışı.
when_to_use: Herhangi bir backlog issue'su için kod/doküman değişikliği başlatırken veya PR merge ederken.
---

# PR workflow (Dentaliva starter)

## Döngü: bir issue → bir branch → bir PR

```bash
git checkout main && git pull --ff-only
git checkout -b feat/<issue>-<slug>          # ör. feat/46-prf4-bundle-budget
# ...kod + testler...
pnpm lint && pnpm typecheck && pnpm test && pnpm build
git add -A && git commit -m "feat(web): < lowercase summary > (EPIC-n)\n\nCloses #<n>"
git push -u origin feat/<issue>-<slug>
gh pr create --title "..." --body "... **Closes #<n>**"
node scripts/merge-pr.mjs feat/<issue>-<slug> <issue>   # CI green olmadan merge ETMEZ
node scripts/board-status.mjs <issue> Done
git checkout main && git pull --ff-only
```

## Kurallar

- **Conventional Commits**; subject **lowercase** başlar (commitlint
  `subject-case` sentence-case'i reddeder — "feat(web): lighthouse gate ✓",
  "feat(web): Lighthouse gate ✗").
- Doğrudan **main'e commit atma**. Yanlışlıkla main'e düşen commit için
  kurtarma: `git branch feat/<n>-<slug>` (HEAD'de) → `git fetch origin` →
  `git reset --hard origin/main` → branch'e geç → push (DEP-2 sırasında
  yaşandı, prosedür işledi).
- CI'daki kapılar (beklemek normal: ~5 dk): lint, typecheck, coverage
  (ui/lib/seo %100), build, bundle budget + use-client audit, Playwright E2E
  (axe + keyboard + headers + callback journey — webServer wrangler dev'i
  kendisi başlatır), Lighthouse (median of 3, threshold 70; 95 üretimde
  DEP-1 sonrası).
- Bilinçli hata doğrulaması gereken kapılar için: bütçe script'leri
  `BUDGET_KB`/`LH_THRESHOLD` env'leriyle küçük eşikte exit 1 üretir.
- Merge sonrası `node scripts/board-status.mjs <issue> Done` atlanmaz —
  Project board tek gerçek kaynak.
- Kullanıcı kararı gerektiren işler (DNS, OAuth, ücretli servis, müşteri
  onayı): başlama, raporda net soru olarak sor.
