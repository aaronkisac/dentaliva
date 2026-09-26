/** Parses <loc> entries from sitemap/sitemap-index XML. */
export function parseLocs(xml: string): string[] {
  return xml
    .split("<loc>")
    .slice(1)
    .map((chunk) => chunk.slice(0, chunk.indexOf("</loc>")).trim())
    .filter((loc) => loc.length > 0);
}

export function isSitemapIndex(xml: string): boolean {
  return xml.includes("<sitemapindex");
}

/** Robots.txt rules for User-agent: * — returns paths that are disallowed. */
export function parseDisallowedPaths(robotsTxt: string): string[] {
  const disallow: string[] = [];
  let inStar = false;
  for (const line of robotsTxt.split("\n")) {
    const clean = line.trim();
    if (clean.toLowerCase().startsWith("user-agent:")) {
      inStar = clean.split(":")[1]?.trim() === "*";
      continue;
    }
    if (inStar && clean.toLowerCase().startsWith("disallow:")) {
      const path = clean.slice("disallow:".length).trim();
      if (path) disallow.push(path);
    }
  }
  return disallow;
}

export function isAllowed(pathname: string, disallowed: string[]): boolean {
  return !disallowed.some((rule) => pathname.startsWith(rule) || pathname.includes(rule));
}
