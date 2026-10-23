import { describe, expect, it } from "vitest";

import { site } from "../src/config";
import type { SiteCopy } from "../src/content/site-copy";
import { buildHeaderItems } from "../src/header-items";

const trMenu: SiteCopy["navMenu"] = [
  {
    heading: { tr: "İmplant Tedavisi" },
    headingPage: { name: { tr: "İmplant Tedavisi" }, slug: "implant-tedavisi" },
    treatments: [
      { name: { tr: "All On Four Implant" }, slug: "all-on-four" },
      { name: { tr: "Bozuk referans" }, slug: "" },
      null,
    ],
  },
  {
    heading: { tr: "Diş Estetiği" },
    treatments: [{ name: { tr: "Diş Beyazlatma" }, slug: "dis-beyazlatma" }],
  },
  { treatments: [{ name: { tr: "Ortodonti" }, slug: "ortodonti" }] },
];

describe("buildHeaderItems (gruplu Tedaviler menüsü)", () => {
  it("returns the nav untouched when siteCopy is missing", () => {
    const items = buildHeaderItems(site, null);
    expect(items).toEqual(site.nav);
    expect(items.find((item) => item.href === "/hizmetlerimiz")?.menu).toBeUndefined();
  });

  it("attaches the grouped menu to the treatments item only", () => {
    const items = buildHeaderItems(site, { navMenu: trMenu });
    const treatments = items.find((item) => item.href === "/hizmetlerimiz");
    expect(treatments?.menu?.groups).toHaveLength(3);
    expect(treatments?.menu?.groups[0]?.heading).toBe("İmplant Tedavisi");
    expect(treatments?.menu?.groups[0]?.headingHref).toBe("/hizmetlerimiz/implant-tedavisi");
    expect(treatments?.menu?.groups[0]?.links).toEqual([
      { label: "All On Four Implant", href: "/hizmetlerimiz/all-on-four" },
    ]);
    // Başlıksız grup korunur; slugsuz referanslar düşer.
    expect(treatments?.menu?.groups[2]?.links).toEqual([
      { label: "Ortodonti", href: "/hizmetlerimiz/ortodonti" },
    ]);
    // Diğer nav öğelerine menü eklenmez.
    expect(items.find((item) => item.href === "/hakkimizda")?.menu).toBeUndefined();
  });

  it("drops fully empty groups and skips the menu when no groups remain", () => {
    expect(
      buildHeaderItems(site, { navMenu: [{ treatments: [{ slug: "" }] }] }).find(
        (item) => item.href === "/hizmetlerimiz",
      )?.menu,
    ).toBeUndefined();
    const headingOnly = buildHeaderItems(site, {
      navMenu: [{ heading: { tr: "Boş" }, treatments: [] }],
    }).find((item) => item.href === "/hizmetlerimiz");
    expect(headingOnly?.menu?.groups).toEqual([
      { heading: "Boş", headingHref: undefined, links: [] },
    ]);
  });

  it("adds the all-treatments link from siteCopy.ui.menuAllLink", () => {
    const withAll = buildHeaderItems(site, {
      navMenu: trMenu,
      ui: { menuAllLink: { tr: "Tüm Tedavilerimiz" } },
    }).find((item) => item.href === "/hizmetlerimiz");
    expect(withAll?.menu?.all).toEqual({ label: "Tüm Tedavilerimiz", href: "/hizmetlerimiz" });

    const withoutAll = buildHeaderItems(site, { navMenu: trMenu }).find(
      (item) => item.href === "/hizmetlerimiz",
    );
    expect(withoutAll?.menu?.all).toBeUndefined();
  });
});
