import Image from "next/image";

import { Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import type { TreatmentPathItem } from "../../src/content/home";

const ENV = imageTarget();

/**
 * DSN-84: doküman #03 TREATMENT PATHS — ihtiyaç bazlı self-segmentasyon
 * kartları, DSN-48 overlay kart diliyle (DentalX görsel-üstü kart, marka
 * degradeleri): tam-kanat görsel + alttan navy degradeler, altın serif
 * numara (01–04), ihtiyaç cümlesi beyaz serif büyük, teknik terim ikinci
 * satır beyaz/75. Kartın tamamı link; görselsiz kart navy zeminde okunur.
 * Başlık bloğu copy'sizse eyebrow/başlık basılmaz; veri yoksa bölüm yok.
 */
export function TreatmentPathsSection({
  items,
  eyebrow,
  heading,
}: {
  items: TreatmentPathItem[];
  eyebrow?: string;
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Section>
      {eyebrow ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">{eyebrow}</p>
        </div>
      ) : null}
      {heading ? (
        <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
          {heading}
        </Heading>
      ) : null}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const headline = t(item.headline);
          if (!headline) return null;
          const subline = t(item.subline);
          const ref = item.image?.ref;
          const slug = item.treatment?.slug;
          const card = (
            <>
              {ref ? (
                <>
                  <div className="absolute inset-0">
                    <Image
                      src={ref}
                      alt={t(item.image?.alt) || headline}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={item.image?.lqip ?? lqipUrl(ref, ENV)}
                      className="object-cover"
                    />
                  </div>
                  {/* Kontrast garantisi: navy alt degrade (açık foto üstünde). */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/45 to-navy/10"
                  />
                </>
              ) : (
                <div aria-hidden="true" className="absolute inset-0 bg-navy" />
              )}
              <div className="relative flex h-full flex-col justify-end p-5">
                <span aria-hidden="true" className="font-serif text-sm text-gold-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-xl leading-snug text-white">{headline}</h3>
                {subline ? (
                  <p className="mt-1 font-sans text-sm leading-relaxed text-white/75">{subline}</p>
                ) : null}
              </div>
            </>
          );
          const frame =
            "group relative block aspect-[4/5] overflow-hidden rounded-[4px] transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)]";
          if (!slug) {
            return (
              <article key={`${headline}-${index}`} className={frame}>
                {card}
              </article>
            );
          }
          return (
            <Link
              key={`${headline}-${index}`}
              href={routes.treatment(slug)}
              className={frame + " hover:no-underline"}
            >
              {card}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
