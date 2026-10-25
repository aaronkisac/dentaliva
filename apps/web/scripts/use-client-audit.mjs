// PRF-4: "use client" audit — client boundaries stay reviewed.
//
// Scans the web app and the shared UI package for client components. Every
// new "use client" surface must be added to the allowlist below with a
// justification; the audit fails otherwise. This is what keeps the first-load
// bundle from growing a little every time a component gets interactive.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOTS = [join(process.cwd()), join(process.cwd(), "..", "..", "packages", "ui")];

/**
 * Reviewed client surfaces (justifications):
 * - CallbackForm: form state + fetch + Turnstile widget
 * - review-form-loader: yalnız dinamik import köprüsü — RHF+zod chunk'ını
 *   ilk yükleme JS'inin DİŞINA taşır (DSN-63 bundle patlaması: form ana
 *   sayfaya girince 205→306KB); gerçek istemci mantığı CallbackForm'da
 * - lightbox: <dialog> open/close state
 * - ui/header: mobile menu state + focus trap
 * - ui/accordion: disclosure state
 * - ui/reveal: IntersectionObserver + prefers-reduced-motion
 * - ui/use-focus-trap: client hook
 * - sections/doctors: carousel scroll state + entrance reveals
 * - sections/quick-services: carousel scroll state + arrow edge state (DSN-50)
 * - sections/testimonials: reviews carousel scroll/index state (DSN-52)
 * - app/error.tsx: Next error boundary — client zorunluluğu (reset state)
 * - app/global-error.tsx: root hata sınırı — client zorunluluğu (reset state)
 * - components/theme-switcher: hover/panel open + dismiss state, palet
 *   uygulama (DSN-57 — kalıcı sürüm src/theme.ts'te, saf ve test edilebilir)
 * (ui/button was audited out — purely presentational, renders server-side.)
 */
const ALLOWED = new Set(
  [
    "components/CallbackForm.tsx",
    "components/review-form-loader.tsx",
    "components/lightbox.tsx",
    "components/before-after-slider.tsx",
    "components/sections/doctors.tsx",
    "components/sections/quick-services.tsx",
    "components/use-track-carousel.ts",
    "components/carousel-track.tsx",
    "components/theme-switcher.tsx",
    "app/error.tsx",
    "app/global-error.tsx",
    "src/header.tsx",
    "src/accordion.tsx",
    "src/reveal.tsx",
    "src/use-focus-trap.ts",
  ].map((p) => p.split("/").join(sep)),
);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "out" || entry === ".next" || entry === ".wrangler") {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else if (/\.tsx?$/.test(entry)) {
      yield full;
    }
  }
}

const offenders = [];
const reviewed = new Set();
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = relative(root, file);
    if (!readFileSync(file, "utf8").slice(0, 200).includes("use client")) continue;
    if (ALLOWED.has(rel)) {
      reviewed.add(rel);
      continue;
    }
    offenders.push(`${rel} (root: ${relative(process.cwd(), root) || "."})`);
  }
}

for (const allowed of ALLOWED) {
  if (!reviewed.has(allowed)) {
    offenders.push(`allowlist'te ama artık client değil: ${allowed}`);
  }
}

if (offenders.length > 0) {
  console.error(
    `İzinsiz "use client" yüzeyi:\n${offenders.join("\n")}\n` +
      "Yeni client bileşeni önce buraya, gerekçesiyle allowlist'e eklenmeli.",
  );
  process.exit(1);
}
console.log(`"use client" audit temiz (${reviewed.size} gözden geçirilmiş yüzey).`);
