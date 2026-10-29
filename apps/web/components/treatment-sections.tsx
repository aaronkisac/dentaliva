import Image from "next/image";

import { Heading, Reveal, Section, Text } from "@dentaliva/ui";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../src/image-target";
import { t } from "../src/i18n";
import type { TreatmentSection } from "../src/content/treatments";

const ENV = imageTarget();

/**
 * DSN-83: tedavi gövdesinin yapılandırılmış bölüm akışı — orijinal tedavi
 * sayfalarındaki H2/H3 ritminin bizim dilimizdeki karşılığı. Her bölüm tam
 * genişlik bir bant (beyaz/fildişi dönüşümlü), içinde serif H2 (altın çizgi
 * üstünde), giriş metni, numaralı alt madde satırları (DSN-52 about motifi)
 * ve bölüme eşlik eden kare fotoğraf (altın çerçeve, about kartı dili).
 * Fotoğraf sütunu bölümler arasında sağa/sola dönüşümlü. Başlıksız bölüm
 * render edilmez; fotoğrafsız bölüm yalnız metinle akar.
 */
export function TreatmentSections({ sections }: { sections: TreatmentSection[] }) {
  const visible = sections.filter((section) => t(section.heading));
  return (
    <>
      {visible.map((section, index) => {
        // Fotoğraf sütunu çift bölümlerde sağda, teklerde solda.
        const imageLeft = index % 2 === 1;
        const items = (section.items ?? []).filter((item) => t(item.title) || t(item.text));
        const heading = t(section.heading);
        const ref = section.image?.ref;
        return (
          <Reveal key={`${heading}-${index}`}>
            <Section className={index % 2 === 0 ? "bg-white" : undefined}>
              <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                <div className={imageLeft ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                  <span aria-hidden="true" className="block h-px w-10 bg-gold" />
                  <Heading level="h2" size="md" className="mt-4">
                    {heading}
                  </Heading>
                  {t(section.lead) ? <Text className="mt-4">{t(section.lead)}</Text> : null}
                  {items.length > 0 ? (
                    <ul className="mt-6 divide-y divide-[var(--dvn-line-soft)]">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex gap-4 py-5">
                          <span aria-hidden="true" className="font-serif text-sm text-gold-deep">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            {t(item.title) ? (
                              <Heading level="h3" size="title">
                                {t(item.title)}
                              </Heading>
                            ) : null}
                            {t(item.text) ? <Text className="mt-2">{t(item.text)}</Text> : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {ref ? (
                  <figure
                    className={`relative aspect-square overflow-hidden rounded-[4px] border border-[var(--dvn-line-gold)] ${
                      imageLeft ? "lg:order-1" : ""
                    } lg:col-span-5`}
                  >
                    <Image
                      src={ref}
                      alt={t(section.image?.alt) || heading}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      placeholder="blur"
                      blurDataURL={section.image?.lqip ?? lqipUrl(ref, ENV)}
                      className="object-cover"
                    />
                  </figure>
                ) : null}
              </div>
            </Section>
          </Reveal>
        );
      })}
    </>
  );
}
