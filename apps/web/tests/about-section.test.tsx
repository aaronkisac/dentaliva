import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { AboutSection } from "../components/sections/about";
import type { AboutData, AboutStat } from "../components/sections/about";

const data: AboutData = {
  title: { tr: "Herkesi Gülümset" },
  body: { tr: "2012'den beri hizmetinizdeyiz." },
  image: { asset: { _ref: `image-${"a".repeat(40)}-2400x1400-webp` }, alt: { tr: "Klinik" } },
};

const render = (props: { data: AboutData | null; stats?: AboutStat[]; tone?: "light" | "dark" }) =>
  renderToStaticMarkup(<AboutSection {...props} />);

describe("AboutSection (DSN-52)", () => {
  it("renders photo, title and body", () => {
    const html = render({ data });
    expect(html).toContain('src="image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-2400x1400-webp"');
    expect(html).toContain("Herkesi Gülümset");
    expect(html).toContain("hizmetinizdeyiz.");
    expect(html).toContain("aspect-[4/3]");
  });

  it("renders up to two stat badges over the photo with a navy scrim", () => {
    const html = render({
      data,
      stats: [
        { value: "13+", label: { tr: "Yıllık Deneyim" } },
        { value: "3", label: { tr: "Şube" } },
        { value: "99", label: { tr: "fazla kart basılmaz" } },
      ],
    });
    expect(html).toContain("13+");
    expect(html).toContain("Yıllık Deneyim");
    expect(html).toContain("3");
    expect(html).not.toContain("fazla kart basılmaz");
    expect(html).toContain("from-navy/90");
  });

  it("renders the numbered benefit list with gold counters", () => {
    const html = render({
      data: { ...data, benefits: [{ tr: "Uzman hekim kadrosu" }, { tr: "Konforlu ortam" }] },
    });
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain("Uzman hekim kadrosu");
  });

  it("hides overlay and list without data", () => {
    const html = render({ data: { title: { tr: "X" } } });
    expect(html).not.toContain("from-navy/90");
    expect(html).not.toContain("<ul");
  });

  it("renders nothing without about data", () => {
    expect(render({ data: null })).toBe("");
  });

  it("renders the dark tone with white copy on navy (DSN-52 ana sayfa denemesi)", () => {
    const html = render({
      data: { ...data, benefits: [{ tr: "Uzman hekim kadrosu" }] },
      stats: [{ value: "13+", label: { tr: "Yıllık Deneyim" } }],
      tone: "dark",
    });
    expect(html).toContain("bg-navy");
    expect(html).toContain("text-white");
    expect(html).toContain("divide-white/15");
    expect(html).toContain("text-gold-soft");
  });
});
