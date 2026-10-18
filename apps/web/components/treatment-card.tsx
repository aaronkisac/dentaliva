import Image from "next/image";

import { Link } from "@dentaliva/ui";
import { t } from "../src/i18n";

import type { TreatmentListItem } from "../src/content/treatments";
import { routes } from "../src/routes";

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

/**
 * DSN-48: özet kesimi CSS line-clamp yerine veri seviyesinde — yeni Chromium
 * (153+) display:-webkit-box'ı flow-root'a çevirip -webkit-line-clamp'i
 * öldürüyor (standart line-clamp henüz yok); kelime sınırında kesmek tüm
 * tarayıcılarda deterministik.
 */
export function clampWords(text: string, max = 20): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= max) return text;
  return `${words.slice(0, max).join(" ")}…`;
}

export function TreatmentCard({ item }: { item: TreatmentListItem }) {
  const name = t(item.name);
  const summary = t(item.summary);

  const content = (
    <>
      {item.heroImage?.ref ? (
        <Image
          src={item.heroImage.ref}
          alt={t(item.heroImage.alt)}
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
        // Alt kenara lokal navy degrade — scrim'in oraya inmeden kontrast garantisi.
        // line-clamp kasıtlı YOK: güvenilir kesim yukarıdaki clampWords'te.
        <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-4 pt-8 font-sans text-sm leading-relaxed text-white/95">
          {clampWords(summary)}
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
      href={routes.treatment(item.slug)}
      className={`${shell} hover:no-underline hover:shadow-[var(--dvn-shadow-lift)]`}
    >
      {content}
    </Link>
  );
}
