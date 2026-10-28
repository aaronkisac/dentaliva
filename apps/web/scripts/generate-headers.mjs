// DEP-2: generate out/_headers after the export (npm postbuild).
//
// Static security headers as reviewed code. The Content-Security-Policy is
// emitted per route because it carries per-build SHA-256 hashes of the inline
// scripts Next embeds into that page — 'unsafe-inline' is deliberately NOT
// granted for scripts, and a single site-wide CSP (all 200+ payload hashes)
// blows past header-size limits. Third-party surfaces (reviewed in DEP-2):
//   - Turnstile widget: challenges.cloudflare.com (script/frame/connect/worker)
//   - video testimonials: www.youtube-nocookie.com (frame)
//   - Sanity CDN images: cdn.sanity.io (img)
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");

/** Exported HTML file → site route ("" for the home page). */
function routeOf(file) {
  const rel = file
    .slice(OUT.length + 1)
    .replace(/\\/g, "/")
    .slice(0, -".html".length);
  return rel === "index" ? "/" : `/${rel}`;
}

function cspFor(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes, "https://challenges.cloudflare.com"].join(" ")}`,
    // next/font injects inline @font-face; Turnstile injects inline styles.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com",
    // DSN-82: maps embed'i iç çerçevede www.google.com'a sarar — o origin
    // frame-src'de yoksa harita kutusu TÜM tarayıcılarda boş kalır.
    "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

async function hashesOf(file) {
  const html = await readFile(file, "utf8");
  const hashes = new Set();
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const content = match[1];
    if (content.trim() === "") continue;
    hashes.add(`'sha256-${createHash("sha256").update(content).digest("base64")}'`);
  }
  return hashes;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

if (!existsSync(OUT)) {
  console.error("out/ bulunamadı — önce next build çalışmalı (postbuild sırası).");
  process.exit(1);
}

// Workers static-assets _headers semantiği: aynı header birden çok eşleşen
// kuralda varsa değerler virgülle BİRLEŞİR ve tarayıcı iki CSP'yi de uygular
// (developers.cloudflare.com/workers/static-assets/headers). Bu yüzden /*'a
// script-src/default-src İÇERMEYEN, per-route CSP ile kesişimi kendisi olan
// yönergeler konur: amaç, not_found_handling=404-page nedeniyle rastgele
// path'lerde servis edilen 404 HTML'ine taban koruma vermektir.
const WILDCARD_CSP =
  "Content-Security-Policy: object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

const COMMON = `  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  ${WILDCARD_CSP}
`;

// DSN-51 perf denetimi: içerik-hash'li statik varlıklar değişmez — uzun
// ömürlü cache tarayıcıyı tekrar ziyaretlerde doğrulama isteğinden kurtarır.
// HTML'e dokunulmaz: platformun max-age=0 must-revalidate + ETag akışı
// deploy tazeliğini taşır (birleşme kuralı yüzünden wildcard Cache-Control
// ile çakışma da açılmaz — COMMON'da Cache-Control bilinçli yok).
const STATIC_CACHE = "/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n";

const sections = [`/*\n${COMMON}`, STATIC_CACHE];
const routes = [];
for await (const file of walk(OUT)) {
  const hashes = await hashesOf(file);
  const route = routeOf(file);
  routes.push(route);
  sections.push(`${route}\n  Content-Security-Policy: ${cspFor(hashes)}\n`);
}

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "_headers"), sections.join("\n"));
console.log(
  `_headers yazıldı: ${routes.length} rota için CSP (${COMMON.split("\n").length - 2} ortak başlık).`,
);
