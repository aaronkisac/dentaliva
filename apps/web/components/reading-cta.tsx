import { Link } from "@dentaliva/ui";

import { routes } from "../src/routes";

/**
 * DSN-70: uzun tedavi gövdelerinin ortasındaki dönüşüm molası — altın
 * çerçeveli beyaz kart (fiyat notu kartı dili), solda CMS metni, sağda
 * randevu butonu + telefon. Metin/buton copy'siz ise karşılığı render
 * edilmez (sıfır-hardcoded-copy); kart hiçbir parçası yoksa hiç çizilmez.
 */
export function ReadingCta({
  text,
  phone,
  actionLabel,
}: {
  text?: string;
  phone?: string;
  actionLabel?: string;
}) {
  if (!text && !actionLabel && !phone) return null;
  return (
    <aside className="my-10 flex flex-wrap items-center justify-between gap-5 rounded-[4px] border border-[var(--dvn-line-gold)] bg-white p-6 shadow-[var(--dvn-shadow-soft)] sm:p-7">
      {text ? (
        <p className="max-w-sm font-sans text-[15px] leading-relaxed text-ink">{text}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        {actionLabel ? (
          <Link
            href={routes.contact}
            className="inline-flex items-center justify-center bg-gold px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-colors duration-300 hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {actionLabel}
          </Link>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="font-sans text-base font-medium text-navy underline-offset-4 hover:text-gold-deep hover:underline"
          >
            {phone}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
