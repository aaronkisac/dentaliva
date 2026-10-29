import Image from "next/image";

import { Container, Heading, Reveal, Section, Text } from "@dentaliva/ui";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../src/image-target";
import { t } from "../src/i18n";
import type { TreatmentSection } from "../src/content/treatments";

const ENV = imageTarget();

type Variant = "feature" | "duo" | "quad" | "interlude" | "showcase";

/**
 * DSN-83 (v2): tedavi gövdesi — her bölüm İÇERİK ŞEKLİNE GÖRE kendi
 * kompozisyonunu alır (Aaron: "2 sütun gibi olmaması... biraz daha yaratıcı"):
 *
 *   3+/5 madde → feature  : tam genişlik başlık + numaralı satırlar + altında
 *                           sinematik foto bandı (16/7) — yanaşma yok
 *   4 madde    → quad     : geniş foto bandı (2/1) + 2×2 numaralı kadran
 *                           (hairline ayraçlı, kart yok)
 *   2 madde    → duo      : LACİVERT kontrast bandı — beyaz başlık, altın
 *                           sayaçlar + dikey portre foto (sayfadaki tek
 *                           yanaşma, koyu zeminle bilinçli vurgu)
 *   1 madde    → showcase : tam kanat foto + navy scrim üzerine beyaz metin
 *                           (bölüm akışının dramatik kapanışı)
 *   madde yok  → interlude: ortalanmış dar kolon (max-w-2xl) + ortalanmış
 *                           altın çizgi — sessiz editoryal mola
 *
 * Fotoğraf yoksa her varyant yalın düşer (duo/showcase navy bant olarak).
 * Başlıksız yarım CMS girişleri akışa girmez.
 */
function variantOf(itemCount: number): Variant {
  if (itemCount === 4) return "quad";
  if (itemCount >= 3) return "feature";
  if (itemCount === 2) return "duo";
  if (itemCount === 1) return "showcase";
  return "interlude";
}

function SectionPhoto({
  image,
  heading,
  className,
  sizes,
}: {
  image?: TreatmentSection["image"];
  heading: string;
  className: string;
  sizes: string;
}) {
  const ref = image?.ref;
  if (!ref) return null;
  return (
    <figure
      className={`overflow-hidden rounded-[4px] border border-[var(--dvn-line-gold)] ${className}`}
    >
      <Image
        src={ref}
        alt={t(image?.alt) || heading}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={image?.lqip ?? lqipUrl(ref, ENV)}
        className="object-cover"
      />
    </figure>
  );
}

