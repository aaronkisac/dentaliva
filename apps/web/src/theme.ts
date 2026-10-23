/**
 * DSN-57 palette switching core — a server-safe module (no client directive)
 * so the pure helpers stay unit-testable and the inline script string renders
 * from the server layout. The palette registry itself lives in
 * @dentaliva/tokens (single source of design values).
 */
import { defaultPaletteId, paletteIds, type PaletteId } from "@dentaliva/tokens";

export const PALETTE_STORAGE_KEY = "dvn-palette";

const nonDefaultPaletteIds = paletteIds.filter((id) => id !== defaultPaletteId);

/** Stored raw value → known palette id; null when unset or unknown. */
export function resolveStoredPalette(raw: string | null | undefined): PaletteId | null {
  return raw != null && (paletteIds as string[]).includes(raw) ? (raw as PaletteId) : null;
}

/** Applies the palette to the document element, then persists the choice.
    Attribute first: storage-less contexts (private mode) still switch live. */
export function applyPalette(id: PaletteId): void {
  try {
    if (id === defaultPaletteId) {
      delete document.documentElement.dataset.palette;
    } else {
      document.documentElement.dataset.palette = id;
    }
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // storage yazamayan ortamlar: oturum-içi attribute değişimi yeterli
  }
}

/**
 * Inline pre-paint script: re-applies the stored palette before first paint
 * so a reload never flashes the default identity. Runs before hydration and
 * must stay dependency-free; the allowlist of non-default ids is frozen in
 * at import time and asserted against the token registry in tests.
 */
export const palettePrepaintScript =
  `(function(){try{var p=localStorage.getItem("${PALETTE_STORAGE_KEY}");` +
  `if(!p||[${nonDefaultPaletteIds.map((id) => `"${id}"`).join(",")}].indexOf(p)<0)return;` +
  `document.documentElement.setAttribute("data-palette",p)}catch(e){}})()`;
