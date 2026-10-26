import { Accordion, Heading, Section, Link, buttonVariants } from "@dentaliva/ui";
import type { LocalizedPair } from "../../src/content/home";
import { t } from "../../src/i18n";
import { uiString } from "../../src/ui-strings";

import { ReviewFormLoader } from "../review-form-loader";

export interface FaqEntry {
  question?: { tr?: string };
  answer?: { tr?: string };
}

export interface FaqSectionCopy {
  eyebrow?: LocalizedPair;
  support?: LocalizedPair;
  ctaLabel?: LocalizedPair;
  ctaHref?: string;
}

/**
 * DSN-47: ReoDental düzen deseni — eyebrow motifli başlık bloğu + destek
 * metni + sağda CTA; liste accordion'un flush varyantıyla tam genişlik.
 * Tüm metinler siteCopy.faq'tan; parça yoksa o öğe render edilmez.
 */
export function FaqSection({
  items,
  heading,
  copy,
}: {
  items: FaqEntry[];
  heading?: string;
  copy?: FaqSectionCopy | null;
}) {
  const accordionItems = items
    .filter((item) => t(item.question) && t(item.answer))
    .map((item) => ({
      id: t(item.question),
      question: t(item.question),
      answer: t(item.answer),
    }));
  if (accordionItems.length === 0) return null;
  const eyebrow = t(copy?.eyebrow);
  const support = t(copy?.support);
  const ctaLabel = t(copy?.ctaLabel);
  const ctaHref = copy?.ctaHref;
  return (
    <Section>
      {/* DSN-49: tasarım deseni iki sütun — solda başlık bloğu + CTA, sağda
          liste; mobilde tek sütun (lg altı stack). */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          {heading ? (
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-xl" : "max-w-xl"}>
              {heading}
            </Heading>
          ) : null}
          {support ? <p className="mt-4 font-sans text-lg text-ink/70">{support}</p> : null}
          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className={buttonVariants({ variant: "outline", size: "lg" }) + " mt-8"}
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
        <Accordion items={accordionItems} variant="flush" />
      </div>
    </Section>
  );
}

export function CtaSection({
  title,
  text,
  trustLine,
  eyebrow,
  phone,
  whatsapp,
}: {
  title?: LocalizedPair | null;
  text?: LocalizedPair | null;
  /** DSN-64: doküman #15 güven satırı — privacy/response/provisional notu. */
  trustLine?: LocalizedPair | null;
  eyebrow?: LocalizedPair | null;
  phone: string;
  /** DSN-63/64: WhatsApp kanalı — siteSettings.whatsapp boşken buton basılmaz. */
  whatsapp?: string | null;
}) {
  if (!t(title)) return null;
  const eyebrowText = t(eyebrow);
  const trust = t(trustLine);
  return (
    <Section className="bg-navy">
      {/* DSN-64: doküman #15 — sol karar metni + sağ kısa form; yüksek niyetli
          kullanıcı sayfa sonunda forma geri dönmek zorunda kalmaz. */}
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {eyebrowText ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-soft">
                {eyebrowText}
              </p>
            </div>
          ) : null}
          <Heading level="h2" size="md" className="mt-4 text-white">
            {t(title)}
          </Heading>
          {t(text) ? <p className="mt-4 font-sans text-lg text-white/80">{t(text)}</p> : null}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center border border-white/40 px-6 py-3 font-sans text-sm font-semibold text-white hover:border-gold-soft hover:text-gold-soft"
            >
              {uiString("whatsappCta")}
            </a>
          ) : null}
          {trust ? <p className="mt-6 font-sans text-sm text-white/60">{trust}</p> : null}
          {phone ? <p className="mt-2 font-sans text-sm text-white/60">{phone}</p> : null}
        </div>
        <div className="rounded-[4px] bg-white p-6 md:p-8">
          <ReviewFormLoader variant="compact" />
        </div>
      </div>
    </Section>
  );
}
