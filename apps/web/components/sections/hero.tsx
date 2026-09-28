import Image from "next/image";

import { buttonVariants, Link } from "@dentaliva/ui";
import { Container } from "@dentaliva/ui";
import { Heading } from "@dentaliva/ui";
import { Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import { site } from "../../src/config";

export interface HeroData {
  headline?: { tr?: string; en?: string };
  subline?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string } };
}

const ENV = {
  projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
  dataset: process.env.SANITY_DATASET ?? "production",
};

/**
 * DSN-12: full-bleed hero — arka planda klinik fotoğrafı, üstünde sıcak
 * espresso overlay; içerik ortalanmış; altta güven satırı (gerçek veriler:
 * 2012 kuruluşu, 13+ yıl, Google puanı). Görsel yoksa düz espresso zemin
 * ile aynı içerik (boş-CMS güvenli). Fixed şeffaf header bu bölümün
 * üstünde durur (DSN-11).
 */
export function HeroSection({ data }: { data: HeroData | null }) {
  const headline =
    pickLocalized(data?.headline) || "Dentaliva Göz Alıcı Bir Gülüşe Sahip Olmanızı Sağlıyor";
  const subline = pickLocalized(data?.subline) || "İstanbul'da Diş Kliniği";
  const ref = data?.image?.asset?._ref;
  const dims = ref ? (refDimensions(ref) ?? { width: 2400, height: 1400 }) : null;
  return (
    <section className="relative flex min-h-[92svh] items-center bg-navy text-white">
      {ref && dims ? (
        <>
          <Image
            src={ref}
            alt={pickLocalized(data?.image?.alt) || headline}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={lqipUrl(ref, ENV)}
            className="object-cover"
          />
          {/* Okunabilirlik overlay'i: marka espresso'sundan sıcak karartma. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#1c1610]/80 via-[#1c1610]/55 to-[#1c1610]/85"
          />
        </>
      ) : null}
      <Container className="relative py-[var(--dvn-section-y)] text-center md:py-[var(--dvn-section-y-md)]">
        <Heading level="h1" size="xl" className="mx-auto max-w-4xl text-white">
          {headline}
        </Heading>
        <Text size="lg" tone="white" className="mx-auto mt-6 max-w-2xl text-white/85">
          {subline}
        </Text>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-sans text-sm text-ivory/80">
          <span>2012&apos;den beri</span>
          <span aria-hidden="true" className="text-gold">
            ·
          </span>
          <span>13+ yıl deneyim</span>
          <span aria-hidden="true" className="text-gold">
            ·
          </span>
          <span>Google değerlendirmesi: 5.0</span>
          <span aria-hidden="true" className="text-gold">
            ·
          </span>
          <span>{site.domain.replace("www.", "")}</span>
        </div>
      </Container>
    </section>
  );
}
