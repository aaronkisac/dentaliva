"use client";

import { useEffect, useRef, useState } from "react";

import type { GalleryImage } from "../src/content/home";

/**
 * Native <dialog>-based lightbox: Esc closes it, focus moves into the dialog
 * and returns to the opener (built into <dialog>.showModal/close).
 */
export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active === null) {
      dialog?.close();
      return;
    }
    if (dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const items = images.filter((image) => image.asset?._ref);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((image, index) => (
          <button
            key={image.asset?._ref ?? index}
            type="button"
            onClick={() => setActive(index)}
            className="aspect-square bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`Görsel ${index + 1} — büyüt`}
          >
            <span className="sr-only">{image.alt?.tr}</span>
          </button>
        ))}
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
            <div className="flex aspect-[4/3] w-[80vw] max-w-3xl items-center justify-center bg-navy">
              <span className="font-serif text-2xl text-gold-soft">
                {items[active].alt?.tr ?? "Görsel"}
              </span>
            </div>
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
