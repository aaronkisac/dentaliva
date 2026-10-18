// INT-6: per-site route pruning for the static export.
//
// The app tree carries BOTH sites' segments (Turkish dirs + English thin
// wrappers). Next emits every route for whichever site is being built; this
// script deletes the INACTIVE site's segment directories from out/ so a
// deploy never ships foreign-language URLs. The active set derives from the
// site registry itself — adding a site never means editing this file.
//
// Node 24 strips the sites/*.ts types natively, so the real config objects
// are imported (no hand-parsed duplication).
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const webRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(webRoot, "out");

/** Hand-parse .env exactly like generate-redirects.mjs (CI has no dotenv). */
function readEnvSiteId() {
  if (process.env.SITE_ID) return process.env.SITE_ID;
  try {
    const lines = readFileSync(join(webRoot, ".env")).split("\n");
    const line = lines.find((l) => l.startsWith("SITE_ID="));
    return line ? line.slice("SITE_ID=".length).trim() : undefined;
  } catch {
    return undefined;
  }
}

async function loadSites() {
  const sitesDir = join(webRoot, "sites");
  const sites = [];
  for (const file of readdirSync(sitesDir).filter((f) => f.endsWith(".ts"))) {
    const mod = await import(pathToFileURL(join(sitesDir, file)).href);
    sites.push(mod.site);
  }
  return sites;
}

const sites = await loadSites();
const activeId = readEnvSiteId() ?? "com";
const active = sites.find((s) => s.id === activeId);
if (!active) {
  console.error(
    `[prune] Unknown SITE_ID "${activeId}" — known: ${sites.map((s) => s.id).join(", ")}`,
  );
  process.exit(1);
}

// Every configured segment across sites; active = this site's routes values.
const allSegments = new Set(sites.flatMap((s) => Object.values(s.routes)));
const activeSegments = new Set(Object.values(active.routes));
const removed = [];

function pruneSegment(segment) {
  const dir = segment.replace(/^\//, "");
  // Next emits dir/ + dir.html + dir.txt (RSC payload) for each segment.
  rmSync(join(outDir, dir), { recursive: true, force: true });
  rmSync(join(outDir, `${dir}.html`), { force: true });
  rmSync(join(outDir, `${dir}.txt`), { force: true });
  removed.push(`${dir}/`);
}

for (const segment of allSegments) {
  if (segment !== "/" && !activeSegments.has(segment)) {
    pruneSegment(segment);
  }
}

// Feature-flagged surfaces: the chatbot JSON contract and the blog.
if (!active.features.chatbotApi) {
  rmSync(join(outDir, "api"), { recursive: true, force: true });
  removed.push("api/");
}
if (!active.features.blog) pruneSegment(active.routes.blog);

// Redirect/headers files stay — they are per-deploy, generated elsewhere.
console.log(
  removed.length > 0
    ? `[prune] SITE_ID=${activeId} — kaldırılan inaktif segmentler: ${removed.join(" ")}`
    : `[prune] SITE_ID=${activeId} — kaldırılacak inaktif segment yok`,
);
