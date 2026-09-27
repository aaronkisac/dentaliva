/**
 * Brand typography (DSN-2): files are vendored in `public/fonts/` and wired
 * through @font-face in `globals.css` — no build-time Google Fonts request,
 * no next/font Turbopack dependency (CPT-2 staging preview: the local
 * Turbopack font cache became unrecoverable and blocked every build).
 *
 * The class below defines the same CSS variables next/font used to emit, so
 * token references (`--dvn-font-cormorant` / `--dvn-font-montserrat`) are
 * untouched. Preload lives in `app/layout.tsx` (display: optional, PRF-3).
 */
export const fontVariables = "dvn-fonts";
