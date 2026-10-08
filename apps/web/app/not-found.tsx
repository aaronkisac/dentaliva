import Link from "next/link";

import { fetchSiteCopy } from "../src/content/site-copy";
import { readClient } from "../src/sanity";

/**
 * DSN-44: 404 copy'leri siteCopy'den — fetch başarısızsa bölüm render
 * edilmez; 404 sayfası her koşulda oluşur (statik export).
 */
export default async function NotFound() {
  const copy = await fetchSiteCopy(readClient);
  const title = copy?.ui?.notFoundTitle?.tr;
  const body = copy?.ui?.notFoundBody?.tr;
  const backLink = copy?.ui?.notFoundBackLink?.tr;
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-[var(--dvn-container-max)] flex-col items-center justify-center px-[var(--dvn-container-gutter)] py-24 text-center">
      <h1 className="font-serif text-[length:var(--dvn-text-display-lg-size)] text-navy">
        {title ?? "404"}
      </h1>
      {body ? <p className="mt-4 text-ink">{body}</p> : null}
      {backLink ? (
        <Link
          href="/"
          className="mt-6 border border-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-navy hover:bg-navy hover:text-white"
        >
          {backLink}
        </Link>
      ) : null}
    </main>
  );
}
