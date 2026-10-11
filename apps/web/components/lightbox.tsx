"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import type { GalleryImage } from "../src/content/home";
import { imageTarget } from "../src/image-target";
import { useTrackCarousel } from "./use-track-carousel";

const ENV = imageTarget();

const TABS = [
  { id: "klinik", label: "Klinik" },
  { id: "onceSonra", label: "Önce / Sonra" },
] as const;

type GalleryTab = (typeof TABS)[number]["id"];

/** DSN-51: önce/sonra kümesi 3'ü aşınca o sekme carousel, aksi halde grid. */
export function galleryMode(onceSonraCount: number, tab: GalleryTab): "carousel" | "grid" {
  return tab === "onceSonra" && onceSonraCount > 3 ? "carousel" : "grid";
}

/**
 * Native <dialog>-based lightbox: Esc closes it, focus moves into the dialog
 * and returns to the opener (built into <dialog>.showModal/close).
 * DSN-29: önce/sonra görseli (hasta izinli) CMS'e girince "Klinik /
 * Önce-Sonra" sekme filtresi otomatik görünür; veri yoksa galeri tek grid
 * olarak çizilir (boş bölüm render edilmez).
 */
export function GalleryLightbox({
  images,
  onceSonra,
  closeLabel,
}: {
  images: GalleryImage[];
  onceSonra?: GalleryImage[];
  /** DSN-44: kapat düğmesi metni siteCopy'den — copy'siz düğme render edilmez
      (klavye kullanıcısı için Esc zaten native dialog davranışı). */
  closeLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [tab, setTab] = useState<GalleryTab>("klinik");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active === null) {
      dialog?.close();
      return;
    }
    if (dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const klinik = images.filter((image) => image.asset?._ref);
  const after = (onceSonra ?? []).filter((image) => image.asset?._ref);
  const items = after.length > 0 ? (tab === "klinik" ? klinik : after) : klinik;
  // DSN-51: önce/sonra kümesi 3'ü aşarsa o sekme 3'lü carousel'e dönüşür;
  // 3 ve altında statik satır kalır.
  const afterCarousel = galleryMode(after.length, tab) === "carousel";
  const carousel = useTrackCarousel(afterCarousel ? after.length : 0);

  const galleryCard = (image: GalleryImage, index: number) => {
    const ref = image.asset?._ref as string;
    const dims = refDimensions(ref) ?? { width: 800, height: 800 };
    return (
      <button
        key={ref}
        type="button"
        onClick={() => setActive(index)}
        className={
          "aspect-square bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" +
          (afterCarousel ? " dvn-carousel-card shrink-0 snap-start" : "")
        }
        aria-label={`Görsel ${index + 1} — büyüt`}
      >
        <Image
          src={ref}
          alt={pickLocalized(image.alt) || `Galeri görseli ${index + 1}`}
          width={dims.width}
          height={dims.height}
          sizes={afterCarousel ? "(max-width: 640px) 82vw, 33vw" : "(max-width: 768px) 50vw, 25vw"}
          placeholder="blur"
          blurDataURL={image.lqip ?? lqipUrl(ref, ENV)}
          className="h-auto w-full object-cover"
        />
      </button>
    );
  };

  return (
    <>
      {after.length > 0 ? (
        /* DSN-54: standart düzen — sekmeler solda, oklar sağ üstte. */
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Galeri filtresi" className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setActive(null);
                }}
                className={
                  "px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                  (tab === t.id
                    ? "bg-navy text-white"
                    : "border border-[var(--dvn-line-gold)] text-navy hover:bg-navy hover:text-white")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          {afterCarousel ? (
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                aria-label="Önceki görseller"
                onClick={() => carousel.goTo(carousel.index - 1)}
                disabled={carousel.index === 0}
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
                  <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Sonraki görseller"
                onClick={() => carousel.goTo(carousel.index + 1)}
                disabled={carousel.index >= carousel.maxIndex}
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
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      {afterCarousel ? (
        <>
          <div
            ref={carousel.trackRef}
            onScroll={carousel.syncFromScroll}
            onPointerDown={carousel.markUserScroll}
            onWheel={carousel.markUserScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {after.map((image, index) => galleryCard(image, index))}
          </div>
          {after.length > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
              {after.map((image, i) => (
                <button
                  key={image.asset?._ref ?? i}
                  type="button"
                  aria-label={`${i + 1}. görsel`}
                  aria-current={carousel.index === i ? "true" : undefined}
                  onClick={() => carousel.goTo(Math.min(i, carousel.maxIndex))}
                  className="p-1.5"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                      carousel.index === i ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((image, index) => galleryCard(image, index))}
        </div>
      )}
      {/* Native dialog covers keyboard (Esc) — the click handler only closes
          on backdrop taps, which keyboard users reach via the Kapat button. */}
      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
        // Esc is native to <dialog>; this mirrors it for lint and a11y clarity.
        onKeyDown={(event) => {
          if (event.key === "Escape") setActive(null);
        }}
        className="backdrop:bg-navy/80"
        aria-label="Galeri görseli"
      >
        {active !== null && items[active] ? (
          <div className="p-4">
            {(() => {
              const ref = items[active].asset?._ref as string;
              const dims = refDimensions(ref) ?? { width: 1600, height: 1200 };
              return (
                <Image
                  src={ref}
                  alt={pickLocalized(items[active].alt) || "Büyük görsel"}
                  width={dims.width}
                  height={dims.height}
                  sizes="80vw"
                  placeholder="blur"
                  blurDataURL={items[active].lqip ?? lqipUrl(ref, ENV)}
                  className="h-auto max-h-[80vh] w-[80vw] max-w-3xl border border-[var(--dvn-line-gold)] object-contain"
                />
              );
            })()}
            {closeLabel ? (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-4 font-sans text-sm font-semibold uppercase tracking-widest text-navy hover:text-gold-deep"
              >
                {closeLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
