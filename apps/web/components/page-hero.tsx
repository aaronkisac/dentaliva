import type { ReactNode } from "react";

import { Heading, Link, Section, Text } from "@dentaliva/ui";

/**
 * DSN-25: iç sayfa hero bandı — espresso zemin üzerinde eyebrow (varsa üst
 * listeleme sayfasına bağlantı; wayfinding), serif başlık, destek metni ve
 * opsiyonel medya slotu. Ana sayfa bölüm başlıklarındaki altın çizgi +
 * uppercase eyebrow motifi koyu zeminde kullanılır. Listeleme ve detay
 * sayfaları tek kalıptan hero alır; hekim detayının yandan avatarlı düzeni
 * DSN-32'de (kare portre kararı) bu bileşene taşınacak.
 * Metinler sayfa tarafından verilir (app katmanı) — pakette copy yok.
 */
export function PageHero({
  eyebrow,
  eyebrowHref,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  eyebrowHref?: string;
  title: string;
  lead?: string | null;
  children?: ReactNode;
}) {
  return (
    <Section className="bg-navy">
      {eyebrow ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          {eyebrowHref ? (
            <Link
              href={eyebrowHref}
              className="font-sans text-xs uppercase tracking-widest text-gold transition-colors hover:text-gold-soft"
            >
              {eyebrow}
            </Link>
          ) : (
            <p className="font-sans text-xs uppercase tracking-widest text-gold">{eyebrow}</p>
          )}
        </div>
      ) : null}
      <Heading level="h1" size="lg" className={eyebrow ? "mt-4 text-white" : "text-white"}>
        {title}
      </Heading>
      {lead ? (
        <Text size="lg" tone="white" className="mt-6 max-w-3xl">
          {lead}
        </Text>
      ) : null}
      {children}
    </Section>
  );
}
