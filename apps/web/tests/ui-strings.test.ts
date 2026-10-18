import { afterEach, describe, expect, it, vi } from "vitest";

import { uiString } from "../src/ui-strings";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_ID;
  vi.resetModules();
});

describe("uiString chrome tables (INT-3)", () => {
  it("serves the exact legacy TR strings on the com site", () => {
    // com's rendered chrome must not shift — these mirror the strings that
    // used to be hardcoded in layout/error/carousels.
    expect(uiString("skipLabel")).toBe("İçeriğe atla");
    expect(uiString("skipAnchor")).toBe("icerik");
    expect(uiString("bookCta")).toBe("Randevu Al");
    expect(uiString("errorTitle")).toBe("Bir sorun oluştu");
    expect(uiString("servicesTitle")).toBe("Hizmetlerimiz");
    expect(uiString("prevDoctors")).toBe("Önceki hekimler");
    expect(uiString("doctorSlideAria")(2)).toBe("2. hekim");
    expect(uiString("lightboxImageAria")(3)).toBe("Görsel 3 — büyüt");
    expect(uiString("googleBadge")).toBe("Google Değerlendirmeleri · 5,0");
  });

  it("serves EN strings when the site is eu", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "eu";
    vi.resetModules();
    const { uiString: ui } = await import("../src/ui-strings");
    expect(ui("skipLabel")).toBe("Skip to content");
    expect(ui("skipAnchor")).toBe("content");
    expect(ui("bookCta")).toBe("Book an Appointment");
    expect(ui("errorTitle")).toBe("Something went wrong");
    expect(ui("servicesTitle")).toBe("Services");
    expect(ui("legalTitle")).toBe("Privacy Policy");
    expect(ui("doctorSlideAria")(2)).toBe("Doctor 2");
    expect(ui("googleBadge")).toBe("Google Reviews · 5.0");
  });

  it("keeps tr and en tables shape-compatible (same keys and call signatures)", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "eu";
    vi.resetModules();
    const { uiString: ui } = await import("../src/ui-strings");
    for (const key of [
      "gallerySrSummary",
      "galleryFirstAltSr",
      "doctorsLive",
      "doctorSlideAria",
      "serviceSlideAria",
      "lightboxImageAria",
      "galleryImageAria",
    ] as const) {
      expect(typeof ui(key)).toBe("function");
    }
  });
});
