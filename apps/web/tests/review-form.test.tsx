import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ReviewFormSection } from "../components/sections/review-form";

const render = (
  data: { steps?: Array<{ tr?: string }> } | null,
  props?: { heading?: string; eyebrow?: string },
) =>
  renderToStaticMarkup(
    <ReviewFormSection data={data} heading={props?.heading} eyebrow={props?.eyebrow} />,
  );

describe("ReviewFormSection (DSN-63)", () => {
  it("renders nothing when the CMS field is unset (empty section never ships)", () => {
    expect(render(null)).toBe("");
  });

  it("anchors the section at #review for the hero CTA and renders the form", () => {
    const html = render({ steps: [{ tr: "Adım bir" }] }, { heading: "Başlık" });
    expect(html).toContain('id="review"');
    expect(html).toContain("Adım bir");
    expect(html).toContain("Başlık");
    // Form alanları (CallbackForm SSR çıktısı).
    expect(html).toContain('id="cb-name"');
    expect(html).toContain('id="cb-interest"');
    expect(html).toContain('id="cb-contact"');
  });

  it("caps the step list at three entries", () => {
    const html = render({
      steps: [{ tr: "Bir" }, { tr: "İki" }, { tr: "Üç" }, { tr: "Dört" }],
    });
    expect(html).toContain("Bir");
    expect(html).toContain("Üç");
    expect(html).not.toContain("Dört");
  });
});
