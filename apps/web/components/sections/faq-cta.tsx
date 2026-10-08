import { Accordion, Heading, Section, Link, buttonVariants } from "@dentaliva/ui";
import type { LocalizedPair } from "../../src/content/home";

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
    .filter((item) => item.question?.tr && item.answer?.tr)
    .map((item) => ({
      id: item.question?.tr ?? "",
      question: item.question?.tr ?? "",
      answer: item.answer?.tr ?? "",
    }));
  if (accordionItems.length === 0) return null;
  const eyebrow = copy?.eyebrow?.tr;
  const support = copy?.support?.tr;
  const ctaLabel = copy?.ctaLabel?.tr;
  const ctaHref = copy?.ctaHref;
  return (
    <Section>
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
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
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
              {heading}
            </Heading>
          ) : null}
          {support ? (
            <p className="mt-4 max-w-xl font-sans text-lg text-ink/70">{support}</p>
          ) : null}
        </div>
        {ctaLabel && ctaHref ? (
          <Link href={ctaHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
            {ctaLabel}
          </Link>
        ) : null}
      </div>
      <div className="mt-10">
        <Accordion items={accordionItems} variant="flush" />
      </div>
    </Section>
  );
}

export function CtaSection({
  title,
  text,
  phone,
}: {
  title?: LocalizedPair | null;
  text?: LocalizedPair | null;
  phone: string;
}) {
  if (!title?.tr) return null;
  return (
    <Section className="bg-navy text-center">
      <Heading level="h2" size="md" className="text-white">
        {title.tr}
      </Heading>
      {text?.tr ? (
        <p className="mx-auto mt-3 max-w-2xl font-sans text-lg text-white/80">{text.tr}</p>
      ) : null}
      <p className="mt-4 font-sans text-lg text-gold-soft">{phone}</p>
    </Section>
  );
}
