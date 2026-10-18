import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { classifyUrl } from "../src/classify";
import { treatmentToSanity } from "../src/transform";

import { extractPage } from "../src/extract";

import { isAllowed, isSitemapIndex, parseDisallowedPaths, parseLocs } from "../src/sitemap";

const fixtureDir = fileURLToPath(new URL("./fixtures/", import.meta.url));

describe("URL classification", () => {
  const cases: Array<[string, ReturnType<typeof classifyUrl>]> = [
    ["https://www.dentaliva.com/", "core"],
    ["https://www.dentaliva.com/hakkimizda/", "core"],
    ["https://www.dentaliva.com/implant-tedavisi/", "treatment"],
    ["https://www.dentaliva.com/gulus-estetigi/", "treatment"],
    ["https://www.dentaliva.com/dr-dt-emel-ozdemir/", "doctor"],
    ["https://www.dentaliva.com/dt-kadir-demir/", "doctor"],
    ["https://www.dentaliva.com/avcilar/", "branch"],
    ["https://www.dentaliva.com/kvkk/", "legal"],
    ["https://www.dentaliva.com/blog/en-iyi-dis-dolgusu-cesitleri/", "blog"],
    ["https://www.dentaliva.com/blog/category/current-articles/", "ignored"],
    ["https://www.dentaliva.com/blog/author/admin/", "ignored"],
    ["https://www.dentaliva.com/etkinlik-kayit/", "treatment"],
    ["https://www.dentaliva.com/tr/kurumsal/", "ignored"],
  ];
  it.each(cases)("classifies %s as %s", (url, expected) => {
    expect(classifyUrl(new URL(url).pathname)).toBe(expected);
  });
});

describe("sitemap parsing", () => {
  const xml = readFileSync(`${fixtureDir}sitemap-index.xml`, "utf8");
  it("detects sitemap index", () => {
    expect(isSitemapIndex(xml)).toBe(true);
  });
  it("extracts <loc> entries", () => {
    expect(parseLocs(xml)).toHaveLength(2);
    expect(parseLocs(xml)[0]).toContain("page-sitemap.xml");
  });
});

describe("robots.txt", () => {
  const robots = readFileSync(`${fixtureDir}robots.txt`, "utf8");
  const disallowed = parseDisallowedPaths(robots);
  it("collects star-agent disallow rules", () => {
    expect(disallowed).toContain("/wp-admin/");
    expect(disallowed).toContain("/blog/category/");
  });
  it("blocks disallowed and allows content pages", () => {
    expect(isAllowed("/blog/category/x/", disallowed)).toBe(false);
    expect(isAllowed("/blog/yazi/", disallowed)).toBe(true);
    expect(isAllowed("/implant-tedavisi/", disallowed)).toBe(true);
  });
});

describe("page extraction", () => {
  const html = readFileSync(`${fixtureDir}treatment.html`, "utf8");
  const page = extractPage(html);
  it("extracts title and h1", () => {
    expect(page.title).toContain("İmplant Tedavisi");
    expect(page.h1).toBe("İmplant Tedavisi");
  });
  it("extracts paragraphs and headings", () => {
    expect(page.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(page.paragraphs.some((p) => p.startsWith("## "))).toBe(true);
  });

  // CPT-1: nav/footer chrome outside <main> must never leak into content.
  it("excludes navigation and footer junk outside main", () => {
    const all = page.paragraphs.join("\n");
    expect(all).not.toContain("Hakkımızda İnsan Kaynakları");
    expect(all).not.toContain("Tüm hakları saklıdır");
    expect(all).not.toContain("Dentaliva Studio");
  });

  it("produces typed blocks with h2/h3 markers", () => {
    expect(page.blocks?.some((b) => b.type === "li")).toBe(true);
    expect(page.blocks?.filter((b) => b.type === "h3")).toHaveLength(2);
    expect(page.paragraphs.some((p) => p.startsWith("### "))).toBe(true);
  });
});

describe("parseLocs edge cases", () => {
  it("filters empty loc entries", () => {
    expect(parseLocs("<loc></loc><loc>https://x.com/a</loc>")).toEqual(["https://x.com/a"]);
  });
});

describe("eu source support (INT-10)", () => {
  it("classifies eu English slugs", () => {
    expect(classifyUrl("/", "eu")).toBe("core");
    expect(classifyUrl("/about-us/", "eu")).toBe("core");
    expect(classifyUrl("/our-experts/", "eu")).toBe("core");
    expect(classifyUrl("/our-services/", "eu")).toBe("core");
    expect(classifyUrl("/contact/", "eu")).toBe("core");
    expect(classifyUrl("/branches/", "eu")).toBe("core");
    expect(classifyUrl("/avcilar/", "eu")).toBe("branch");
    expect(classifyUrl("/dr-dt-emel-ozdemir/", "eu")).toBe("doctor");
    expect(classifyUrl("/dental-implant/", "eu")).toBe("treatment");
    expect(classifyUrl("/blog/all-on-6-in-turkey-all-on-six-in-turkey/", "eu")).toBe("blog");
    expect(classifyUrl("/blog/category/services-pages/", "eu")).toBe("ignored");
  });

  it("keeps the com classification intact (tr slugs)", () => {
    expect(classifyUrl("/hakkimizda/")).toBe("core");
    expect(classifyUrl("/hizmetlerimiz/implant-tedavisi/", "com")).toBe("ignored");
    expect(classifyUrl("/implant-tedavisi/", "com")).toBe("treatment");
  });

  it("fills the en slot when transforming with locale=en", () => {
    const doc = treatmentToSanity(
      {
        url: "https://www.dentaliva.eu/dental-implant/",
        title: "Dental Implant | Dentaliva",
        h1: "Dental Implant",
        paragraphs: [
          "Implants replace missing teeth with titanium roots.",
          "## The Procedure",
          "Placement happens in structured stages.",
        ],
      },
      "en",
    );
    expect(doc._id).toBe("treatment.dental-implant");
    expect(doc.name).toEqual({ en: "Dental Implant" });
    expect(doc.summary).toEqual({ en: "Implants replace missing teeth with titanium roots." });
  });
});
