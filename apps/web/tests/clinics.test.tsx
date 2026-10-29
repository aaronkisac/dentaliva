import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ClinicsSection } from "../components/sections/clinics";
import type { BranchItem } from "../src/content/branches";

const render = (
  branches: BranchItem[],
  props?: { eyebrow?: string; heading?: string; intro?: string; detailLabel?: string },
) =>
  renderToStaticMarkup(
    <ClinicsSection
      branches={branches}
      eyebrow={props?.eyebrow}
      heading={props?.heading}
      intro={props?.intro}
      detailLabel={props?.detailLabel}
    />,
  );

const branches: BranchItem[] = [
  { name: "Avcılar", slug: "avcilar", address: { tr: "Adres bir" } },
  { name: "Başakşehir", slug: "basaksehir", address: { tr: "Adres iki" } },
  { name: "Altunizade", slug: "altunizade", address: { tr: "Adres üç" } },
];

describe("ClinicsSection (DSN-67)", () => {
  it("renders nothing without branches", () => {
    expect(render([])).toBe("");
  });

  it("renders up to three branch cards linking to branch detail pages", () => {
    const html = render([...branches, { name: "Dördüncü", slug: "dorduncu" }], {
      eyebrow: "İstanbul",
      heading: "Üç klinik, tek standart",
      intro: "Bakım altyapınız.",
    });
    expect(html).toContain("Avcılar");
    expect(html).toContain("Altunizade");
    expect(html).toContain('href="/subelerimiz/avcilar"');
    expect(html).toContain("Üç klinik, tek standart");
    // max 3 kart — dördüncü basılmaz.
    expect(html).not.toContain("Dördüncü");
  });

  it("renders a linkless article when the slug is missing", () => {
    const html = render([{ name: "Slugsuz" }]);
    expect(html).toContain("Slugsuz");
    expect(html).toContain("<article");
    expect(html).not.toContain('href="/subelerimiz/');
  });

  // DSN-84: DentalX dolu lokasyon kartı — adres/telefon/saat satırları +
  // siteCopy'den detay bağlantısı.
  it("renders contact rows and the detail link when data and copy exist", () => {
    const html = render(
      [
        {
          name: "Avcılar",
          slug: "avcilar",
          address: { tr: "Adres bir" },
          phone: "+90 530 840 54 82",
          hours: { tr: "Pzt–Cmt 09:00–19:00" },
        },
      ],
      { detailLabel: "Şube Detayı" },
    );
    expect(html).toContain("Adres bir");
    expect(html).toContain("+90 530 840 54 82");
    expect(html).toContain("Pzt–Cmt 09:00–19:00");
    expect(html).toContain("Şube Detayı");
  });

  it("omits the detail link without copy (zero-hardcoded-copy)", () => {
    const html = render([{ name: "Avcılar", slug: "avcilar" }]);
    expect(html).not.toContain("Şube Detayı");
  });
});
