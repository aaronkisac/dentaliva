import { Section } from "@dentaliva/ui";

import { GoogleMark } from "../google-mark";
import { t } from "../../src/i18n";
import type { TrustStripData } from "../../src/content/home";

/**
 * DSN-61: strateji dokümanındaki #02 COMPACT TRUST STRIP — hero mesajını
 * denetlenebilir göstergelerle destekleyen kompakt bant (Dentia'nın hero-üstü
 * bilgi kartı şeridi kompozisyonu, bizim tokenlerle). Kurumsal klinik/hekim
 * vurgusu bilinçli yok: doküman göre güven sonuç ve sosyal kanıtla kurulur,
 * kurumsal otorite sayfanın sonuna bırakılır. Tüm veri CMS'ten; puan da
 * göstergeler de boşsa bölüm render edilmez.
 */
export function TrustStripSection({ data }: { data: TrustStripData | null }) {
  if (!data) return null;
  const rating = t(data.rating);
  const ratingLabel = t(data.ratingLabel);
  // stats deseni: değeri olmayan hücre basılmaz, en fazla 3 gösterge.
  const items = (data.items ?? []).filter((item) => item.value).slice(0, 3);
  if (!rating && !ratingLabel && items.length === 0) return null;
  return (
    <Section
      className="border-b border-[var(--dvn-line-soft)] bg-ivory py-10 md:py-10"
      innerClassName="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 lg:justify-between"
    >
      {rating || ratingLabel ? (
        <div className="flex items-center gap-4">
          <GoogleMark className="h-8 w-8" />
          <div>
            {rating ? (
              <p className="font-serif text-2xl leading-none text-gold-deep">{rating}</p>
            ) : null}
            {ratingLabel ? (
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/80">
                {ratingLabel}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {items.map((item, index) => (
        <div key={`${item.value}-${index}`}>
          <p className="font-serif text-2xl leading-none text-gold-deep">{item.value}</p>
          <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/80">
            {t(item.label)}
          </p>
        </div>
      ))}
    </Section>
  );
}
