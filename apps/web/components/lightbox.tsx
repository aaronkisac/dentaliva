"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import type { GalleryImage } from "../src/content/home";
import { imageTarget } from "../src/image-target";

const ENV = imageTarget();

const TABS = [
  { id: "klinik", label: "Klinik" },
  { id: "onceSonra", label: "Önce / Sonra" },
] as const;

type GalleryTab = (typeof TABS)[number]["id"];

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
}: {
  images: GalleryImage[];
  onceSonra?: GalleryImage[];
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

  return (
    <>
      {after.length > 0 ? (
        <div role="group" aria-label="Galeri filtresi" className="mb-6 flex flex-wrap gap-2">
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
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((image, index) => {
          const ref = image.asset?._ref as string;
          const dims = refDimensions(ref) ?? { width: 800, height: 800 };
          return (
            <button
              key={ref}
              type="button"
              onClick={() => setActive(index)}
              className="aspect-square bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`Görsel ${index + 1} — büyüt`}
            >
              <Image
                src={ref}
                alt={pickLocalized(image.alt) || `Galeri görseli ${index + 1}`}
                width={dims.width}
                height={dims.height}
                sizes="(max-width: 768px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL={image.lqip ?? lqipUrl(ref, ENV)}
                className="h-auto w-full object-cover"
              />
            </button>
          );
        })}
      </div>
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
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-4 font-sans text-sm font-semibold uppercase tracking-widest text-navy hover:text-gold-deep"
            >
              Kapat
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
