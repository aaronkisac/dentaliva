import { describe, expect, it } from "vitest";

// prune-routes.mjs is a postbuild script; the segment math it performs is
// duplicated here (the script is plain ESM, importable, but side-effectful
// at import — so the invariants are pinned instead).
import { getSite } from "../src/config";

function inactiveSegments(
  allSites: Array<{ id: string; routes: Record<string, string> }>,
  activeId: string,
) {
  const active = allSites.find((s) => s.id === activeId);
  if (!active) throw new Error(`unknown site ${activeId}`);
  const all = new Set(allSites.flatMap((s) => Object.values(s.routes)));
  const activeSet = new Set(Object.values(active.routes));
  return [...all].filter((segment) => segment !== "/" && !activeSet.has(segment));
}

describe("prune-routes segment math (INT-6)", () => {
  const sites = [
    { id: "com", routes: { ...getSite("com").routes } },
    { id: "eu", routes: { ...getSite("eu").routes } },
  ];

  it("removes every eu segment from the com export", () => {
    expect(inactiveSegments(sites, "com")).toEqual(
      expect.arrayContaining([
        "/about",
        "/services",
        "/doctors",
        "/branches",
        "/contact",
        "/gallery",
        "/privacy",
      ]),
    );
  });

  it("removes every tr segment from the eu export", () => {
    expect(inactiveSegments(sites, "eu")).toEqual(
      expect.arrayContaining([
        "/hakkimizda",
        "/hizmetlerimiz",
        "/hekimlerimiz",
        "/subelerimiz",
        "/iletisim",
        "/fotograf-galerisi",
        "/kvkk",
      ]),
    );
  });

  it("keeps the shared blog segment active on both sites", () => {
    expect(inactiveSegments(sites, "com")).not.toContain("/blog");
    expect(inactiveSegments(sites, "eu")).not.toContain("/blog");
  });

  it("never prunes an active site's own segments", () => {
    for (const site of sites) {
      for (const segment of Object.values(site.routes)) {
        expect(inactiveSegments(sites, site.id)).not.toContain(segment);
      }
    }
  });
});
