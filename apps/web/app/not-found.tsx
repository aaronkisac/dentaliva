import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-[var(--dvn-container-max)] flex-col items-center justify-center px-[var(--dvn-container-gutter)] py-24 text-center">
      <h1 className="font-serif text-[length:var(--dvn-text-display-lg-size)] text-navy">404</h1>
      <p className="mt-4 text-ink">Aradığınız sayfa bulunamadı.</p>
      <Link
        href="/"
        className="mt-6 border border-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-navy hover:bg-navy hover:text-white"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
