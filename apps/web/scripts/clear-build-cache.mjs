// CPT-2 (staging preview): Next 16 persists build-time fetches in
// .next/cache/fetch-cache — stale Sanity responses survived every local
// build, freezing the deployed site on old content. CI is unaffected (fresh
// runners); local deploy builds must purge before building.
// Usage (apps/web): node scripts/clear-build-cache.mjs
import { rmSync } from "node:fs";

rmSync(".next/cache", { recursive: true, force: true });
console.log(".next/cache temizlendi — build taze Sanity verisi çekecek");
