import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — lightbox testindeki
// sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { TreatmentCard, clampWords } from "../components/treatment-card";
import type { TreatmentListItem } from "../src/content/treatments";

const base: TreatmentListItem = {
  name: { tr: "İmplant", en: "Implant" },
  slug: "implant",
  summary: { tr: "Uzun bir özet metni." },
};

const render = (item: TreatmentListItem) => renderToStaticMarkup(<TreatmentCard item={item} />);

describe("clampWords (DSN-48)", () => {
  it("truncates long summaries at the word boundary with an ellipsis", () => {
    const long = Array.from({ length: 30 }, (_, i) => `kelime${i + 1}`).join(" ");
    const out = clampWords(long);
    expect(out.endsWith("kelime20…")).toBe(true);
    expect(out).not.toContain("kelime21");
  });

  it("keeps short summaries untouched", () => {
    expect(clampWords("kısa özet")).toBe("kısa özet");
  });
});

describe("TreatmentCard (DSN-48 overlay)", () => {
  it("wraps the whole card in a single link to the detail page", () => {
    const html = render({
      ...base,
      heroImage: {
        ref: "image-abc-600x400-jpg",
        lqip: "data:image/jpeg;base64,abc",
        alt: { tr: "İmplant" },
      },
    });
    expect(html).toContain('href="/hizmetlerimiz/implant"');
    expect(html).toContain('src="image-abc-600x400-jpg"');
    expect(html).toContain('alt="İmplant"');
    expect(html).toContain("from-navy/95");
  });

  it("styles the name as the bordered top chip with eyebrow typography", () => {
    const html = render(base);
    expect(html).toContain("uppercase tracking-widest");
    expect(html).toContain("İmplant");
    expect(html).toContain("<h3");
    expect(html).toContain("aspect-[6/7]");
  });

  it("keeps the legacy Detay link out (the card itself is the link)", () => {
    const html = render(base);
    expect(html).not.toContain("Detay →");
  });

  it("renders on the navy surface without an image area when heroImage is missing", () => {
    const html = render(base);
    expect(html).not.toContain("<img");
    expect(html).toContain("bg-navy");
    expect(html).toContain('href="/hizmetlerimiz/implant"');
  });

  it("renders a plain article without a link when the slug is missing", () => {
    const html = render({ ...base, slug: undefined });
    expect(html).toContain("İmplant");
    expect(html).not.toContain('href="/hizmetlerimiz/implant"');
    expect(html).toContain("<article");
  });

  it("falls back to an empty alt text", () => {
    const html = render({ ...base, heroImage: { ref: "image-abc-600x400-jpg" } });
    expect(html).toContain('alt=""');
  });
});
