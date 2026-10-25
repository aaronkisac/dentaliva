import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { TrustStripSection } from "../components/sections/trust-strip";
import type { TrustStripData } from "../src/content/home";

const render = (data: TrustStripData | null) =>
  renderToStaticMarkup(<TrustStripSection data={data} />);

describe("TrustStripSection (DSN-61)", () => {
  it("renders nothing without data (empty section never ships)", () => {
    expect(render(null)).toBe("");
    expect(render({})).toBe("");
  });

  it("renders the Google rating cell and up to three indicator cells", () => {
    const html = render({
      rating: { tr: "5,0" },
      ratingLabel: { tr: "Google Değerlendirmeleri" },
      items: [
        { value: "300+", label: { tr: "Gerçek Vaka" } },
        { value: "6", label: { tr: "Hasta Videosu" } },
        { value: "13+", label: { tr: "Yıllık Deneyim" } },
        { value: "19", label: { tr: "Uzman Hekim" } },
      ],
    });
    expect(html).toContain("5,0");
    expect(html).toContain("Google Değerlendirmeleri");
    expect(html).toContain("300+");
    expect(html).toContain("Gerçek Vaka");
    // max(3) — dördüncü gösterge basılmaz.
    expect(html).not.toContain("Uzman Hekim");
  });

  it("drops indicator cells without a value but keeps the rating", () => {
    const html = render({
      rating: { tr: "5,0" },
      ratingLabel: { tr: "Google Değerlendirmeleri" },
      items: [{ label: { tr: "Değersiz" } }],
    });
    expect(html).toContain("5,0");
    expect(html).not.toContain("Değersiz");
  });
});
