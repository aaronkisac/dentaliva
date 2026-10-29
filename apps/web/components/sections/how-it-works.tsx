import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import type { HowItWorksStep } from "../../src/content/home";

/**
 * DSN-84: doküman #07 HOW IT WORKS — CareNow'un numaralı-çember timeline
 * kompozisyonu, marka dilinde: xl'de 6 kolon yatay akış, çemberlerin
 * hizasından geçen hairline bağlantı çizgisi; çemberde ince altın halka +
 * serif numara (about/SSS süreç dili). lg'de 3+3, mobilde dikey istif.
 * Adımlar bağlam anlatır, garanti vermez ("herkes için aynı yolculuk"
 * bilinçli yok — doküman kuralı). Veri CMS'ten; başlık bloğu copy'sizse
 * bölüm render edilmez.
 */
export function HowItWorksSection({
  steps,
  eyebrow,
  heading,
}: {
  steps: HowItWorksStep[];
  eyebrow?: string;
  heading?: string;
}) {
  const visible = steps
    .map((step) => ({ title: t(step.title), text: t(step.text) }))
    .filter((step) => step.title)
    .slice(0, 6);
  if (visible.length === 0) return null;
  return (
    <Section className="bg-white">
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
      <div className="relative mt-12">
        {/* xl akış çizgisi: çemberlerin hizasından geçer; çemberler beyaz
            zeminleriyle çizgiyi keser (bağlantı hissi). */}
        <div
          aria-hidden="true"
          className="absolute left-6 right-6 top-[21px] hidden h-px bg-[var(--dvn-line-soft)] xl:block"
        />
        <ol className="relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {visible.map((step, index) => (
            <li key={`${index}-${step.title}`} className="bg-white">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-white font-serif text-sm text-gold-deep"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-lg leading-snug text-ink">{step.title}</h3>
              {step.text ? (
                <p className="mt-1 font-sans text-sm leading-relaxed text-ink/70">{step.text}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
