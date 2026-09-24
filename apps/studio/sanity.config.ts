import { defineConfig } from "sanity";

// One Studio codebase, deployed per domain via env (ADR-002/ARCHITECTURE §4).
// Fallbacks keep `sanity build` green in CI before real projects exist (SAN-6).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "dentaliva";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
  name: "dentaliva",
  title: "Dentaliva Studio",
  projectId,
  dataset,
  plugins: [],
  schema: {
    types: [],
  },
});
