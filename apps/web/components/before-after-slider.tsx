"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * DSN-50: pointer konumunu 0-100 aralığına sıkıştıran saf yardımcı —
 * test edilebilirlik için bileşenden ayrı.
 */
export function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 50;
  return Math.min(100, Math.max(0, value));
}

/**
 * DSN-50: sürüklenebilir önce/sonra karşılaştırma slider'ı (ReoDental
 * deseninin bizim token'larla uyarlaması). Önce görseli soldan clip-path
 * ile açılır; işaretçi tüm karede sürüklenir, klavye erişimi APG slider
 * deseniyle (role=slider + ok/Home/End) beyaz sap üzerinden verilir.
 */
export function BeforeAfterSlider({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
}: {
  before: { ref: string; alt: string; lqip?: string };
  after: { ref: string; alt: string; lqip?: string };
  label: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [percent, setPercent] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const moveTo = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPercent(clampPercent(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) moveTo(event.clientX);
  };

  const stopDrag = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPercent((value) => clampPercent(value - 5));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPercent((value) => clampPercent(value + 5));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPercent(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPercent(100);
    }
  };

  return (
    <div
      ref={frameRef}
      className="relative aspect-[4/3] cursor-ew-resize touch-none select-none bg-navy"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <Image
        src={after.ref}
        alt={after.alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        placeholder={after.lqip ? "blur" : "empty"}
        blurDataURL={after.lqip}
        className="object-cover"
        draggable={false}
      />
      <Image
        src={before.ref}
        alt={before.alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        placeholder={before.lqip ? "blur" : "empty"}
        blurDataURL={before.lqip}
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        draggable={false}
      />
      {beforeLabel ? (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-[4px] bg-navy/70 px-2.5 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white">
          {beforeLabel}
        </span>
      ) : null}
      {afterLabel ? (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-[4px] bg-navy/70 px-2.5 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white">
          {afterLabel}
        </span>
      ) : null}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white"
        style={{ left: `${percent}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        style={{ left: `${percent}%` }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M8 7l-5 5 5 5" />
          <path d="M16 7l5 5-5 5" />
        </svg>
      </div>
    </div>
  );
}
