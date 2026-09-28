import { pickLocalized } from "@dentaliva/sanity-schema/client";

import type { QuickServiceItem } from "../../src/content/home";

/**
 * DSN-14: ReoDental kalıbındaki sonsuz kayan hizmet şeridi. Dekoratiftir:
 * tamamı aria-hidden (aynı bilgiler aşağıdaki hizmet bölümünde ekran
 * okuyucular için mevcut). İki kopya tek track'te akar; CSS translateX(-50%)
 * döngüsü kusursuz döngü sağlar; hover'da durur, reduced-motion'da statik.
 */
export function ServiceTicker({ items }: { items: QuickServiceItem[] }) {
  const names = items
    .slice(0, 10)
    .map((item) => pickLocalized(item.name))
    .filter((name) => name.length > 0);
  if (names.length === 0) return null;

  const strip = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-14 pr-14">
      {names.map((name) => (
        <li key={name} className="flex items-center gap-3 whitespace-nowrap">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gold"
          >
            {/* Diş silüeti */}
            <path d="M12 5.5c-1.5-1.2-3.4-1.7-5-1C5 5.3 4 7.2 4.2 9.3c.2 1.9 1 3.2 1.4 5 .4 1.6.5 3.3 1 4.7.3.8 1.4.9 1.8.1.5-1 .8-2.6 1.6-3.7.4-.6 1.1-1.1 2-1.1s1.6.5 2 1.1c.8 1.1 1.1 2.7 1.6 3.7.4.8 1.5.7 1.8-.1.5-1.4.6-3.1 1-4.7.4-1.8 1.2-3.1 1.4-5 .2-2.1-.8-4-2.8-4.8-1.6-.7-3.5-.2-5 1z" />
          </svg>
          <span className="font-sans text-sm uppercase tracking-widest text-ink/80">{name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-[var(--dvn-line-soft)] bg-ivory-2 py-6"
    >
      <div className="dvn-marquee-track">
        {strip(true)}
        {strip(true)}
      </div>
    </section>
  );
}
