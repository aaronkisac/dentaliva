import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-first: the site exports to `out/` and is served by Cloudflare
  // Workers with static assets (ADR-001). Image optimization via the default
  // loader is unavailable under static export; a Sanity CDN loaderFile
  // replaces it in a later story (ADR-006).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
