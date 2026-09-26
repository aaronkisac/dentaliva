import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-first: the site exports to `out/` and is served by Cloudflare
  // Workers with static assets (ADR-001). ADR-006: images load via the
  // custom Sanity CDN loader (see src/image-loader.ts).
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/image-loader.ts",
  },
};

export default nextConfig;
