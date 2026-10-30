import globals from "globals";

import react from "@dentaliva/config/eslint/react";

// Lightbox: native <dialog> handles Esc; backdrop-click close is pointer-only
// by design and the Kapat button is the keyboard path.
export default [
  ...react,
  {
    // DSN-84: v1 ana sayfa arşivi — derlenmiş statik build çıktısı (minified
    // chunk'lar), kaynak kod değil; lint dışında tutulur.
    ignores: ["v1-homepage-snapshot/**"],
  },
  {
    files: ["scripts/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },
  {
    files: ["components/lightbox.tsx", "components/branch-gallery.tsx"],
    rules: {
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
    },
  },
];
