import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — sızdırmaz ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: {
    src?: string;
    alt?: string;
    style?: Record<string, string>;
  }) {
    return <img src={props.src} alt={props.alt} data-style={JSON.stringify(props.style ?? {})} />;
  },
}));

import { BeforeAfterSlider, clampPercent } from "../components/before-after-slider";

const render = (props: Parameters<typeof BeforeAfterSlider>[0]) =>
  renderToStaticMarkup(<BeforeAfterSlider {...props} />);

const media = {
  before: { ref: "image-before-1448x1086-png", alt: "Önce", lqip: "data:image/jpeg;base64,b" },
  after: { ref: "image-after-1448x1086-png", alt: "Sonra", lqip: "data:image/jpeg;base64,a" },
};

describe("clampPercent (DSN-50)", () => {
  it("clamps to the 0-100 range", () => {
    expect(clampPercent(-10)).toBe(0);
    expect(clampPercent(50)).toBe(50);
    expect(clampPercent(140)).toBe(100);
  });

  it("falls back to the centered default for NaN", () => {
    expect(clampPercent(Number.NaN)).toBe(50);
  });
});

describe("BeforeAfterSlider (DSN-50)", () => {
  it("renders both images with the before one clipped to the left half", () => {
    const html = render({ ...media, label: "Diş Beyazlatma" });
    expect(html).toContain('src="image-before-1448x1086-png"');
    expect(html).toContain('src="image-after-1448x1086-png"');
    expect(html).toContain("inset(0 50% 0 0)");
    expect(html).toContain('alt="Önce"');
    expect(html).toContain('alt="Sonra"');
  });

  it("exposes an APG slider with keyboard access and the CMS label", () => {
    const html = render({ ...media, label: "Diş Beyazlatma önce/sonra" });
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-label="Diş Beyazlatma önce/sonra"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('aria-valuenow="50"');
    expect(html).toContain('tabindex="0"');
  });

  it("renders the CMS badges when provided", () => {
    const html = render({ ...media, label: "x", beforeLabel: "Önce", afterLabel: "Sonra" });
    expect(html).toContain("Önce");
    expect(html).toContain("Sonra");
  });

  it("omits the badges without copy", () => {
    const html = render({ ...media, label: "x" });
    expect(html).not.toContain("uppercase tracking-widest text-white");
  });
});
