import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { DecisionModulesSection } from "../components/sections/decision-modules";
import type { DecisionModule } from "../src/content/home";

const render = (modules: DecisionModule[]) =>
  renderToStaticMarkup(<DecisionModulesSection modules={modules} />);

const implant: DecisionModule = {
  eyebrow: { tr: "İmplant" },
  heading: { tr: "Eksik dişlerinizi tamamlanın" },
  body: { tr: "Modül metni" },
  options: [
    { title: { tr: "Tek diş" }, treatment: { slug: "implant-tedavisi" } },
    { title: { tr: "Köprü" }, treatment: { slug: "protez-dis-tedavisi" } },
    { title: { tr: "Tam çene" }, treatment: { slug: "all-on-four" } },
  ],
  ctaTreatment: { slug: "implant-tedavisi" },
};

describe("DecisionModulesSection (DSN-65)", () => {
  it("renders nothing without modules (empty section never ships)", () => {
    expect(render([])).toBe("");
    expect(render([{ body: { tr: "başlıksız" } }])).toBe("");
  });

  it("renders a module with option links and the module CTA", () => {
    const html = render([implant]);
    expect(html).toContain("Eksik dişlerinizi tamamlanın");
    expect(html).toContain('href="/hizmetlerimiz/implant-tedavisi"');
    expect(html).toContain('href="/hizmetlerimiz/all-on-four"');
    expect(html).toContain("01");
    expect(html).toContain("Seçenekleri keşfedin");
  });

  it("renders linkless options when the treatment reference is missing", () => {
    const html = render([
      { ...implant, options: [{ title: { tr: "Başlıksız ref" } }], ctaTreatment: null },
    ]);
    expect(html).toContain("Başlıksız ref");
    expect(html).not.toContain('href="/hizmetlerimiz/');
  });

  it("caps option cards at three per module", () => {
    const four = {
      ...implant,
      options: [1, 2, 3, 4].map((i) => ({ title: { tr: `Seçenek ${i}` } })),
    };
    const html = render([four]);
    expect(html).toContain("Seçenek 3");
    expect(html).not.toContain("Seçenek 4");
  });
});
