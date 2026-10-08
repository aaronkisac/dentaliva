import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { FaqSection } from "../components/sections/faq-cta";
import type { FaqEntry } from "../components/sections/faq-cta";

const items: FaqEntry[] = [
  { question: { tr: "Soru 1?" }, answer: { tr: "Yanıt 1" } },
  { question: { tr: "Soru 2?" }, answer: { tr: "Yanıt 2" } },
];

const render = (props: React.ComponentProps<typeof FaqSection>) =>
  renderToStaticMarkup(<FaqSection {...props} />);

describe("FaqSection (DSN-47)", () => {
  it("renders eyebrow, heading, support and CTA in the header row", () => {
    const html = render({
      items,
      heading: "Sıkça Sorulan Sorular",
      copy: {
        eyebrow: { tr: "Merak Edilenler" },
        support: { tr: "Ön büromuz aynı gün dönüyor." },
        ctaLabel: { tr: "Bize Sorun" },
        ctaHref: "/iletisim",
      },
    });
    expect(html).toContain("Merak Edilenler");
    expect(html).toContain("Sıkça Sorulan Sorular");
    expect(html).toContain("Ön büromuz aynı gün dönüyor.");
    expect(html).toContain('href="/iletisim"');
    expect(html).toContain("Bize Sorun");
    expect(html).toContain("Soru 1?");
  });

  it("uses the flush accordion variant on the home page", () => {
    const html = render({ items, heading: "SSS", copy: null });
    expect(html).not.toContain("border border-[var(--dvn-line-soft)]");
    expect(html).toContain("px-0 py-5");
  });

  it("omits header parts that have no CMS copy", () => {
    const html = render({ items, heading: "SSS" });
    expect(html).toContain("SSS");
    expect(html).not.toContain("uppercase tracking-widest");
    expect(html).not.toContain("/iletisim");
  });

  it("renders nothing without usable items", () => {
    expect(render({ items: [], heading: "SSS" })).toBe("");
  });
});
