import type { ReactNode } from "react";
import Image from "next/image";

import { Heading, Link, Section, Text } from "@dentaliva/ui";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../src/image-target";

const ENV = imageTarget();

/**
 * DSN-25: iç sayfa hero bandı — espresso zemin üzerinde eyebrow (varsa üst
 * listeleme sayfasına bağlantı; wayfinding), serif başlık, destek metni ve
 * opsiyonel medya slotu. Ana sayfa bölüm başlıklarındaki altın çizgi +
 * uppercase eyebrow motifi koyu zeminde kullanılır. Listeleme ve detay
 * sayfaları tek kalıptan hero alır; hekim detayının yandan avatarlı düzeni
 * DSN-32'de (kare portre kararı) bu bileşene taşınacak.
 * Metinler sayfa tarafından verilir (app katmanı) — pakette copy yok.
 *
 * DSN-83 v3: `media` doluysa hero, bölüm akışındaki "duo" kompozisyonuna
 * geçer (Aaron: girişteki yazı da Belirtiler bölümü gibi olsun) — solda
 * eyebrow + serif başlık + destek metni (7 kolon), sağda altın çerçeveli
 * portre (5 kolon). `media` verilmediginde çıktı öncekiyle birebir aynıdır.
 */
export interface PageHeroMedia {
  ref: string;
  alt?: string;
  lqip?: string;
}

export function PageHero({
  eyebrow,
  eyebrowHref,
  title,
  lead,
  media,
  children,
}: {
  eyebrow?: string;
  eyebrowHref?: string;
  title: string;
  lead?: string | null;
  media?: PageHeroMedia;
  children?: ReactNode;
}) {
  const eyebrowBlock = eyebrow ? (
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
  ) : null;

  if (media?.ref) {
    return (
      <Section className="bg-navy">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {eyebrowBlock}
            <Heading level="h1" size="lg" className={eyebrow ? "mt-4 text-white" : "text-white"}>
              {title}
            </Heading>
            {lead ? (
              <Text size="lg" tone="white" className="mt-6">
                {lead}
              </Text>
            ) : null}
            {children}
          </div>
          <figure className="relative aspect-[3/4] overflow-hidden rounded-[4px] border border-[var(--dvn-line-gold)] lg:col-span-5">
            <Image
              src={media.ref}
              alt={media.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              placeholder="blur"
              blurDataURL={media.lqip ?? lqipUrl(media.ref, ENV)}
              className="object-cover"
            />
          </figure>
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-navy">
      {eyebrowBlock}
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
