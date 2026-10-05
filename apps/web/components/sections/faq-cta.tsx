import { Accordion, Heading, Section } from "@dentaliva/ui";
import type { LocalizedPair } from "../../src/content/home";

export interface FaqEntry {
  question?: { tr?: string };
  answer?: { tr?: string };
}

export function FaqSection({ items }: { items: FaqEntry[] }) {
  const accordionItems = items
    .filter((item) => item.question?.tr && item.answer?.tr)
    .map((item) => ({
      id: item.question?.tr ?? "",
      question: item.question?.tr ?? "",
      answer: item.answer?.tr ?? "",
    }));
  if (accordionItems.length === 0) return null;
  return (
    <Section>
      <Heading level="h2" size="md">
        Sıkça Sorulan Sorular
      </Heading>
      <div className="mt-8 max-w-3xl">
        <Accordion items={accordionItems} />
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