function GoldRule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-10 bg-gold ${className}`} />;
}

function SectionItems({
  items,
  tone,
}: {
  items: TreatmentSection["items"];
  tone: "light" | "dark";
}) {
  const visible = (items ?? []).filter((item) => t(item.title) || t(item.text));
  if (visible.length === 0) return null;
  const dark = tone === "dark";
  return (
    <ul className={`mt-8 divide-y ${dark ? "divide-white/15" : "divide-[var(--dvn-line-soft)]"}`}>
      {visible.map((item, index) => (
        <li key={index} className="flex gap-4 py-5">
          <span
            aria-hidden="true"
            className={`font-serif text-sm ${dark ? "text-gold-soft" : "text-gold-deep"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            {t(item.title) ? (
              <Heading level="h3" size="title" className={dark ? "text-white" : undefined}>
                {t(item.title)}
              </Heading>
            ) : null}
            {t(item.text) ? (
              <Text className={`mt-2 ${dark ? "text-white/75" : "text-ink/80"}`}>
                {t(item.text)}
              </Text>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TreatmentSections({ sections }: { sections: TreatmentSection[] }) {
  const visible = sections.filter((section) => t(section.heading));
  return (
    <>
      {visible.map((section, index) => {
        const heading = t(section.heading);
        const lead = t(section.lead);
        const items = (section.items ?? []).filter((item) => t(item.title) || t(item.text));
        const variant = variantOf(items.length);
        const key = `${heading}-${index}`;

        if (variant === "showcase") {
          const item = items[0];
          const bgRef = section.image?.ref;
          return (
            <Reveal key={key}>
              <section className="relative overflow-hidden">
                {bgRef ? (
                  <Image
                    src={bgRef}
                    alt=""
                    fill
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={section.image?.lqip ?? lqipUrl(bgRef, ENV)}
                    className="object-cover"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-r ${
                    bgRef ? "from-navy via-navy/85 to-navy/55" : "from-navy to-navy"
                  }`}
                />
                <Container className="relative py-24 md:py-32">
                  <GoldRule />
                  <Heading level="h2" size="md" className="mt-4 text-white">
                    {heading}
                  </Heading>
                  {lead ? <Text className="mt-4 max-w-2xl text-white/80">{lead}</Text> : null}
                  {item ? (
                    <div className="mt-8 flex max-w-2xl gap-4">
                      <span aria-hidden="true" className="font-serif text-sm text-gold-soft">
                        01
                      </span>
                      <div>
                        {t(item.title) ? (
                          <Heading level="h3" size="title" className="text-white">
                            {t(item.title)}
                          </Heading>
                        ) : null}
                        {t(item.text) ? (
                          <Text className="mt-2 text-white/75">{t(item.text)}</Text>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </Container>
              </section>
            </Reveal>
          );
        }

        if (variant === "duo") {
          return (
            <Reveal key={key}>
              <Section className="bg-navy text-white">
                <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-7">
                    <GoldRule />
                    <Heading level="h2" size="md" className="mt-4 text-white">
                      {heading}
                    </Heading>
                    {lead ? <Text className="mt-4 text-white/80">{lead}</Text> : null}
                    <SectionItems items={items} tone="dark" />
                  </div>
                  <SectionPhoto
                    image={section.image}
                    heading={heading}
                    className="relative aspect-[3/4] lg:col-span-5"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </Section>
            </Reveal>
          );
        }

        if (variant === "quad") {
          return (
            <Reveal key={key}>
              <Section>
                <GoldRule />
                <Heading level="h2" size="md" className="mt-4">
                  {heading}
                </Heading>
                {lead ? <Text className="mt-4 max-w-3xl">{lead}</Text> : null}
                <SectionPhoto
                  image={section.image}
                  heading={heading}
                  className="relative mt-8 aspect-[3/2] md:aspect-[2/1]"
                  sizes="(max-width: 768px) 100vw, 1180px"
                />
                {items.length > 0 ? (
                  <div className="mt-10 grid gap-x-14 md:grid-cols-2">
                    {items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-t border-[var(--dvn-line-soft)] py-6">
                        <div className="flex gap-4">
                          <span aria-hidden="true" className="font-serif text-sm text-gold-deep">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            {t(item.title) ? (
                              <Heading level="h3" size="title">
                                {t(item.title)}
                              </Heading>
                            ) : null}
                            {t(item.text) ? (
                              <Text className="mt-2 text-ink/80">{t(item.text)}</Text>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Section>
            </Reveal>
          );
        }

        if (variant === "interlude") {
          return (
            <Reveal key={key}>
              <Section className="bg-white">
                <div className="mx-auto max-w-2xl text-center">
                  <GoldRule className="mx-auto" />
                  <Heading level="h2" size="md" className="mt-4">
                    {heading}
                  </Heading>
                  {lead ? <Text className="mt-4 leading-relaxed text-ink/80">{lead}</Text> : null}
                </div>
                <SectionPhoto
                  image={section.image}
                  heading={heading}
                  className="relative mx-auto mt-10 aspect-[16/10] w-full max-w-4xl md:aspect-[16/9]"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </Section>
            </Reveal>
          );
        }

        // feature — uzun maddeler satırlarda okunur, foto altta sinematik bant.
        return (
          <Reveal key={key}>
            <Section className="bg-white">
              <GoldRule />
              <Heading level="h2" size="md" className="mt-4">
                {heading}
              </Heading>
              {lead ? <Text className="mt-4 max-w-3xl">{lead}</Text> : null}
              <div className="max-w-3xl">
                <SectionItems items={items} tone="light" />
              </div>
              <SectionPhoto
                image={section.image}
                heading={heading}
                className="relative mt-10 aspect-[16/10] md:aspect-[16/7]"
                sizes="(max-width: 768px) 100vw, 1180px"
              />
            </Section>
          </Reveal>
        );
      })}
    </>
  );
}
