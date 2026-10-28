import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { ReviewFormSection } from "../components/sections/review-form";

const render = (data: { steps?: { tr?: string }[]; note?: { tr?: string } } | null) =>
  renderToStaticMarkup(<ReviewFormSection data={data} eyebrow="Dönüşüm" heading="İlk adım" />);

describe("ReviewFormSection (DSN-63/79)", () => {
  it("renders nothing without data", () => {
    expect(render(null)).toBe("");
  });

  it("renders numbered steps and keeps the form skeleton", () => {
    const html = render({ steps: [{ tr: "İsteğinizi yazın." }, { tr: "Size döneriz." }] });
    expect(html).toContain("İsteğinizi yazın.");
    expect(html).toContain("Size döneriz.");
    expect(html).not.toContain("koordinatör");
  });

  it("renders the coordinator note when set (DSN-79 doc #06 body copy)", () => {
    const html = render({
      steps: [{ tr: "İsteğinizi yazın." }],
      note: { tr: "Hasta koordinatörünüz fotoğraf hazırlığında yardımcı olur." },
    });
    expect(html).toContain("koordinatörünüz");
  });
});
