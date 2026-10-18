import { site as com } from "../sites/com";
import { site as eu } from "../sites/eu";
import { site as nl } from "../sites/nl";
import type { SiteConfig } from "./config-types";

const registry: Record<string, SiteConfig> = { com, eu, nl };

export function availableSiteIds(): string[] {
  return Object.keys(registry);
}

/**
 * Resolves the active site. Runs at build time: an unknown SITE_ID fails the
 * build loudly instead of silently deploying the wrong domain (PGT-1 AC).
 */
export function getSite(
  // NEXT_PUBLIC_ is inlined into the client bundle (error boundaries, carousels
  // resolve strings at runtime); SITE_ID stays the server/build-time alias.
  id: string = process.env.NEXT_PUBLIC_SITE_ID ?? process.env.SITE_ID ?? "com",
): SiteConfig {
  const site = registry[id];
  if (!site) {
    throw new Error(`Unknown SITE_ID "${id}". Available sites: ${availableSiteIds().join(", ")}`);
  }
  return site;
}

export const site = getSite();
