// INT-8: per-site build runner. Sets the full site-scoped env for `next build`
// from the site registry itself, so a stale apps/web/.env can never cross-wire
// projects (Sanity read tokens are project-scoped).
//
//   node scripts/build-site.mjs --site eu [--env staging]
//
// Env resolution:
//   SITE_ID / NEXT_PUBLIC_SITE_ID  — from --site
//   SANITY_PROJECT_ID              — from sites/<id>.ts (registry authority)
//   SANITY_DATASET                 — --env staging → site.stagingDataset,
//                                    otherwise site.dataset (shell beats .env)
//   SANITY_READ_TOKEN              — passed through if already set, otherwise
//                                    SANITY_READ_TOKEN_<SITE.toUpperCase()>;
//                                    if neither exists the token is BLANKED
//                                    (anonymous CDN reads for public datasets)
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * DSN-84: v1 ana sayfa arşivini out/ altına merge-copy eder. Snapshot
 * (v1-homepage-snapshot/) `homepage-v1/index.html` + v1'in kendi
 * `_next/static` varlıklarını taşır; chunk adları content-hash olduğundan
 * güncel build'in varlıklarıyla çakışmaz, out'ta zaten var olan dosyalar
 * asla ezilmez. Sayfa noindex'lidir (snapshot HTML'ine işlenmiş).
 */
function attachV1Snapshot(webRoot) {
  const snapshot = join(webRoot, "v1-homepage-snapshot");
  const outDir = join(webRoot, "out");
  if (!existsSync(snapshot) || !existsSync(outDir)) return;
  const copyMerge = (src, dest) => {
    for (const entry of readdirSync(src, { withFileTypes: true })) {
      const s = join(src, entry.name);
      const d = join(dest, entry.name);
      if (entry.isDirectory()) {
        mkdirSync(d, { recursive: true });
        copyMerge(s, d);
      } else if (!existsSync(d)) {
        copyFileSync(s, d);
      }
    }
  };
  copyMerge(snapshot, outDir);
  console.log("[build-site] v1 ana sayfa arşivi /homepage-v1 olarak eklendi");
}

const args = process.argv.slice(2);
const siteId = args[args.indexOf("--site") + 1];
const envName = args.includes("--env") ? args[args.indexOf("--env") + 1] : "production";
if (!siteId) {
  console.error("[build-site] kullanım: --site <id> [--env staging]");
  process.exit(1);
}

const webRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const mod = await import(pathToFileURL(join(webRoot, "sites", `${siteId}.ts`)));
const site = mod.site;

const env = { ...process.env };
env.SITE_ID = site.id;
env.NEXT_PUBLIC_SITE_ID = site.id;
env.SANITY_PROJECT_ID = site.sanity.projectId;
env.SANITY_DATASET = envName === "staging" ? site.sanity.stagingDataset : site.sanity.dataset;

// Token: SANITY_READ_TOKEN passthrough; else the site-specific
// SANITY_READ_TOKEN_<SITE> (CI secret / local session token); else blank
// (anonymous — anonymous v1 reads omit documents, so real content builds
// need the site token).
if (!env.SANITY_READ_TOKEN) {
  env.SANITY_READ_TOKEN = env[`SANITY_READ_TOKEN_${site.id.toUpperCase()}`] ?? "";
}
if (!env.SANITY_READ_TOKEN) env.SANITY_READ_TOKEN = "";

console.log(
  `[build-site] SITE_ID=${site.id} env=${envName} project=${env.SANITY_PROJECT_ID} dataset=${env.SANITY_DATASET} token=${env.SANITY_READ_TOKEN ? "set" : "anonymous"}`,
);

// Next persists fetch responses in .next/cache ACROSS builds — a stale cache
// silently served pre-enrichment dataset state (INT-11). Always start clean;
// the deploy:* scripts did this via clear-build-cache, standalone runs now
// get the same guarantee.
const clear = spawnSync("node", [join(webRoot, "scripts", "clear-build-cache.mjs")], {
  stdio: "inherit",
  cwd: webRoot,
});
if (clear.status !== 0) process.exit(clear.status ?? 1);

// next build triggers the postbuild chain (prune-routes + generate-redirects
// + generate-headers).
const result = spawnSync("pnpm", ["build"], { stdio: "inherit", env, shell: true });
if (site.id === "com" && result.status === 0) attachV1Snapshot(webRoot);
process.exit(result.status ?? 1);
