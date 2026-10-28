"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { t } from "../src/i18n";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import type { GalleryImage, LocalizedPair } from "../src/content/home";
import { imageTarget } from "../src/image-target";
import { LightboxStage } from "./lightbox";
import { uiString } from "../src/ui-strings";

const ENV = imageTarget();

interface BranchPhoto {
  ref?: string;
  alt?: LocalizedPair;
  lqip?: string;
}

/**
 * DSN-72: şube satırındaki mini foto galeri — 1 fotoğrafta tek kare,
 * 2-3'te mosaic (ilk kare geniş), tıklanan fotoğraf lightbox'ta açılır
 * (LightboxStage: oklar + sayaç + caption, Esc/dialog native).
 * Galeri boşsa server fallback tek fotoğrafı düz basar (bu bileşen
 * çağrılmaz).
 */
export function BranchGallery({
  name,
  photos,
  closeLabel,
}: {
  name?: string;
  photos: BranchPhoto[];
  closeLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const items = photos.filter((photo) => photo.ref);
  const visible = items.slice(0, 3);
  // LightboxStage GalleryImage biçimi bekler (asset._ref) — uyarla.
  const lightboxItems: GalleryImage[] = items.map((photo) => ({
    asset: { _ref: photo.ref },
    alt: photo.alt,
    lqip: photo.lqip,
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (active === null) {
      dialog?.close();
      return;
    }
    if (dialog && !dialog.open) dialog.showModal();
  }, [active]);

  const navigate = (delta: number) => {
    setActive((current) =>
      current === null ? current : Math.min(items.length - 1, Math.max(0, current + delta)),
    );
  };

  if (items.length === 0) return null;

  const tile = (photo: BranchPhoto, index: number, className: string) => {
    const ref = photo.ref as string;
    const dims = refDimensions(ref) ?? { width: 800, height: 600 };
    return (
      <button
        key={ref}
        type="button"
        onClick={() => setActive(index)}
        aria-label={uiString("lightboxImageAria")(index + 1)}
        className={
          "group/tile relative overflow-hidden rounded-[4px] bg-ivory-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
          className
        }
      >
        <Image
          src={ref}
          alt={t(photo.alt) || name || ""}
          width={dims.width}
          height={dims.height}
          sizes="(max-width: 768px) 50vw, 260px"
          placeholder={photo.lqip ? "blur" : "empty"}
          blurDataURL={photo.lqip ?? lqipUrl(ref, ENV)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/tile:scale-[1.05] motion-reduce:transition-none motion-reduce:transform-none"
        />
      </button>
    );
  };

  return (
    <>
      <div
        className={"grid gap-2 " + (visible.length === 1 ? "grid-cols-1" : "grid-cols-2")}
      >
        {visible.length === 1 && visible[0] ? (
          tile(visible[0], 0, "aspect-[4/3]")
        ) : (
          visible.map((photo, index) =>
            tile(
              photo,
              index,
              index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square",
            ),
          )
        )}
      </div>
      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setActive(null);
          if (event.key === "ArrowLeft") navigate(-1);
          if (event.key === "ArrowRight") navigate(1);
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
          if (Math.abs(delta) > 48) navigate(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
        className="backdrop:bg-navy/90 bg-transparent p-0 text-ivory"
        aria-label={name ?? uiString("galleryImageAlt")}
      >
        {active !== null && lightboxItems[active] ? (
          <LightboxStage
            items={lightboxItems}
            active={active}
            closeLabel={closeLabel}
            onClose={() => setActive(null)}
            onNavigate={navigate}
          />
        ) : null}
      </dialog>
    </>
  );
}
