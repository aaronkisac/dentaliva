// PRF-4: first-load JS budget enforced in CI.
//
// Parses the exported home page for its initial <script src="/_next/...js">
// set, sums the gzipped chunk sizes and fails when the total exceeds the
// budget. Gzip is the metric Next's own "First Load JS" column uses.
//
// Budget note: the backlog's original 90KB target predates the framework
// choice. Next 16 + React 19 App Router ships a ~165KB-gzip client runtime
// floor (react-dom, router, Turbopack runtime) before any app code; this
// build's app-owned share is ~24KB. The enforceable line started at 200KB
// (PRF-4) and moved to 204KB in INT-3: the per-locale chrome tables (error
// boundaries + carousel aria labels in client chunks, duplicated per route
// chunk by Turbopack) buy the dentaliva.eu instance for ~4KB. DSN-59 moved it
// to 205KB: the grouped treatments mega menu (NavMenu types + panel +
// mobile disclosure) costs ~0.3KB of chrome. DSN-63 moved it to 206KB: the
// review-form section's server chrome (steps list, #review anchor card,
// hero WhatsApp CTA branch) — the form's RHF+zod chunk itself is dynamically
// imported and stays OUT of the initial script set (~100KB). The real
// user-facing gate stays the CI Lighthouse perf budget; this line still
// fails on genuine regressions.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const BUDGET_KB = Number(process.env.BUDGET_KB ?? 206);
const ROUTE_HTML = join(process.cwd(), "out", process.env.BUNDLE_HTML ?? "index.html");

const html = readFileSync(ROUTE_HTML, "utf8");
const srcs = [
  ...new Set([...html.matchAll(/<script[^>]*src="(\/_next[^"]+\.js)"/g)].map((match) => match[1])),
];
if (srcs.length === 0) {
  console.error(`İlk yüklenen script bulunamadı: ${ROUTE_HTML} (önce build al)`);
  process.exit(1);
}

let total = 0;
for (const src of srcs) {
  total += gzipSync(readFileSync(join(process.cwd(), "out", src))).length;
}
const totalKb = Math.round((total / 1024) * 10) / 10;

console.log(`İlk yükleme JS (gzip, ${ROUTE_HTML}): ${totalKb}KB / bütçe ${BUDGET_KB}KB`);
for (const src of srcs) {
  const kb =
    Math.round((gzipSync(readFileSync(join(process.cwd(), "out", src))).length / 1024) * 10) / 10;
  console.log(`  ${String(kb).padStart(6)}KB  ${src}`);
}

if (totalKb > BUDGET_KB) {
  console.error(`Bütçe aşıldı: ${totalKb}KB > ${BUDGET_KB}KB`);
  process.exit(1);
}
