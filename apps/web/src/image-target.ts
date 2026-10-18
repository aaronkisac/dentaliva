import { site } from "./config";

/**
 * Sanity CDN hedefi (ADR-006). Tek otorite site registry'sidir: SITE_ID=eu
 * build'inde bayat bir .env değeri görselleri yanlış projeye yönlendirmesin
 * diye bilinçli olarak env override YOK (ADR-004 çoklu-site doğruluğu).
 */
export function imageTarget(): { projectId: string; dataset: string } {
  return {
    projectId: site.sanity.projectId,
    dataset: site.sanity.dataset,
  };
}
