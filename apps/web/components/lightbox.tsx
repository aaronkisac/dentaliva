"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { t } from "../src/i18n";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import type { GalleryImage } from "../src/content/home";
import { imageTarget } from "../src/image-target";
import { useTrackCarousel } from "./use-track-carousel";
import { uiString } from "../src/ui-strings";

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
 * DSN-68: küratörlü mosaic ritmi — hangi görselin "fetih" (2×2) kare
 * olacağını söyler. 5'lik küme ana sayfa desenidir (fetih + 4 kare, iki
 * sıra — Aaron'ın sadeleştirme kararı); 6+ küme (galeri sayfası
 * kulliyatı) her 7. görselde fetih karesi kurar; daha küçük kümelerde
 * ritim kurulamaz, düz grid kalır.
 */
export function mosaicSpan(index: number, total: number): "feature" | null {
  if (total === 5) return index === 0 ? "feature" : null;
  if (total < 6) return null;
  return index % 7 === 0 ? "feature" : null;
}

const spanClasses: Record<"feature", string> = {
  // Mobilde (2 kolon) fetih karesi tam satır: yükseklik aspect'ten,
  // md+ boyunca kapladığı grid satırlarından gelir.
  feature: "col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2",
};

/**
 * Native <dialog>-based lightbox: Esc closes it, focus moves into the dialog
 * and returns to the opener (built into <dialog>.showModal/close).
 * DSN-29: önce/sonra görseli (hasta izinli) CMS'e girince "Klinik /
 * Önce-Sonra" sekme filtresi otomatik görünür; veri yoksa galeri tek grid
 * olarak çizilir (boş bölüm render edilmez).
 * DSN-68: grid küratörlü mosaic'e döndü (fetih kareleri + hover caption);
 * lightbox sahneleşti — ok navigasyonu, sayaç, caption, mobil swipe.
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
  const touchStart = useRef<number | null>(null);

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

  const navigate = (delta: number) => {
    setActive((current) =>
      current === null ? current : Math.min(items.length - 1, Math.max(0, current + delta)),
    );
  };

  const galleryCard = (image: GalleryImage, index: number, span: "feature" | null) => {
    const ref = image.asset?._ref as string;
    const dims = refDimensions(ref) ?? { width: 800, height: 800 };
    const caption = t(image.alt);
    return (
      <button
        key={ref}
        type="button"
        onClick={() => setActive(index)}
        className={
          "group relative overflow-hidden rounded-[4px] bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
          (span ? spanClasses[span] : "aspect-square") +
          (afterCarousel ? " dvn-carousel-card shrink-0 snap-start" : "")
        }
        aria-label={uiString("lightboxImageAria")(index + 1)}
      >
        <Image
          src={ref}
          alt={caption || `Galeri görseli ${index + 1}`}
          width={dims.width}
          height={dims.height}
          sizes={span ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          placeholder="blur"
          blurDataURL={image.lqip ?? lqipUrl(ref, ENV)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
        />
        {/* Caption yalnız hover-capable işaretçide — dokunmatikte grid'de
            caption yok (lightbox'ta var); ekran okuyucu alt'ı zaten okur. */}
        {caption ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent p-3 pt-10 opacity-0 transition-[opacity,translate] duration-300 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100"
          >
            <span className="mb-1.5 block h-px w-6 bg-gold" />
            <span className="block font-sans text-xs font-medium tracking-wide text-ivory">
              {caption}
            </span>
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <>
      {after.length > 0 ? (
        /* DSN-54: standart düzen — sekmeler solda, oklar sağ üstte. */
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div
            role="group"
            aria-label={uiString("lightboxFilterAria")}
            className="flex flex-wrap gap-2"
          >
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
                aria-label={uiString("prevImages")}
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
                aria-label={uiString("nextImages")}
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
            {after.map((image, index) => galleryCard(image, index, null))}
          </div>
          {after.length > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
              {after.map((image, i) => (
                <button
                  key={image.asset?._ref ?? i}
                  type="button"
                  aria-label={uiString("galleryImageAria")(i + 1)}
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
        <div className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((image, index) => galleryCard(image, index, mosaicSpan(index, items.length)))}
        </div>
      )}
      {/* Native dialog covers keyboard (Esc) — the click handler only closes
          on backdrop taps, which keyboard users reach via the Kapat button. */}
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
        // m-auto zorunlu: preflight tüm margin'leri sıfırladığı için UA'nın
        // dialog:modal { margin: auto } merkezlemesi ölür ve dialog sol üste
        // yapışır. Fit-content kutu m-auto ile viewport'ta ortalanır.
        className="backdrop:bg-navy/90 m-auto bg-transparent p-0 text-ivory"
        aria-label={uiString("galleryImageAlt")}
      >
        {active !== null && items[active] ? (
          <LightboxStage
            items={items}
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

const stageArrowClass =
  "flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/25 bg-navy-3/90 text-white transition-colors duration-300 hover:bg-gold hover:text-navy hover:border-gold disabled:pointer-events-none disabled:opacity-40";

/** DSN-68: lightbox sahnesi — altın hairline çerçeve, ok navigasyonu, sayaç
    ve caption. Ayrı bileşen: statik render testleri doğrudan basabilir. */
export function LightboxStage({
  items,
  active,
  closeLabel,
  onClose,
  onNavigate,
}: {
  items: GalleryImage[];
  active: number;
  closeLabel?: string;
  onClose: () => void;
  onNavigate: (delta: number) => void;
}) {
  const image = items[active];
  const ref = image?.asset?._ref as string;
  const dims = ref ? (refDimensions(ref) ?? { width: 1600, height: 1200 }) : null;
  const caption = t(image?.alt);
  return (
    <div className="relative p-3 md:p-4">
      {closeLabel ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1 right-3 z-10 translate-y-[-100%] rounded-[4px] border border-white/25 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-ivory transition-colors duration-300 hover:bg-gold hover:text-navy md:right-4"
        >
          {closeLabel} ✕
        </button>
      ) : null}
      <button
        type="button"
        aria-label={uiString("prevImages")}
        onClick={() => onNavigate(-1)}
        disabled={active === 0}
        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${stageArrowClass}`}
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
        aria-label={uiString("nextImages")}
        onClick={() => onNavigate(1)}
        disabled={active === items.length - 1}
        className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 ${stageArrowClass}`}
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
      <div className="rounded-[4px] border border-[var(--dvn-line-gold)] bg-navy-2/60 p-2 md:p-3">
        {image && dims ? (
          <Image
            src={ref}
            alt={caption || "Büyük görsel"}
            width={dims.width}
            height={dims.height}
            sizes="90vw"
            placeholder="blur"
            blurDataURL={image.lqip ?? lqipUrl(ref, ENV)}
            // Boyut viewport oranlı: 86vw genişlik tavanı mobilde kenar
            // payıyla güvenli; md:max-w-3xl kalktı — desktop'ta görsel
            // 768px'e hapsedilip küçük kalıyordu, artık yükseklik tavanı
            // (78dvh — mobil tarayıcı araç çubuğu kaydıkça alan kaybetmesin)
            // belirleyici olana kadar ekranla büyür.
            className="mx-auto h-auto max-h-[78dvh] w-auto max-w-[86vw] rounded-[2px] object-contain"
          />
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
            <span className="truncate font-sans text-sm text-ivory/80">{caption ?? ""}</span>
          </span>
          <span className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft [font-variant-numeric:tabular-nums]">
            {active + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
