import type { MetadataRoute } from "next";

import { site } from "../sites/com";

// Static export: robots.txt must be fully prerenderable.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}
