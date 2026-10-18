import { afterEach, describe, expect, it, vi } from "vitest";

import { pageString } from "../src/page-strings";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_ID;
  vi.resetModules();
});

describe("pageString server tables (INT-3)", () => {
  it("serves the exact legacy TR strings on the com site", () => {
    expect(pageString("skipLabel")).toBe("İçeriğe atla");
    expect(pageString("skipAnchor")).toBe("icerik");
    expect(pageString("servicesTitle")).toBe("Hizmetlerimiz");
    expect(pageString("legalTitle")).toBe("KVKK Aydınlatma Metni");
    expect(pageString("toggleMenu")).toBe("Menüyü aç/kapat");
    // call every function entry (coverage + interpolation regressions)
    expect(pageString("gallerySrSummary")(12)).toBe(
      "Galeri: 12 görsel, büyütmek için görsel seçin.",
    );
    expect(pageString("galleryFirstAltSr")("Klinik içi")).toBe("İlk görsel açıklaması: Klinik içi");
  });

  it("serves EN strings when the site is eu", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "eu";
    vi.resetModules();
    const { pageString: p } = await import("../src/page-strings");
    expect(p("skipLabel")).toBe("Skip to content");
    expect(p("skipAnchor")).toBe("content");
    expect(p("servicesTitle")).toBe("Services");
    expect(p("legalTitle")).toBe("Privacy Policy");
    expect(p("homeTitle")).toBe("Dentaliva Dental Clinic | Istanbul");
    expect(p("gallerySrSummary")(12)).toBe("Gallery: 12 images, select one to enlarge.");
    expect(p("galleryFirstAltSr")("Clinic interior")).toBe(
      "First image description: Clinic interior",
    );
    expect(p("seedPlaceholder")).toContain("This content is not ready yet.");
  });
});
