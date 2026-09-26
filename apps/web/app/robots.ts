import type { MetadataRoute } from "next";

// Static export: robots.txt must be fully prerenderable.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://www.dentaliva.com/sitemap.xml`,
  };
}
