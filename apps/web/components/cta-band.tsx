import { Heading, Link, Reveal, Section, buttonVariants } from "@dentaliva/ui";

import type { LocalizedPair } from "../src/content/home";
import { t } from "../src/i18n";
import { routes } from "../src/routes";

/**
 * DSN-24: iç sayfa sonlarındaki dönüşüm bandı. Ana sayfa CtaSection'ın
 * espresso zemin + serif başlık dilini taşır ve eksik olan aksiyonu ekler:
 * randevu butonu ve telefon. İçerik CMS'ten gelir (homePage.cta + telefon);
 * başlık yoksa bant render edilmez — sıfır-hardcoded-copy kuralı ve
 * "boş bölüm canlıya çıkmaz" ilkesi. DSN-68: buton metni de siteCopy'den
 * (ui.appointmentCta) — eu/nl'de Türkçe "Randevu Al" basıyordu; copy yoksa
 * buton render edilmez.
 */
export function CtaBand({
  title,
  text,
  phone,
  actionLabel,
}: {
  title?: LocalizedPair | null;
  text?: LocalizedPair | null;
  phone?: string;
  actionLabel?: string;
}) {
  const heading = t(title);
  if (!heading) return null;

  // DSN-27: bant gorunume girerken belirir (ana sayfa CTA'siyla ayni davranis).
  return (
    <Reveal>
      <Section className="bg-navy text-center">
        <Heading level="h2" size="md" className="text-white">
          {heading}
        </Heading>
        {t(text) ? (
          <p className="mx-auto mt-3 max-w-2xl font-sans text-lg text-white/80">{t(text)}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {actionLabel ? (
            <Link href={routes.contact} className={buttonVariants({ size: "lg" })}>
              {actionLabel}
            </Link>
          ) : null}
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
