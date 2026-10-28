import Image from "next/image";

import { Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import type { TreatmentPathItem } from "../../src/content/home";

const ENV = imageTarget();

/**
 * DSN-62: strateji dokümanı #03 TREATMENT PATHS — kullanıcının teknik menü
 * yerine İHTİYACINA göre kendini konumlandırması (self-segmentation).
 * Kartların tamamı ilgili tedavi sayfasına giden tek link; ihtiyaç cümlesi
 * kartta büyük, teknik terim (subline) ikinci satırda ince. Kompozisyon
 * CareNow'un "What You Can Do" bloğundan; kart dili bizim tokenlarımızla
 * (4px köşe, yumuşak çerçeve, hover'da lift). Başlık bloğu copy'sizse bölüm
 * render edilmez; kartın tedavi referansı yoksa link'siz article basılır.
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
    <Section className="bg-ivory">
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
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-navy">
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
              ) : null}
              <h3 className="mt-4 font-serif text-xl leading-snug text-ink">{headline}</h3>
              {subline ? <p className="mt-1 font-sans text-sm text-ink/70">{subline}</p> : null}
            </>
          );
          if (!slug) {
            return (
              <article key={`${headline}-${index}`} className="rounded-[4px]">
                {card}
              </article>
            );
          }
          return (
            <Link
              key={`${headline}-${index}`}
              href={routes.treatment(slug)}
              className="group rounded-[4px] border border-transparent p-2 -m-2 hover:border-[var(--dvn-line-soft)] hover:bg-white hover:no-underline hover:shadow-[var(--dvn-shadow-lift)]"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
