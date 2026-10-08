import { Fragment } from "react";

import Image from "next/image";

import { buttonVariants, Link } from "@dentaliva/ui";
import { Container } from "@dentaliva/ui";
import { Heading } from "@dentaliva/ui";
import { Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import { site } from "../../src/config";
import type { LocalizedPair } from "../../src/content/home";

import { imageTarget } from "../../src/image-target";

export interface HeroData {
  headline?: { tr?: string; en?: string };
  subline?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string }; lqip?: string };
}

export interface HeroTrust {
  since?: LocalizedPair | null;
  experience?: LocalizedPair | null;
  googleRating?: LocalizedPair | null;
}

const ENV = imageTarget();

/**
 * DSN-12/13: full-bleed hero — arka planda klinik fotoğrafı, üstünde sıcak
 * espresso overlay; içerik SOLA hizalı (referans: align-items flex-start,
 * 100vh); yüklemede staggered fade-up (saf CSS, reduced-motion duyarlı) ve
 * arka planda yavaş zoom-out. Görsel yoksa düz espresso zemin (boş-CMS
 * güvenli). Fixed şeffaf header bu bölümün üstünde durur (DSN-11).
 */
export function HeroSection({
  data,
  trust,
}: {
  data: HeroData | null;
  /** DSN-44: güven satırı siteCopy'den — parça yoksa satır hiç render edilmez. */
  trust?: HeroTrust | null;
}) {
  // Copy sweep: hero metni yalnızca CMS'ten gelir — fallback copy yok.
  const headline = pickLocalized(data?.headline);
  const subline = pickLocalized(data?.subline);
  const trustItems = [trust?.since?.tr, trust?.experience?.tr, trust?.googleRating?.tr].filter(
    (item): item is string => Boolean(item),
  );
  const ref = data?.image?.asset?._ref;
  const dims = ref ? (refDimensions(ref) ?? { width: 2400, height: 1400 }) : null;
  const rise = (delay: number) => ({ animationDelay: `${delay}ms` });

  return (
    <section className="relative flex min-h-screen items-center overflow-clip bg-navy text-white">
      {ref && dims ? (
        <>
          <div aria-hidden="true" className="hero-zoom absolute inset-0">
            <Image
              src={ref}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              // PRF-5: inline base64 lqip (HTML'le gelir) — uzak 32px URL
              // isteği yalnızca fallback olarak kalır.
              blurDataURL={data?.image?.lqip ?? lqipUrl(ref, ENV)}
              className="object-cover"
            />
          </div>
          {/* Okunabilirlik overlay'i: marka espresso'sundan sıcak karartma. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy/85"
          />
        </>
      ) : null}
      <Container className="relative">
        <div className="flex max-w-3xl flex-col items-start gap-9 py-[var(--dvn-section-y)] text-left md:py-[var(--dvn-section-y-md)]">
          {headline ? (
            <Heading level="h1" size="xl" className="hero-rise text-white" style={rise(80)}>
              {headline}
            </Heading>
          ) : null}
          {subline ? (
            <Text size="lg" tone="white" className="hero-rise text-white/85" style={rise(220)}>
              {subline}
            </Text>
          ) : null}
          <div className="hero-rise flex flex-wrap items-center gap-4" style={rise(360)}>
            <Link href="/iletisim" className={buttonVariants({ size: "lg" })}>
              Randevu Al
            </Link>
            <Link
              href="/hizmetlerimiz"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                class: "border-ivory/50 text-white hover:border-gold-soft hover:text-gold-soft",
              })}
            >
              Hizmetlerimizi Keşfedin
            </Link>
          </div>
          {/* DSN-44: güven satırı siteCopy'den; tek parça bile yoksa satır basılmaz. */}
          {trustItems.length > 0 ? (
            <div
              className="hero-rise flex flex-wrap items-center gap-x-8 gap-y-2 font-sans text-sm text-ivory/80"
              style={rise(480)}
            >
              {trustItems.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-gold">
                      ·
                    </span>
                  ) : null}
                  <span>{item}</span>
                </Fragment>
              ))}
              <span aria-hidden="true" className="text-gold">
                ·
              </span>
              <span>{site.domain.replace("www.", "")}</span>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
