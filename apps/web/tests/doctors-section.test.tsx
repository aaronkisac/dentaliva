import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { DoctorsSection } from "../components/sections/doctors";
import type { DoctorItem } from "../src/content/home";

const doctors: DoctorItem[] = Array.from({ length: 6 }, (_, i) => ({
  name: `Dr. Dt. Hekim ${i + 1}`,
  slug: `hekim-${i + 1}`,
  title: { tr: "Diş Hekimi" },
}));

const render = (items: DoctorItem[], team?: Parameters<typeof DoctorsSection>[0]["team"]) =>
  renderToStaticMarkup(<DoctorsSection items={items} team={team ?? null} />);

describe("DoctorsSection (DSN-84)", () => {
  it("renders nothing without doctors (empty section never ships)", () => {
    expect(render([])).toBe("");
  });

  it("shows the first four doctors as profile links when no curation exists", () => {
    const html = render(doctors);
    expect(html).toContain('href="/hekimlerimiz/hekim-1"');
    expect(html).toContain("Dr. Dt. Hekim 4");
    expect(html).not.toContain("Hekim 5");
    expect(html).not.toContain("Hekim 6");
  });

  it("prefers the curated team selection over the list order", () => {
    const html = render(doctors, {
      doctors: [doctors[4]!, doctors[2]!],
      ctaLabel: { tr: "Ekibimizle Tanışın" },
    });
    expect(html).toContain("Hekim 5");
    expect(html).toContain("Hekim 3");
    expect(html).not.toContain("Hekim 1");
  });

  it("renders the team CTA only when CMS copy exists (zero-hardcoded-copy)", () => {
    expect(render(doctors, { ctaLabel: { tr: "Ekibimizle Tanışın" } })).toContain(
      'href="/hekimlerimiz"',
    );
    expect(render(doctors)).not.toContain("Ekibimizle Tanışın");
  });

  it("keeps the heading block data-gated from teamSection copy", () => {
    const html = render(doctors, { eyebrow: { tr: "Uzmanlık" }, heading: { tr: "Ekibimiz" } });
    expect(html).toContain("Uzmanlık");
    expect(html).toContain("Ekibimiz");
  });
});
