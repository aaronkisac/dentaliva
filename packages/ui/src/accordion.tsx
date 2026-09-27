"use client";

import { useId, useState } from "react";

import { cn } from "./cn";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export type AccordionProps = {
  items: AccordionItem[];
  /** Uncontrolled: opens the first item initially. Pass [] to start collapsed. */
  defaultOpenId?: string | null;
  className?: string;
};

/**
 * FAQ accordion as a WAI-ARIA disclosure pattern: each header is a real
 * <button> (Enter/Space for free), state is mirrored to aria-expanded, and the
 * panel is a labelled region. Single-open behaviour matches the prototype.
 */
export function Accordion({
  items,
  defaultOpenId = items[0]?.id ?? null,
  className,
}: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  return (
    <div
      className={cn(
        "divide-y divide-[var(--dvn-line-soft)] border border-[var(--dvn-line-soft)]",
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        // DOM id'leri item.id'den türetilemez: soru metni boşluk/?" içerebilir
        // ve IDREF boşluklu değeri geçersiz kılar (axe: aria-valid-attr-value).
        const buttonId = `${baseId}-${index}-button`;
        const panelId = `${baseId}-${index}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans text-[length:var(--dvn-text-body-size)] font-semibold text-ink transition-colors duration-300 hover:text-navy focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
              >
                {item.question}
                <span aria-hidden="true" className="text-gold">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 font-sans text-[length:var(--dvn-text-body-size)] leading-[var(--dvn-text-body-lh)] text-ink"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
