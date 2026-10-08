import { Heading, Link, Section, buttonVariants } from "@dentaliva/ui";

import type { QuickServiceItem } from "../../src/content/home";
import { TreatmentCard } from "../treatment-card";

/**
 * DSN-45: ana sayfa hizmet grid'i — DSN-26 liste kartı diliyle (görsel +
 * özet + Detay) TreatmentCard'ı paylaşır. Kesim (en fazla 6 kart)
 * fetchHomeData'da yapılır; kayan şerit tüm hizmetleri duyurmaya devam eder.
 * Başlık ve buton copy'si siteCopy'den gelir (DSN-44): copy'siz başlık
 * bloğu ve buton render edilmez, grid aynen çalışır.
 */
export function QuickServicesSection({
  items,
  eyebrow,
  heading,
  ctaLabel,
}: {
  items: QuickServiceItem[];
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
}) {
  if (items.length === 0) return null;
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
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <TreatmentCard key={item.slug} item={item} />
        ))}
      </div>
      {ctaLabel ? (
        <div className="mt-10 text-center">
          <Link href="/hizmetlerimiz" className={buttonVariants({ size: "lg" })}>
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
