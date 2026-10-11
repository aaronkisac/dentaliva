"use client";

import { useTrackCarousel } from "./use-track-carousel";

function ArrowButton({
  direction,
  label,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        {direction === "left" ? (
          <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
        ) : (
          <path d="M5 12h14m0 0-6-6m6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

/**
 * DSN-54: standart carousel iskeleti — TÜM carousel'ler aynı düzende:
 * oklar sağ üstte (header slot'unun sağına hizalı), track, altta noktalar.
 * Kart içerikleri SERVER'da render edilip children olarak geçilir (client JS
 * yalnız kaydırma + nokta mantığı — DSN-52 perf dersi). header verilmezse
 * oklar track üzerinde overlay olarak çıkar (galeri sekmeleri gibi özel
 * başlık satırı olan yüzeyler header'ı kendisi kurar).
 */
export function CarouselTrack({
  count,
  ariaLabelPrefix,
  children,
  className,
  tone = "light",
  header,
  headerClassName,
  trackClassName,
}: {
  count: number;
  /** Nokta/ok aria etiketi öneki: "yorum" -> "3. yorum", "Önceki yorum". */
  ariaLabelPrefix: string;
  children: React.ReactNode;
  className?: string;
  /** Başlık bloğu (eyebrow/başlık/rozet vb.) — oklar bu bloğun sağına gelir. */
  header?: React.ReactNode;
  headerClassName?: string;
  /** Track'e ek sınıf (bölüm üst/alt boşlukları buradan verilir). */
  trackClassName?: string;
  /** Nokta renkleri: light (açık zemin, varsayılan) | dark (espresso zemin). */
  tone?: "light" | "dark";
}) {
  const { trackRef, index, maxIndex, goTo, syncFromScroll, markUserScroll } =
    useTrackCarousel(count);
  const dark = tone === "dark";

  const arrows = (
    <div className="hidden gap-2 md:flex">
      <ArrowButton
        direction="left"
        label={`Önceki ${ariaLabelPrefix}`}
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
      />
      <ArrowButton
        direction="right"
        label={`Sonraki ${ariaLabelPrefix}`}
        onClick={() => goTo(index + 1)}
        disabled={index >= maxIndex}
      />
    </div>
  );

  return (
    <>
      {header ? (
        <div className={headerClassName ?? "grid gap-6 md:grid-cols-[1fr_auto] md:items-end"}>
          {header}
          {arrows}
        </div>
      ) : null}
      <div className="relative">
        {header ? null : (
          <div className="absolute right-0 top-0 z-[var(--dvn-z-raised)] hidden gap-2 md:flex">
            {arrows}
          </div>
        )}
        <div
          ref={trackRef}
          onScroll={syncFromScroll}
          onPointerDown={markUserScroll}
          onWheel={markUserScroll}
          className={
            "-mx-[var(--dvn-container-gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
            (className ?? "") +
            " " +
            (trackClassName ?? "")
          }
        >
          {children}
        </div>
      </div>
      {count > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}. ${ariaLabelPrefix}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(Math.min(i, maxIndex))}
              className="p-1.5"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i === index
                    ? "bg-gold"
                    : dark
                      ? "bg-white/25 hover:bg-white/50"
                      : "bg-ink/20 hover:bg-ink/40"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
