import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { TreatmentSections } from "../components/treatment-sections";
import type { TreatmentSection } from "../src/content/treatments";

const REF = `image-${"a".repeat(40)}-1024x1024-webp`;

const item = (n: number): { title: { tr: string }; text: { tr: string } } => ({
  title: { tr: `Madde ${n}` },
  text: { tr: `Madde ${n} metni.` },
});

const section = (over: Partial<TreatmentSection>): TreatmentSection => ({
  heading: { tr: "Bölüm" },
  lead: { tr: "Giriş metni." },
  items: [],
  ...over,
});

const render = (sections: TreatmentSection[]) =>
  renderToStaticMarkup(<TreatmentSections sections={sections} />);

describe("TreatmentSections (DSN-83 v2 — kompozisyon varyantları)", () => {
  it("3 madde → feature (v5): 2 kolonlu mozaik, foto son hücreyle eşleşir", () => {
    const html = render([
      section({
        items: [item(1), item(2), item(3)],
        image: { ref: REF, lqip: "data:image/webp;base64,AAA", alt: { tr: "Klinik" } },
      }),
    ]);
    expect(html).toContain(">01<");
    expect(html).toContain("md:grid-cols-2");
    expect(html).toContain("border-t border-[var(--dvn-line-soft)]");
    expect(html).toContain("font-serif text-2xl text-gold");
    // Tek sayı + foto → foto hücre olarak akışta (bant değil)
    expect(html).toContain("aspect-[4/3]");
    expect(html).not.toContain("aspect-[16/10] md:aspect-[16/7]");
  });

  it("feature çift sayı madde + foto → foto altta sinematik bant kalır", () => {
    const html = render([
      section({
        items: [item(1), item(2), item(3), item(4), item(5), item(6)],
        image: { ref: REF, lqip: "data:image/webp;base64,AAA", alt: { tr: "Klinik" } },
      }),
    ]);
    expect(html).toContain("aspect-[16/10] md:aspect-[16/7]");
    expect(html).not.toContain("aspect-[4/3]");
  });

  it("2 madde → duo: lacivert bant, beyaz başlık, altın sayaç, portre foto", () => {
    const html = render([
      section({ items: [item(1), item(2)], image: { ref: REF, alt: { tr: "Klinik" } } }),
    ]);
    expect(html).toContain("bg-navy");
    expect(html).toContain("text-white");
    expect(html).toContain("divide-white/15");
    expect(html).toContain("text-gold-soft");
    expect(html).toContain("aspect-[3/4]");
  });

  it("4 madde → quad: geniş foto bandı + 2×2 kadran (kart yok, hairline üst çizgi)", () => {
    const html = render([
      section({
        items: [item(1), item(2), item(3), item(4)],
        image: { ref: REF, alt: { tr: "Klinik" } },
      }),
    ]);
    expect(html).toContain("md:grid-cols-2");
    expect(html).toContain("md:aspect-[2/1]");
    expect(html).toContain("border-t border-[var(--dvn-line-soft)]");
    expect(html).toContain(">04<");
  });

  it("madde yok → interlude: ortalanmış dar kolon + ortalanmış altın çizgi", () => {
    const html = render([section({ items: [] })]);
    expect(html).toContain("max-w-2xl text-center");
    expect(html).toContain("mx-auto");
  });

  it("madde yok + uzun metin (800+) → editorial: sol hizalı okuma kolonu, ortalanmış değil", () => {
    const long = { tr: "uzun ".repeat(200).trim() };
    const html = render([section({ lead: long, items: [] })]);
    expect(html).toContain("max-w-3xl");
    expect(html).not.toContain("text-center");
    expect(html).toContain("leading-relaxed");
  });

  it("açık bantlar sırayla beyaz/fildişi dönüşür (koyu bant sayılmaz)", () => {
    const html = render([
      section({ heading: { tr: "B1" }, items: [item(1), item(2)] }),
      section({ heading: { tr: "B2" }, items: [item(1), item(2), item(3)] }),
      section({ heading: { tr: "B3" }, items: [item(1), item(2), item(3), item(4)] }),
    ]);
    const parts = html.split(/(?=<section)/);
    const duoBand = parts.find((p) => p.includes("B1")) ?? "";
    const featBand = parts.find((p) => p.includes("B2")) ?? "";
    const quadBand = parts.find((p) => p.includes("B3")) ?? "";
    expect(duoBand).toContain("bg-navy");
    expect(featBand).toContain("bg-white");
    expect(quadBand).not.toContain("bg-white");
  });

  it("1 madde → showcase: tam kanat foto + navy scrim, metin üstte beyaz", () => {
    const html = render([
      section({ items: [item(1)], image: { ref: REF, alt: { tr: "Klinik" } } }),
    ]);
    expect(html).toContain("relative overflow-hidden");
    expect(html).toContain("from-navy via-navy/85 to-navy/55");
    expect(html).toContain("text-white/80");
  });

  it("showcase fotosuz: düz navy bant olarak düşer", () => {
    const html = render([section({ items: [item(1)] })]);
    expect(html).toContain("from-navy to-navy");
    expect(html).not.toContain("via-navy/85");
  });

  it("başlıksız yarım CMS girişi akışa girmez", () => {
    const html = render([
      section({ heading: undefined, items: [item(1)] }),
      section({ items: [] }),
    ]);
    expect(html).not.toContain("Madde 1");
  });

  it("fotosuz bölüm figure basmaz", () => {
    const html = render([section({ items: [item(1), item(2), item(3)] })]);
    expect(html).not.toContain("<figure");
  });
});
