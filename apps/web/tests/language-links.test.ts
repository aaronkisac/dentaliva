import { describe, expect, it } from "vitest";

import { buildLanguageLinks } from "../src/language-links";

/**
 * DSN-97: header dil toggle verisi. Orijinal sitedeki bayrak sırasının
 * karşılığı — TR bayrağı com'u, GB bayrağı eu'yu, NL bayrağı nl'yi temsil
 * eder; her bayrak o dilin served adresine gider.
 */
describe("buildLanguageLinks (DSN-97)", () => {
  const links = buildLanguageLinks();

  it("lists all three sister sites in the original flag order with autonyms", () => {
    expect(links.map((l) => l.flag)).toEqual(["tr", "gb", "nl"]);
    expect(links.map((l) => l.label)).toEqual(["Türkçe", "English", "Nederlands"]);
  });

  it("links to each site's served URL (workers.dev until custom-domain DNS)", () => {
    expect(links.map((l) => l.url)).toEqual([
      "https://dentaliva-com.dentaliva.workers.dev",
      "https://dentaliva-eu.dentaliva.workers.dev",
      "https://dentaliva-nl.dentaliva.workers.dev",
    ]);
  });

  it("marks exactly the active site's language (default SITE_ID=com → tr)", () => {
    const active = links.filter((l) => l.active);
    expect(active).toHaveLength(1);
    expect(active[0]?.flag).toBe("tr");
    expect(active[0]?.url).toBe("https://dentaliva-com.dentaliva.workers.dev");
  });
});
