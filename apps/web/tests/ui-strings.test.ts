import { afterEach, describe, expect, it, vi } from "vitest";

import { uiString } from "../src/ui-strings";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_ID;
  vi.resetModules();
});

describe("uiString client tables (INT-3)", () => {
  it("serves the exact legacy TR strings on the com site", () => {
    // com's rendered chrome must not shift — these mirror the strings that
    // used to be hardcoded in error boundaries and the client sections.
    expect(uiString("bookCta")).toBe("Randevu Al");
    expect(uiString("errorTitle")).toBe("Bir sorun oluştu");
    expect(uiString("errorBody")).toBe("Sayfa yüklenirken beklenmeyen bir hata oluştu.");
    expect(uiString("errorRetry")).toBe("Tekrar dene");
    expect(uiString("prevDoctors")).toBe("Önceki hekimler");
    expect(uiString("googleBadge")).toBe("Google Değerlendirmeleri · 5,0");
    // call every function entry (coverage + interpolation regressions)
    expect(uiString("doctorsLive")("Dr. Örnek", 1, 19)).toBe("Öne çıkan: Dr. Örnek (1/19)");
    expect(uiString("serviceSlideAria")(7)).toBe("7. hizmet");
    expect(uiString("lightboxImageAria")(2)).toBe("Görsel 2 — büyüt");
    expect(uiString("galleryImageAria")(5)).toBe("5. görsel");
    expect(uiString("doctorSlideAria")(4)).toBe("4. hekim");
  });

  it("serves EN strings when the site is eu", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "eu";
    vi.resetModules();
    const { uiString: ui } = await import("../src/ui-strings");
    expect(ui("bookCta")).toBe("Book an Appointment");
    expect(ui("errorTitle")).toBe("Something went wrong");
    expect(ui("googleBadge")).toBe("Google Reviews · 5.0");
    expect(ui("doctorSlideAria")(4)).toBe("Doctor 4");
    expect(ui("lightboxImageAria")(2)).toBe("Image 2 — enlarge");
    expect(ui("galleryImageAria")(5)).toBe("Image 5");
    expect(ui("exploreServicesCta")).toBe("Explore our treatments");
    expect(ui("patientVideoAlt")).toBe("Patient video");
    expect(ui("doctorsLive")("Dr. Example", 1, 19)).toBe("Featured: Dr. Example (1/19)");
    expect(ui("serviceSlideAria")(7)).toBe("Service 7");
  });
});

describe("uiString nl table (NL-1)", () => {
  it("serves Dutch strings when the site is nl", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "nl";
    vi.resetModules();
    const { uiString: ui } = await import("../src/ui-strings");
    expect(ui("bookCta")).toBe("Afspraak maken");
    expect(ui("errorTitle")).toBe("Er is iets misgegaan");
    expect(ui("doctorSlideAria")(2)).toBe("Tandarts 2");
    expect(ui("googleBadge")).toBe("Google Reviews · 5,0");
    expect(ui("consentLabel")).toContain("privacybeleid");
    // call every nl function entry (coverage + interpolation regressions)
    expect(ui("doctorsLive")("Dr. Voorbeeld", 1, 19)).toBe("Uitgelicht: Dr. Voorbeeld (1/19)");
    expect(ui("serviceSlideAria")(7)).toBe("Behandeling 7");
    expect(ui("lightboxImageAria")(2)).toBe("Afbeelding 2 — vergroot");
    expect(ui("galleryImageAria")(5)).toBe("Afbeelding 5");
    expect(ui("exploreServicesCta")).toBe("Ontdek onze behandelingen");
    expect(ui("patientVideoAlt")).toBe("Patiëntvideo");
  });
});
