"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "./cn";

export type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms (use the --dvn-stagger token value × index). */
  delay?: number;
  className?: string;
};

/**
 * Reveal-on-scroll: fades content in when it enters the viewport.
 * Immediately visible when the user prefers reduced motion (and when
 * IntersectionObserver reports the element is already on screen).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-opacity ease-[var(--dvn-ease-out)] duration-[var(--dvn-duration-slow)] motion-reduce:transition-none",
        revealed ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
