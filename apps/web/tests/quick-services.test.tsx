import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// TreatmentCard hero görselini next/image ile basar — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { QuickServicesSection } from "../components/sections/quick-services";
import type { QuickServiceItem } from "../src/content/home";

const items: QuickServiceItem[] = [
  { name: { tr: "İmplant" }, slug: "implant", summary: { tr: "Özet." } },
  { name: { tr: "Ortodonti" }, slug: "ortodonti", summary: { tr: "Özet." } },
];

const render = (props: Parameters<typeof QuickServicesSection>[0]) =>
  renderToStaticMarkup(<QuickServicesSection {...props} />);

describe("QuickServicesSection (DSN-45)", () => {
  it("renders nothing without items", () => {
    expect(render({ items: [], heading: "Hizmetlerimiz" })).toBe("");
  });

  it("renders the grid without heading or button when copy is absent", () => {
    const html = render({ items });
    expect(html).toContain("İmplant");
    expect(html).toContain("Ortodonti");
    expect(html).not.toContain("<h2");
    expect(html).not.toContain('href="/hizmetlerimiz"');
  });

  it("renders the CMS eyebrow, heading and the all-services button", () => {
    const html = render({
      items,
      eyebrow: "Dentaliva",
      heading: "Hizmetlerimiz",
      ctaLabel: "Tüm Hizmetlerimiz",
    });
    expect(html).toContain("Dentaliva");
    expect(html).toContain("<h2");
    expect(html).toContain("Hizmetlerimiz");
    expect(html).toContain("Tüm Hizmetlerimiz");
    expect(html).toContain('href="/hizmetlerimiz"');
  });

  it("hides the eyebrow and button independently", () => {
    const html = render({ items, heading: "Hizmetlerimiz" });
    expect(html).toContain("<h2");
    expect(html).not.toContain("text-xs uppercase");
    expect(html).not.toContain('href="/hizmetlerimiz"');
  });
});
