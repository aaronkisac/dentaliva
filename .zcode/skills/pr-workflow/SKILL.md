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
node scripts/merge-pr.mjs feat/<issue>-<slug> <issue>   # conflict + güncellik + yeşil CI olmadan merge ETMEZ
node scripts/board-status.mjs <issue> Done
git checkout main && git pull --ff-only
```

## Kurallar

- **Merge yalnız `node scripts/merge-pr.mjs <dal-veya-PR> <issue>` üzerinden** (Aaron,
  2026-10-28: "merge öncesi conflict kontrolü"). Script yeşil-CI beklemeden ÖNCE üç
  kapı çalıştırır: (1) GitHub `mergeable = MERGEABLE`; (2) `git merge-tree
  --write-tree` ile bellek-içi gerçek merge denemesi — çakışma varsa dosya
  listesiyle REFUSE; (3) merge-base kontrolü — dal origin/main'in gerisindeyse
  REFUSE (main'i dala merge et + push + CI rerun, sonra tekrar dene). GitHub
  mergeable bayrağı tek başına yetmez: eski base'e karşı yeşil CI'lı PR merge
  sonrası main'i kırmıştı (DSN-57), main tabanlı bir dalın staging deploy'u
  kardeş PR'ın staging'ini ezmişti (#337 blog, #335 hekimler vitrini). Not:
  private repo + GitHub Free'de branch protection YOK (`protect-main.mjs` 403) —
  kapıyı bu script zorlar. `--delete-branch` opt-in'dir; worktree'den merge'de
  KULLANMA (checkout'lu dalı silip worktree kaydını bozar).
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
