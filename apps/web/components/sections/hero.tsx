import Image from "next/image";

import { buttonVariants, Container, Heading, Link, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import { site } from "../../src/config";
import type { HeroBannerData, LocalizedPair } from "../../src/content/home";

import { imageTarget } from "../../src/image-target";
import { uiString } from "../../src/ui-strings";
import { routes } from "../../src/routes";

import { HeroCarousel } from "./hero-carousel";

export interface HeroData {
  eyebrow?: { tr?: string; en?: string };
  headline?: { tr?: string; en?: string };
  subline?: { tr?: string; en?: string };
  /** DSN-84: doküman #01 gövde metni — boşken basılmaz. */
  body?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string }; lqip?: string };
  /** DSN-84: doküman #01 — sağdaki fotoğraf dizisi; doluysa split hero. */
  sideImages?: Array<{ ref?: string; alt?: LocalizedPair; lqip?: string }>;
  /** DSN-89: dönüşümlü banner'lar — doluysa hero carousel'e döner. */
  banners?: HeroBannerData[];
  /** DSN-89: banner geçiş süresi (saniye) — CRM'den, default 5. */
  interval?: number;
}

export interface HeroTrust {
  since?: LocalizedPair | null;
  experience?: LocalizedPair | null;
  googleRating?: LocalizedPair | null;
}

const ENV = imageTarget();

type HeroContentProps = {
  eyebrow?: LocalizedPair;
  headline?: LocalizedPair;
  /** Yalnız legacy hero alanı (v1 alt başlığı) — banner'lar body kullanır. */
  subline?: LocalizedPair;
  body?: LocalizedPair;
  image?: HeroData["image"];
  sideImages?: HeroData["sideImages"];
  trust?: HeroTrust | null;
  whatsapp?: string | null;
  /** DSN-89: carousel'da yalnız ilk slayt priority (LCP). */
  priority?: boolean;
};

/**
 * Tek hero sahnesi: tam-bleed arka plan (görsel varken ve split kartı yokken,
 * v1 ile birebir) + sol copy kolonu (eyebrow/H1/alt başlık/gövde/çift
 * CTA/güven satırı) + split kartları. DSN-89 ile legacy hero ve her banner
 * slaytı aynı sahneyi çizer — varyant verinin şekliyle belirlenir.
 */
