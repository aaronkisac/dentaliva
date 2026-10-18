"use client";

import { site } from "../src/config";
import { uiString } from "../src/ui-strings";
/**
 * DSN-33: root-layout seviyesi hata sınırı — layout yerine geçtiği için
 * kendi html/body'sini tanımlar ve token stylesheet'i YÜKLENEMEZ; buradaki
 * inline renkler token hex'lerinin belgelenmiş tek istisnasıdır.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[app] global error:", error);
  return (
    <html lang={site.defaultLocale}>
      <body
        style={{
          margin: 0,
          backgroundColor: "#faf9f6",
          color: "#2b2620",
          fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "96px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "48px",
              margin: 0,
            }}
          >
            {uiString("errorTitle")}
          </h1>
          <p style={{ margin: 0 }}>{uiString("errorBody")}</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "8px",
              border: "1px solid #c09a55",
              background: "transparent",
              color: "#1c1610",
              padding: "12px 24px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            {uiString("errorRetry")}
          </button>
        </main>
      </body>
    </html>
  );
}
