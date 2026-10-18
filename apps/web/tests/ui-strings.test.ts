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
    expect(ui("exploreServicesCta")).toBe("Explore our services");
    expect(ui("patientVideoAlt")).toBe("Patient video");
  });
});
