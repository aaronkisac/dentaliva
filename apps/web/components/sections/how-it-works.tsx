import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import type { HowItWorksStep } from "../../src/content/home";

/**
 * DSN-64: strateji dokümanı #07 HOW IT WORKS — tedavi ve seyahat
 * belirsizliğini azaltan süreç bölümü. Dokümandaki 6 adımlı yatay timeline'ın
 * bizim dilimizdeki karşılığı: xl'de tek satır 6 kolon (yatay akış), lg'de
 * 3+3, mobilde dikey istif; adım başına serif altın numara (01–06,
 * about/SSS süreç dili) + başlık + kısa metin. Veri CMS'ten; başlık bloğu
 * copy'sizse bölüm render edilmez. "Herkes için aynı yolculuk" iddiası
 * bilinçli yok — süreç adımları bağlam anlatır, garanti vermez.
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
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {visible.map((step, index) => (
          <li
            key={`${index}-${step.title}`}
            className="border-t border-[var(--dvn-line-soft)] pt-4"
          >
            <span aria-hidden="true" className="font-serif text-lg text-gold-deep">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-serif text-lg leading-snug text-ink">{step.title}</h3>
            {step.text ? (
              <p className="mt-1 font-sans text-sm leading-relaxed text-ink/70">{step.text}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
