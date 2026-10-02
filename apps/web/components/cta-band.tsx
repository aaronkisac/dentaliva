import { Heading, Link, Reveal, Section, buttonVariants } from "@dentaliva/ui";

import type { LocalizedPair } from "../src/content/home";

/**
 * DSN-24: iç sayfa sonlarındaki dönüşüm bandı. Ana sayfa CtaSection'ın
 * espresso zemin + serif başlık dilini taşır ve eksik olan aksiyonu ekler:
 * randevu butonu ve telefon. İçerik CMS'ten gelir (homePage.cta + telefon);
 * başlık yoksa bant render edilmez — sıfır-hardcoded-copy kuralı ve
 * "boş bölüm canlıya çıkmaz" ilkesi.
 */
export function CtaBand({
  title,
  text,
  phone,
}: {
  title?: LocalizedPair | null;
  text?: LocalizedPair | null;
  phone?: string;
}) {
  const heading = title?.tr;
  if (!heading) return null;

  // DSN-27: bant gorunume girerken belirir (ana sayfa CTA'siyla ayni davranis).
  return (
    <Reveal>
      <Section className="bg-navy text-center">
        <Heading level="h2" size="md" className="text-white">
          {heading}
        </Heading>
        {text?.tr ? (
          <p className="mx-auto mt-3 max-w-2xl font-sans text-lg text-white/80">{text.tr}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/iletisim" className={buttonVariants({ size: "lg" })}>
            Randevu Al
          </Link>
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="font-sans text-lg text-gold-soft underline-offset-4 hover:underline"
            >
              {phone}
            </a>
          ) : null}
        </div>
      </Section>
    </Reveal>
  );
}
