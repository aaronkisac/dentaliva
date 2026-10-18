"use client";

import { uiString } from "../src/ui-strings";
/**
 * DSN-33: runtime hata sınırı — not-found ile aynı marka dili (serif başlık,
 * altın çizgili kurtarma butonu). Static export'ta sayfalar anında yüklendiği
 * için loading.tsx bilinçli olarak eklenmedi.
 *
 * DSN-44 istisna (bilgelenmiş, INT-3'te locale-tablolara taşındı): copy'ler
 * CMS'ten değil src/ui-strings tablosundan gelir — client hata sınırı Sanity
 * fetch edemez; uygulama kırılmışken kurtarma UI'sı CMS'e bağımlı olamaz
 * (global-error'daki inline renk istisnasıyla aynı gerekçe).
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[app] runtime error:", error);
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-[var(--dvn-container-max)] flex-col items-center justify-center px-[var(--dvn-container-gutter)] py-24 text-center">
      <h1 className="font-serif text-[length:var(--dvn-text-display-lg-size)] text-navy">
        {uiString("errorTitle")}
      </h1>
      <p className="mt-4 text-ink">{uiString("errorBody")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-navy hover:bg-navy hover:text-white"
      >
        {uiString("errorRetry")}
      </button>
    </main>
  );
}
