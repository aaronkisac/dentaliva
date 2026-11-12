// DSN-91: mobilde yığılan kart ızgaraları css-only swipe carousel'e döner —
// snap track + kart sınıfları + sm:/md: üstünde grid geri dönüşü assert edilir.
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// Görsel basan bölümler next/image'i sızdırmaz ikameyle değiştirilir.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string }) {
    return <img src={props.src} alt={props.alt} />;
  },
}));

import { TreatmentPathsSection } from "../components/sections/treatment-paths";
import { HowItWorksSection } from "../components/sections/how-it-works";
import { ClinicsSection } from "../components/sections/clinics";
import { DoctorsSection } from "../components/sections/doctors";
import { AftercareSection } from "../components/sections/travel-aftercare";
import { VideoTestimonialsSection } from "../components/sections/testimonials";

const TRACK = "snap-x snap-mandatory";
const CARD = "snap-start";

describe("mobile card carousels (DSN-91)", () => {
  it("treatmentPaths: snap track + peek kart, sm üstünde grid geri döner", () => {
    const html = renderToStaticMarkup(
      <TreatmentPathsSection
        items={[{ headline: { tr: "Kart" }, treatment: { slug: "implant-tedavisi" } }]}
      />,
    );
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("w-[82%]");
    expect(html).toContain("sm:w-auto");
    expect(html).toContain("sm:grid-cols-2");
    expect(html).toContain("lg:grid-cols-4");
  });

  it("howItWorks: adımlar snap kart, sm grid korunur", () => {
    const html = renderToStaticMarkup(<HowItWorksSection steps={[{ title: { tr: "Adım" } }]} />);
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("sm:grid-cols-2");
    expect(html).toContain("xl:grid-cols-6");
  });

  it("clinics: şube kartları snap, md grid korunur", () => {
    const html = renderToStaticMarkup(
      <ClinicsSection branches={[{ name: "Avcılar", slug: "avcilar" }]} />,
    );
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("md:grid-cols-3");
  });

  it("doctors: hekim kartları snap, sm grid korunur", () => {
    const html = renderToStaticMarkup(
      <DoctorsSection items={[{ name: "Dr. Dt. Test", slug: "test" }]} />,
    );
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("sm:grid-cols-2");
    expect(html).toContain("lg:grid-cols-4");
  });

  it("aftercare: kartlar snap, md grid korunur", () => {
    const html = renderToStaticMarkup(
      <AftercareSection data={{ normal: [{ tr: "Şişlik" }] }} normalTitle="Normal" />,
    );
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("md:grid-cols-2");
  });

  it("videoTestimonials: video kartları snap, md grid korunur", () => {
    const html = renderToStaticMarkup(
      <VideoTestimonialsSection items={[{ youtubeId: "abc123", author: "Hasta" }]} />,
    );
    expect(html).toContain(TRACK);
    expect(html).toContain(CARD);
    expect(html).toContain("md:grid-cols-3");
  });
});
