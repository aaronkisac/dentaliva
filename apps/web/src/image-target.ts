import { site } from "./config";

/**
 * Görsel URL üretimi için Sanity CDN hedefi (ADR-006). Kaynak: site registry,
 * env override ile — ikinci bir domain, bu kliniğin projesine sessizce
 * düşmez (ADR-004; eski 6 ayrı `?? "86x2hbzv"` fallback'inin yerine geçer).
 */
export function imageTarget(): { projectId: string; dataset: string } {
  return {
    projectId: process.env.SANITY_PROJECT_ID ?? site.sanity.projectId,
    dataset: process.env.SANITY_DATASET ?? site.sanity.dataset,
  };
}
