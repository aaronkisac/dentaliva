import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { HowItWorksSection } from "../components/sections/how-it-works";
import type { HowItWorksStep } from "../src/content/home";

const render = (steps: HowItWorksStep[], props?: { eyebrow?: string; heading?: string }) =>
  renderToStaticMarkup(
    <HowItWorksSection steps={steps} eyebrow={props?.eyebrow} heading={props?.heading} />,
  );

describe("HowItWorksSection (DSN-64)", () => {
  it("renders nothing without titled steps (empty section never ships)", () => {
    expect(render([])).toBe("");
    expect(render([{ text: { tr: "başlıksız" } }])).toBe("");
  });

  it("renders numbered steps with the heading block", () => {
    const html = render(
      [
        { title: { tr: "Hedeflerinizi paylaşın" }, text: { tr: "Kısa metin" } },
        { title: { tr: "Ön değerlendirme alın" } },
      ],
      { eyebrow: "Dentaliva", heading: "Adım adım yolculuğunuz" },
    );
    expect(html).toContain("01");
    expect(html).toContain("Hedeflerinizi paylaşın");
    expect(html).toContain("Kısa metin");
    expect(html).toContain("Adım adım yolculuğunuz");
    expect(html).toContain("02");
    expect(html).toContain("Ön değerlendirme alın");
  });

  it("caps the timeline at six steps", () => {
    const steps = Array.from({ length: 8 }, (_, i) => ({ title: { tr: `Adım ${i + 1}` } }));
    const html = render(steps);
    expect(html).toContain("Adım 6");
    expect(html).not.toContain("Adım 7");
  });
});
