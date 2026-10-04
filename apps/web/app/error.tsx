"use client";

/**
 * DSN-33: runtime hata sınırı — not-found ile aynı marka dili (serif başlık,
 * altın çizgili kurtarma butonu). Static export'ta sayfalar anında yüklendiği
 * için loading.tsx bilinçli olarak eklenmedi.
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
        Bir sorun oluştu
      </h1>
      <p className="mt-4 text-ink">Sayfa yüklenirken beklenmeyen bir hata oluştu.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-navy hover:bg-navy hover:text-white"
      >
        Tekrar dene
      </button>
    </main>
  );
}
