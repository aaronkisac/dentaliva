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
});
