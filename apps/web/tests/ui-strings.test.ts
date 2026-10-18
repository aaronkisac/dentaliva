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
    // Call every function entry so both tables' bodies stay covered and
    // runtime regressions (typos, bad interpolation) fail loudly.
    expect(ui("gallerySrSummary")(12)).toBe("Gallery: 12 images, select one to enlarge.");
    expect(ui("galleryFirstAltSr")("Clinic interior")).toBe(
      "First image description: Clinic interior",
    );
    expect(ui("doctorsLive")("Dr. Example", 1, 19)).toBe("Featured: Dr. Example (1/19)");
    expect(ui("doctorSlideAria")(4)).toBe("Doctor 4");
    expect(ui("serviceSlideAria")(7)).toBe("Service 7");
    expect(ui("lightboxImageAria")(2)).toBe("Image 2 — enlarge");
    expect(ui("galleryImageAria")(5)).toBe("Image 5");
    expect(uiString("gallerySrSummary")(12)).toBe("Galeri: 12 görsel, büyütmek için görsel seçin.");
    expect(uiString("galleryFirstAltSr")("Klinik içi")).toBe("İlk görsel açıklaması: Klinik içi");
    expect(uiString("doctorsLive")("Dr. Örnek", 1, 19)).toBe("Öne çıkan: Dr. Örnek (1/19)");
    expect(uiString("serviceSlideAria")(7)).toBe("7. hizmet");
    expect(uiString("lightboxImageAria")(2)).toBe("Görsel 2 — büyüt");
    expect(uiString("galleryImageAria")(5)).toBe("5. görsel");
  });
});
