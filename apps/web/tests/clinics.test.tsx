import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ClinicsSection } from "../components/sections/clinics";
import type { BranchItem } from "../src/content/branches";

const render = (
  branches: BranchItem[],
  props?: { eyebrow?: string; heading?: string; intro?: string },
) =>
  renderToStaticMarkup(
    <ClinicsSection
      branches={branches}
      eyebrow={props?.eyebrow}
      heading={props?.heading}
      intro={props?.intro}
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
});
