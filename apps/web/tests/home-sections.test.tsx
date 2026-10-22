import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import type { HomeSectionId } from "../src/config-types";
import type { HomeData } from "../src/content/home";
import { HomeSections } from "../components/sections/compose";

const emptyData: HomeData = {
  homePage: null,
  quickServices: [],
  doctors: [],
  faqs: [],
  testimonials: [],
  siteSettings: null,
  siteCopy: null,
};

describe("HomeSections hidden filtering (DSN-56)", () => {
  const order: HomeSectionId[] = ["hero", "ticker", "cta"];
  const markers = (homePage: HomeData["homePage"]) =>
    renderToStaticMarkup(<HomeSections data={{ ...emptyData, homePage }} order={order} />)
      .match(/data-section="[^"]+"/g)
      ?.join(" ");

  it("renders every section in config order when nothing is hidden", () => {
    const all = 'data-section="hero" data-section="ticker" data-section="cta"';
    expect(markers(null)).toBe(all);
    expect(markers({ hiddenSections: [] })).toBe(all);
  });

  it("drops sections listed in hiddenSections and keeps the rest", () => {
    expect(markers({ hiddenSections: ["ticker"] })).toBe('data-section="hero" data-section="cta"');
    expect(markers({ hiddenSections: ["ticker", "cta"] })).toBe('data-section="hero"');
  });
});
