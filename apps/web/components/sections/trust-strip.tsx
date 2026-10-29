import { Section } from "@dentaliva/ui";

import { GoogleMark } from "../google-mark";
import { t } from "../../src/i18n";
import type { TrustStripData } from "../../src/content/home";

/**
 * DSN-84: doküman #02 COMPACT TRUST STRIP — hero'nun altına negatif
 * margin'la taşan tam genişlik beyaz kart (DentalX/CareNow overlap deseni);
 * hücreler Dentia'nın ince dikey ayraçlarıyla ayrılır. Kurumsal klinik/hekim
 * vurgusu bilinçli yok (doküman kuralı: güven sonuç ve sosyal kanıtla
 * kurulur). Puan da göstergeler de CMS'ten; tamamen boşsa bölüm render
 * edilmez. Dokümanın eyebrow/headline stringleri kompakt banta bilinçli
 * basılmaz (DSN-77 öncülü).
 */
export function TrustStripSection({ data }: { data: TrustStripData | null }) {
  if (!data) return null;
  const rating = t(data.rating);
  const ratingLabel = t(data.ratingLabel);
  const items = (data.items ?? []).filter((item) => item.value).slice(0, 3);
  if (!rating && !ratingLabel && items.length === 0) return null;
  return (
    <Section
      className="-mt-14 pb-10 pt-0 md:-mt-16 md:pb-10"
      innerClassName="rounded-[4px] border border-[var(--dvn-line-soft)] bg-white px-6 py-6 shadow-[var(--dvn-shadow-lift)] md:px-10"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:justify-between">
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
          <div
            key={`${item.value}-${index}`}
            className={
              index > 0
                ? "border-l border-[var(--dvn-line-soft)] pl-10 max-lg:border-l-0 max-lg:pl-0"
                : undefined
            }
          >
            <p className="font-serif text-2xl leading-none text-gold-deep">{item.value}</p>
            <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/80">
              {t(item.label)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
