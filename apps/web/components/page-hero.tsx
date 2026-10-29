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
 * DSN-83 v4: `media` doluysa hero "flama" kompozisyonuna geçer (Aaron:
 * girişteki bölüm çok boş kalıyordu) — kapak fotoğrafı banda sağdan
 * yaslanır, lacivert zeminle geçişli karışır (gradient overlay); metin
 * soldaki güvenli alanda. `media` verilmediginde çıktı öncekiyle birebir
 * aynıdır.
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
      <Section className="relative overflow-hidden bg-navy">
        {/* DSN-83 v4: flama arka planı (Aaron: "bölüm çok boş kalıyor") —
            liste kartlarındaki kapak fotoğrafı banda sağdan yaslanır ve
            lacivert zeminle geçişli karışır; metin soldaki güvenli alanda
            (max-w-2xl), fotoğraf dekoratif (alt=""). Foto yoksa metin-only
            eski görünüm korunur. */}
        <figure
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[58%]"
        >
          <Image
            src={media.ref}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            placeholder="blur"
            blurDataURL={media.lqip ?? lqipUrl(media.ref, ENV)}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40 md:via-navy/55 md:to-navy/10" />
        </figure>
        <div className="relative max-w-2xl">
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
