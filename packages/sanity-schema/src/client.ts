import { createClient } from "@sanity/client";

import type { LocalizedValue } from "./validation";

export type { LocalizedValue };

export interface SanityEnv {
  projectId: string;
  dataset: string;
  token?: string;
  /** API content date — pin to a version for stable query behavior. */
  apiVersion?: string;
}

/** Defaults for local dev; production values come from env per deployment. */
export function defaultEnv(): SanityEnv {
  return {
    projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
    dataset: process.env.SANITY_DATASET ?? "production",
    apiVersion: process.env.SANITY_API_VERSION ?? "2025-01-01",
  };
}

/**
 * Anonymous read client for public datasets (free-plan datasets are public —
 * ADR-002). No token must ever be embedded for production reads.
 */
export function createReadClient(env: Partial<SanityEnv> = {}) {
  const resolved = { ...defaultEnv(), ...env };
  // Empty string counts as "no token": per-project builds (INT-8) blank the
  // variable instead of leaking one project's token into another project's
  // read (tokens are project-scoped).
  const token = resolved.token ?? (process.env.SANITY_READ_TOKEN || undefined);
  return createClient({
    projectId: resolved.projectId,
    dataset: resolved.dataset,
    apiVersion: resolved.apiVersion,
    // Anonymous reads may use the CDN; token reads go to the origin for freshness.
    useCdn: !token,
    token,
  });
}

/** Extracts the Turkish (default) or English value from a localized field. */
export function pickLocalized(
  value: LocalizedValue | null | undefined,
  locale: "tr" | "en" = "tr",
): string {
  if (locale === "en") return value?.en ?? value?.tr ?? "";
  return value?.tr ?? "";
}