function HeroContent({
  eyebrow,
  headline,
  subline,
  body,
  image,
  sideImages,
  trust,
  whatsapp,
  priority = true,
}: HeroContentProps) {
  const eyebrowText = t(eyebrow);
  const headlineText = t(headline);
  const sublineText = t(subline);
  const bodyText = t(body);
  const trustItems = [t(trust?.since), t(trust?.experience), t(trust?.googleRating)].filter(
    (item): item is string => Boolean(item),
  );
  const sides = (sideImages ?? []).filter(
    (img): img is { ref: string; alt?: LocalizedPair; lqip?: string } => Boolean(img.ref),
  );
  const primary = sides[0];
  const secondary = sides[1];
  const ref = image?.asset?._ref;
  const dims = ref ? (refDimensions(ref) ?? { width: 2400, height: 1400 }) : null;
  const rise = (delay: number) => ({ animationDelay: `${delay}ms` });

  return (
    <>
      {/* Split modda arka plan temiz kalır (sağ kartlar sahneyi taşır);
          tam-bleed yolu v1 ile birebir. */}
      {ref && dims && !primary ? (
        <>
          <div aria-hidden="true" className="hero-zoom absolute inset-0">
            <Image
              src={ref}
              alt=""
              fill
              priority={priority}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={image?.lqip ?? lqipUrl(ref, ENV)}
              className="object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/55 to-navy/85"
          />
        </>
      ) : null}
      <Container className="relative">
        <div className="grid items-center gap-12 py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex max-w-2xl flex-col items-start gap-6 text-left">
            {eyebrowText ? (
              <div className="hero-rise flex items-center gap-3" style={rise(40)}>
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                <p className="font-sans text-xs uppercase tracking-widest text-gold-soft">
                  {eyebrowText}
                </p>
              </div>
            ) : null}
            {headlineText ? (
              <Heading level="h1" size="xl" className="hero-rise text-white" style={rise(120)}>
                {headlineText}
              </Heading>
            ) : null}
            {sublineText ? (
              <Text size="lg" tone="white" className="hero-rise text-white/85" style={rise(240)}>
                {sublineText}
              </Text>
            ) : null}
            {bodyText ? (
              <p
                className="hero-rise max-w-xl font-sans text-base leading-relaxed text-white/70"
                style={rise(320)}
              >
                {bodyText}
              </p>
            ) : null}
            <div className="hero-rise flex flex-wrap items-center gap-4" style={rise(420)}>
              {/* DSN-63: birincil dönüşüm ilk değerlendirme formu (doküman #01). */}
              <Link href="#review" className={buttonVariants({ size: "lg" })}>
                {uiString("startReviewCta")}
              </Link>
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    class: "border-ivory/50 text-white hover:border-gold-soft hover:text-gold-soft",
                  })}
                >
                  {uiString("whatsappCta")}
                </a>
              ) : (
                <Link
                  href={routes.treatments}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    class: "border-ivory/50 text-white hover:border-gold-soft hover:text-gold-soft",
                  })}
                >
                  {uiString("exploreServicesCta")}
                </Link>
              )}
            </div>
            {trustItems.length > 0 ? (
              <div
                className="hero-rise flex flex-wrap items-center gap-x-8 gap-y-2 font-sans text-sm text-ivory/80"
                style={rise(520)}
              >
                {trustItems.map((item, index) => (
                  <span key={item}>
                    {index > 0 ? (
                      <span aria-hidden="true" className="mr-8 text-gold">
                        ·
                      </span>
                    ) : null}
                    <span>{item}</span>
                  </span>
                ))}
                <span aria-hidden="true" className="text-gold">
                  ·
                </span>
                <span>{site.domain.replace("www.", "")}</span>
              </div>
            ) : null}
          </div>
          {primary ? (
            <div
              className="hero-rise relative hidden h-full max-h-[640px] md:block"
              style={rise(300)}
            >
              {/* Ana kart: 3/4 portre, altın çerçeve (about kartı dili). */}
              <div className="relative aspect-[3/4] w-[78%] overflow-clip rounded-[4px] border border-gold/60">
                <Image
                  src={primary.ref}
                  alt={t(primary.alt) || ""}
                  fill
                  priority={priority}
                  sizes="(max-width: 1024px) 0px, 40vw"
                  placeholder="blur"
                  blurDataURL={primary.lqip ?? lqipUrl(primary.ref, ENV)}
                  className="object-cover"
                />
              </div>
              {/* İkinci kart: sağ altta offset'li, hairline çerçeveli. */}
              {secondary ? (
                <div className="absolute bottom-[-8%] right-0 aspect-[3/4] w-[52%] overflow-clip rounded-[4px] border border-white/20 shadow-[var(--dvn-shadow-lift)]">
                  <Image
                    src={secondary.ref}
                    alt={t(secondary.alt) || ""}
                    fill
                    sizes="(max-width: 1024px) 0px, 28vw"
                    placeholder="blur"
                    blurDataURL={secondary.lqip ?? lqipUrl(secondary.ref, ENV)}
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </>
  );
}

const SECTION_CLASS = "relative flex min-h-[92vh] items-center overflow-clip bg-navy text-white";

/** Banner slaytlarının ortak gövdesi — en az bir içerik parçası taşır. */
function hasContent(banner: HeroBannerData): boolean {
  return (
    Boolean(t(banner.headline)) ||
    Boolean(banner.image?.asset?._ref) ||
    (banner.sideImages ?? []).some((img) => Boolean(img.ref))
  );
}

/**
 * DSN-84 split hero (CareNow/DentalX kompozisyonu) + DSN-89 banner
 * carousel'i. banners doluysa hero banner'lar arasında crossfade ile döner
 * (ok/nokta yok; süre CRM'den); tek banner'da client JS hiç yüklenmez;
 * banners boşken mevcut davranış birebir korunur (eu/nl güvenli).
 */
export function HeroSection({
  data,
  trust,
  whatsapp,
}: {
  data: HeroData | null;
  /** DSN-44: güven satırı siteCopy'den — parça yoksa satır hiç render edilmez. */
  trust?: HeroTrust | null;
  /** DSN-63: ikincil CTA WhatsApp kanalı — numara yoksa tedaviler CTA'sı. */
  whatsapp?: string | null;
}) {
  const banners = (data?.banners ?? []).filter(hasContent);

  if (banners.length > 0) {
    const single = banners[0];
    if (banners.length === 1 && single) {
      return (
        <section className={SECTION_CLASS}>
          <HeroContent
            eyebrow={single.eyebrow}
            headline={single.headline}
            body={single.body}
            image={single.image}
            sideImages={single.sideImages}
            trust={trust}
            whatsapp={whatsapp}
            priority
          />
        </section>
      );
    }
    return (
      <section className="relative overflow-clip bg-navy text-white">
        <HeroCarousel intervalSeconds={data?.interval}>
          {banners.map((banner, index) => (
            <div key={index} className="relative flex min-h-[92vh] items-center">
              <HeroContent
                eyebrow={banner.eyebrow}
                headline={banner.headline}
                body={banner.body}
                image={banner.image}
                sideImages={banner.sideImages}
                trust={trust}
                whatsapp={whatsapp}
                priority={index === 0}
              />
            </div>
          ))}
        </HeroCarousel>
      </section>
    );
  }

  return (
    <section className={SECTION_CLASS}>
      <HeroContent
        eyebrow={data?.eyebrow}
        headline={data?.headline}
        subline={data?.subline}
        body={data?.body}
        image={data?.image}
        sideImages={data?.sideImages}
        trust={trust}
        whatsapp={whatsapp}
        priority
      />
    </section>
  );
}
