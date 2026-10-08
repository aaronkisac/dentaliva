import Image from "next/image";

import { Link } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import type { TreatmentListItem } from "../src/content/treatments";

/**
 * DSN-48: hizmet kartı — Dentiva referansındaki görsel-baskın overlay kartın
 * Dentaliva diline uyarlaması. Tam-kanama hero görseli (6/7), üstte başlık
 * chip'i, altta scrim üzerinde özet; kartın tamamı detay sayfasına giden tek
 * link ("Detay →" copy'si böylece kalktı). Referansın 58px hap başlığı
 * yerine 4px çerçeveli chip + eyebrow tipografisi (DSN-32 kare dili);
 * scrims saf siyah yerine navy. Ana sayfa grid'i ile /hizmetlerimiz
 * listesi paylaşır. Görsel yoksa kart navy zeminde okunur; slug yoksa
 * link'siz article olarak basılır.
 */
export function TreatmentCard({ item }: { item: TreatmentListItem }) {
  const name = pickLocalized(item.name);
  const summary = pickLocalized(item.summary);

  const content = (
    <>
      {item.heroImage?.ref ? (
        <Image
          src={item.heroImage.ref}
          alt={item.heroImage.alt?.tr ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder={item.heroImage.lqip ? "blur" : "empty"}
          blurDataURL={item.heroImage.lqip}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      ) : null}
      {/* Referanstaki çift scrim (üst/alt) tek degradeyle — beyaz metin için kontrast zemini. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-navy/90"
      />
      {name ? (
        <div className="absolute left-4 top-4 rounded-[4px] border border-white/70 px-3 py-1.5">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-white">
            {name}
          </h3>
        </div>
      ) : null}
      {summary ? (
        // text-wrap pretty/balance burada YOK: Chromium'da -webkit-line-clamp'i
        // sessizce bozuyor (clamp'siz metin kart altından taşıyor). Alt kenara
        // lokal navy degrade — scrim'in oraya inmeden kontrast garantisi.
        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-4 pt-8 font-sans text-sm leading-relaxed text-white/95 line-clamp-3">
          {summary}
        </p>
      ) : null}
    </>
  );

  const shell = "group relative block aspect-[6/7] overflow-hidden rounded-[4px] bg-navy";

  if (!item.slug) {
    return <article className={shell}>{content}</article>;
  }

  return (
    <Link
      href={`/hizmetlerimiz/${item.slug}`}
      className={`${shell} hover:no-underline hover:shadow-[var(--dvn-shadow-lift)]`}
    >
      {content}
    </Link>
  );
}
