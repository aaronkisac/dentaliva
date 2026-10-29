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

const priceSection: TreatmentSection = {
  heading: { tr: "Fiyatlar" },
  lead: { tr: "Fiyatlar birden fazla etkenle belirlenir." },
};

const sections: TreatmentSection[] = [
  {
    heading: { tr: "Periodontoloji Bölümü Neye Bakar?" },
    lead: { tr: "Bölüm birçok farklı sorunla ilgilenir." },
    items: [
      { title: { tr: "Gingivitis (Diş Eti İltihabı)" }, text: { tr: "Diş eti iltihabı..." } },
      { title: { tr: "Gingival Hiperplazi" }, text: { tr: "Diş eti büyümesi..." } },
    ],
    image: { ref: REF, lqip: "data:image/webp;base64,AAA", alt: { tr: "Klinik" } },
  },
  priceSection,
  // Başlıksız yarım giriş akışa girmemeli.
  { lead: { tr: "başlıksız bölüm" } },
];

const render = (props: { sections: TreatmentSection[] }) =>
  renderToStaticMarkup(<TreatmentSections {...props} />);

describe("TreatmentSections (DSN-83)", () => {
  it("renders headings, lead, numbered items and the section photo", () => {
    const html = render({ sections });
    expect(html).toContain("Periodontoloji Bölümü Neye Bakar?");
    expect(html).toContain("birçok farklı sorunla");
    expect(html).toContain("Gingivitis (Diş Eti İltihabı)");
    // Numaralı sayaçlar (DSN-52 motifi) ve ayraçlı satır listesi.
    expect(html).toContain(">01<");
    expect(html).toContain("divide-y");
    expect(html).toContain(`src="${REF}"`);
    expect(html).toContain('alt="Klinik"');
  });

  it("drops sections without a heading (half-entered CMS rows)", () => {
    const html = render({ sections });
    expect(html).toContain("Fiyatlar");
    expect(html).not.toContain("başlıksız bölüm");
  });

  it("alternates photo side and band background per section index", () => {
    const html = render({ sections });
    // İlk bölüm: foto sağda (metin col-span-7 önde), beyaz bant.
    expect(html).toContain("bg-white");
    expect(html).toContain("lg:order-2 lg:col-span-7");
    // İkinci bölüm (foto yok): dönüşümlü taraf sınıfı almaz.
    const second = html.split("Fiyatlar")[1] ?? "";
    expect(second).not.toContain("lg:order-2");
  });

  it("renders a text-only section without a figure", () => {
    const html = render({ sections: [priceSection] });
    expect(html).toContain("Fiyatlar");
    expect(html).not.toContain("<figure");
  });
});
