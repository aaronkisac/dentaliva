import { site as com } from "../sites/com";
import type { SiteConfig } from "./config-types";

const registry: Record<string, SiteConfig> = { com };

export function availableSiteIds(): string[] {
  return Object.keys(registry);
}

/**
 * Resolves the active site. Runs at build time: an unknown SITE_ID fails the
 * build loudly instead of silently deploying the wrong domain (PGT-1 AC).
 */
export function getSite(id: string = process.env.SITE_ID ?? "com"): SiteConfig {
  const site = registry[id];
  if (!site) {
    throw new Error(`Unknown SITE_ID "${id}". Available sites: ${availableSiteIds().join(", ")}`);
  }
  return site;
}

export const site = getSite();
