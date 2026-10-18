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
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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

// next build triggers the postbuild chain (prune-routes + generate-headers).
const result = spawnSync("pnpm", ["build"], { stdio: "inherit", env, shell: true });
process.exit(result.status ?? 1);
