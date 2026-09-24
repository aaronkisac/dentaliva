import { defineCliConfig } from "sanity/cli";

// Mirrors sanity.config.ts — env-driven per domain (ADR-002).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "dentaliva";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
});
