import { Heading, Link, Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import type { BeforeAfterCase } from "../../src/content/home";
import { BeforeAfterSlider } from "../before-after-slider";
import { routes } from "../../src/routes";

/**
 * DSN-50: anasayfa önce/sonra karşılaştırma bölümü — ReoDental deseni
 * (slider'lı beyaz kart + numara chip'i + başlık + metin) bizim dilimizde.
 * Sıfır-hardcoded-copy: başlık siteCopy'den; veri (görsel çifti) yoksa
 * bölüm render edilmez. Slider sürülebilir olduğu için kartın tamamı
 * link DEĞİL — başlık, ilgili hizmet varsa onun detayına bağlanır.
 */
export function OnceSonraSection({
  items,
  eyebrow,
  heading,
  beforeLabel,
  afterLabel,
}: {
  items: BeforeAfterCase[];
  eyebrow?: string;
  heading?: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const cards = items.filter((item) => item.before?.ref && item.after?.ref);
  if (cards.length === 0) return null;

  return (
    <Section>
      {heading ? (
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          <Heading level="h2" size="md" className="mt-4 max-w-2xl">
            {heading}
          </Heading>
        </div>
      ) : null}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((item, index) => {
          const title = t(item.title);
          const text = t(item.text);
          const slug = item.treatment?.slug;
          const headingNode = (
            <Heading level="h3" size="title">
              {slug && title ? (
                <Link
                  href={routes.treatment(slug)}
                  className="hover:text-gold-deep hover:no-underline"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </Heading>
          );
          return (
            <article
              key={slug ?? title ?? index}
              className="overflow-hidden rounded-[4px] border border-[var(--dvn-line-soft)] bg-white text-ink transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)]"
            >
              <BeforeAfterSlider
                before={{
                  ref: item.before!.ref!,
                  alt: t(item.before?.alt),
                  lqip: item.before?.lqip,
                }}
                after={{
                  ref: item.after!.ref!,
                  alt: t(item.after?.alt) ?? "",
                  lqip: item.after?.lqip,
                }}
                label={title ?? ""}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
              />
              <div className="p-6">
                <span
                  aria-hidden="true"
                  className="inline-block rounded-[4px] border border-[var(--dvn-line-soft)] px-2 py-1 font-serif text-sm text-gold-deep"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-3">{headingNode}</div>
                {text ? <Text className="mt-2">{text}</Text> : null}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
