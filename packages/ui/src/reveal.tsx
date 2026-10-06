"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "./cn";

export type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms (use the --dvn-stagger token value × index). */
  delay?: number;
  className?: string;
  /** up = fade + translateY (varsayılan) · scale = fade + büyüyerek giriş. */
  effect?: "up" | "scale";
};

/**
 * Reveal-on-scroll: fades content in when it enters the viewport.
 * Immediately visible when the user prefers reduced motion (and when
 * IntersectionObserver reports the element is already on screen).
 */
export function Reveal({ children, delay = 0, className, effect = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    // v8 ignore if — the ref is always attached once the effect can run
    if (element === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    // Element boyundan bağımsız eşik: %15 threshold, viewport'tan uzun
    // sarmalayıcılarda (ör. 5061px ana sayfa tedavi gridi, listeleme gövdeleri)
    // hiçbir ekran boyutunda tetiklenemez ve bölüm kalıcı olarak gizli kalır.
    // threshold 0 + alt kenardan -15% rootMargin, elemanın tepesi viewport'un
    // alt %15 çizgisine girdiği anda tetikler — kartlarda da aynı his.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,translate,scale] ease-[var(--dvn-ease-out)] duration-[var(--dvn-duration-slow)] motion-reduce:transition-none",
        revealed
          ? effect === "scale"
            ? "opacity-100 scale-100"
            : "opacity-100 translate-y-0"
          : effect === "scale"
            ? "opacity-0 scale-[0.92]"
            : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
