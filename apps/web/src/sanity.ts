import { createReadClient } from "@dentaliva/sanity-schema/client";

import { site } from "./config";

/** Build-time read client bound to the active site's Sanity target. */
export const readClient = createReadClient({
  projectId: site.sanity.projectId,
  // Dataset (unlike projectId) may be overridden per build: the eu staging
  // deploy targets the site's private staging dataset. ProjectId stays
  // registry-only so no build can cross projects (INT-1).
  dataset: process.env.SANITY_DATASET ?? site.sanity.dataset,
});
