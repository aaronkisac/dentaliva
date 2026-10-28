"use client";

import dynamic from "next/dynamic";

/**
 * DSN-63: CallbackForm'u dinamik import'la yükler. Form (react-hook-form +
 * zod + resolver ≈ 100KB gzip) ana sayfaya girince ilk yükleme JS'i
 * 205KB bütçesini 306KB'ye aşmıştı — bu köprü chunk'ı HTML script
 * etiketlerinin dışında tutar; form hidrasyon sonrası, bölüm görünürken
 * yüklenir. /iletisim sayfası statik import'ta kalır (orada ilk yükleme
 * zaten form içindir).
 */
const CallbackForm = dynamic(() => import("./CallbackForm").then((m) => m.CallbackForm), {
  loading: () => (
    <div
      aria-hidden="true"
      className="space-y-5 font-sans"
      // İskelet: form kartının yer tutuşu — CLS'yi önleyen sabit yükseklik.
    >
      <div className="h-12 rounded-[4px] bg-ivory-2" />
      <div className="h-12 rounded-[4px] bg-ivory-2" />
      <div className="h-12 rounded-[4px] bg-ivory-2" />
      <div className="h-12 rounded-[4px] bg-ivory-2" />
    </div>
  ),
});

export function ReviewFormLoader({ variant = "full" }: { variant?: "full" | "compact" }) {
  return <CallbackForm variant={variant} />;
}
