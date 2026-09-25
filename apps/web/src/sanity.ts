import { createReadClient } from "@dentaliva/sanity-schema/client";

import { site } from "./config";

/** Build-time read client bound to the active site's Sanity target. */
export const readClient = createReadClient({
  projectId: site.sanity.projectId,
  dataset: site.sanity.dataset,
});
