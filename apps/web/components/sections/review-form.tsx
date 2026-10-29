import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { ReviewFormLoader } from "../review-form-loader";
import type { LocalizedPair } from "../../src/content/home";

/**
 * DSN-84: doküman #06 INITIAL REVIEW FORM — CareNow'un koyu split randevu
 * bloğu kompozisyonu, marka dilinde: tam genişlik navy bant; solda altın
 * eyebrow + başlık + "sonra ne olacak" numaralı adımları (beyaz serif
 * sayaçlar) + koordinatör destek notu (DSN-79), sağda beyaz form kartı
 * (ortak CallbackForm — privacy linkiyle, DSN-78; sağlık verisi yok —
 * Form 2 ayrı iş). Bölüm `#review` çapasıyla hero CTA'nın hedefidir;
 * sticky header için scroll-margin. homePage.reviewForm unset ise bölüm
 * render edilmez.
 */
export function ReviewFormSection({
  data,
  eyebrow,
  heading,
  privacyHref,
}: {
  data: { steps?: LocalizedPair[]; note?: LocalizedPair } | null;
  eyebrow?: string;
  heading?: string;
  /** DSN-78: Privacy Notice linki formun izin satırına eklenir. */
  privacyHref?: string;
}) {
  if (!data) return null;
  const steps = (data.steps ?? [])
    .map((step) => t(step))
    .filter(Boolean)
    .slice(0, 3);
  // DSN-79: doküman #06 body copy — koordinatör fotoğraf/kayıt güvencesi.
  const note = t(data.note);
  return (
    <Section
      id="review"
      className="scroll-mt-24 bg-navy"
      innerClassName="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
    >
      <div>
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            <p className="font-sans text-xs uppercase tracking-widest text-gold-soft">{eyebrow}</p>
          </div>
        ) : null}
        {heading ? (
          <Heading level="h2" size="md" className={`text-white ${eyebrow ? "mt-4" : ""} max-w-xl`}>
            {heading}
          </Heading>
        ) : null}
        {steps.length > 0 ? (
          <ol className="mt-8 divide-y divide-white/15">
            {steps.map((step, index) => (
              <li key={`${index}-${step}`} className="flex items-baseline gap-3 py-3">
                <span aria-hidden="true" className="font-serif text-sm text-gold-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-white/85">{step}</span>
              </li>
            ))}
          </ol>
        ) : null}
        {note ? (
          <p className="mt-6 border-l-2 border-[var(--dvn-gold)] pl-4 font-sans text-sm text-white/70">
            {note}
          </p>
        ) : null}
      </div>
      <div className="rounded-[4px] bg-white p-6 shadow-[var(--dvn-shadow-lift)] md:p-8">
        <ReviewFormLoader privacyHref={privacyHref} />
      </div>
    </Section>
  );
}
