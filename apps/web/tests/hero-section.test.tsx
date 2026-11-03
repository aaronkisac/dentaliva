// DSN-89: hero banner carousel — varyant slaytları, aria ve fallback yolları.
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// HeroSection hero görsellerini next/image ile basar — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { HeroSection } from "../components/sections/hero";
import type { HeroBannerData } from "../src/content/home";

const splitBanner: HeroBannerData = {
  variant: "split",
  eyebrow: { tr: "Dentaliva" },
  headline: { tr: "Birinci banner" },
  body: { tr: "Birinci gövde metni" },
  sideImages: [{ ref: "image-abc123-600x750-jpg", alt: { tr: "klinik kartı" } }],
};

const bleedBanner: HeroBannerData = {
  variant: "full-bleed",
  headline: { tr: "İkinci banner" },
  image: { asset: { _ref: "image-def456-2400x1400-jpg" } },
};

const mediloBanner: HeroBannerData = {
  variant: "medilo",
  headline: { tr: "Eksiksiz Bir Gülüş Dönüşümü." },
  highlight: { tr: "Gülüş Dönüşümü." },
  body: { tr: "Medilo gövde metni" },
  calloutTitle: { tr: "Randevu için bizi arayın" },
  image: { asset: { _ref: "image-cccc33-2400x1400-jpg" } },
};

describe("HeroSection", () => {
  it("renders all banner slides; inactive slide is aria-hidden (DSN-89)", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{ banners: [splitBanner, bleedBanner], interval: 5 }}
        trust={null}
        whatsapp={null}
      />,
    );
    expect(html).toContain("Birinci banner");
    expect(html).toContain("İkinci banner");
    // Crossfade yığını: pasif slayt görünmez + erişilebilirlik ağacı dışı.
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("invisible");
    // Carousel bölgesi ui-strings'den etiketlenir.
    expect(html).toContain("Öne çıkan banner&#x27;lar");
    // interval CRM'den gelir; client saatini sızdırmamak için markup'ta taşınmaz.
  });

  it("single banner renders without the carousel client surface", () => {
    const html = renderToStaticMarkup(
      <HeroSection data={{ banners: [splitBanner] }} trust={null} whatsapp={null} />,
    );
    expect(html).toContain("Birinci banner");
    expect(html).not.toContain("carousel");
  });

  it("split banner renders the right portrait card", () => {
    const html = renderToStaticMarkup(
      <HeroSection data={{ banners: [splitBanner, bleedBanner] }} trust={null} whatsapp={null} />,
    );
    expect(html).toContain("image-abc123-600x750-jpg");
    expect(html).toContain("klinik kartı");
  });

  it("full-bleed banner renders the decorative background image", () => {
    const html = renderToStaticMarkup(
      <HeroSection data={{ banners: [bleedBanner, splitBanner] }} trust={null} whatsapp={null} />,
    );
    expect(html).toContain("image-def456-2400x1400-jpg");
    expect(html).toContain("hero-zoom");
  });

  it("without banners keeps the legacy split hero byte-for-byte behaviour", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{
          headline: { tr: "Eski başlık" },
          sideImages: [{ ref: "image-aaaa11-600x750-jpg" }],
        }}
        trust={null}
        whatsapp={null}
      />,
    );
    expect(html).toContain("Eski başlık");
    expect(html).toContain("image-aaaa11-600x750-jpg");
    expect(html).not.toContain("carousel");
  });

  it("without banners and sideImages keeps the legacy full-bleed fallback", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{
          headline: { tr: "v1 başlık" },
          image: { asset: { _ref: "image-bbbb22-2400x1400-jpg" } },
        }}
        trust={null}
        whatsapp={null}
      />,
    );
    expect(html).toContain("v1 başlık");
    expect(html).toContain("image-bbbb22-2400x1400-jpg");
    expect(html).toContain("hero-zoom");
  });

  it("skips empty banners instead of rendering blank slides", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{ banners: [{ variant: "split" }, bleedBanner] }}
        trust={null}
        whatsapp={null}
      />,
    );
    expect(html).toContain("İkinci banner");
    expect(html).not.toContain("carousel");
  });

  it("medilo banner renders the white card with highlight and callout (DSN-90)", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{ banners: [mediloBanner, bleedBanner] }}
        trust={null}
        whatsapp={null}
        phone="+90 212 555 54 82"
      />,
    );
    // Beyaz kart dili + bg foto.
    expect(html).toContain("rounded-[50px]");
    expect(html).toContain("bg-white");
    expect(html).toContain("image-cccc33-2400x1400-jpg");
    // Vurgu: kelime altın span'de, başlığın kalanı düz.
    expect(html).toContain("Eksiksiz Bir");
    expect(html).toContain("bg-gold/30");
    // Bilgi bloğu: şerit + başlık + telefon (ui-strings etiketi + tel linki).
    expect(html).toContain("Randevu için bizi arayın");
    expect(html).toContain("Bizi arayın:");
    expect(html).toContain("tel:+902125555482");
    // Medilo kartında navy metin dili — beyaz-üstü yazı sınıfları yok.
    expect(html).toContain("text-navy");
  });

  it("medilo highlight only wraps when the word occurs in the headline", () => {
    const html = renderToStaticMarkup(
      <HeroSection
        data={{
          banners: [{ ...mediloBanner, highlight: { tr: "olmayan kelime" } }, bleedBanner],
        }}
        trust={null}
        whatsapp={null}
        phone={null}
      />,
    );
    expect(html).toContain("Eksiksiz Bir Gülüş Dönüşümü.");
    expect(html).not.toContain("bg-gold/30");
    // Telefon yoksa tel satırı render edilmez ama bilgi bloğu kalır.
    expect(html).toContain("Randevu için bizi arayın");
    expect(html).not.toContain("tel:");
  });

  it("single medilo banner renders without the carousel client surface", () => {
    const html = renderToStaticMarkup(
      <HeroSection data={{ banners: [mediloBanner] }} trust={null} whatsapp={null} phone={null} />,
    );
    expect(html).toContain("rounded-[50px]");
    expect(html).not.toContain("carousel");
    // Medilo bg'si hero-zoom (v1) animasyonu kullanmaz.
    expect(html).not.toContain("hero-zoom");
  });
});
