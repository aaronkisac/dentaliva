import { Link } from "@dentaliva/ui";

import { routes } from "../src/routes";
import { DoctorPortrait } from "./doctor-portrait";

/**
 * DSN-69: hekim vitrin kartı — çerçevesiz 4/5 portre (kaynak fotoğraf
 * zaten 4:5; eski h-48 kırpımı yüzleri kesiyordu), altında serif isim +
 * altın çizgili unvan etiketi. Kartın tamamı hekim detayına gider:
 * "Detay →" tekrarı kalktı (copy sweep; SUBE-1 notunun bu ayağı).
 * DSN-43: fotosuz hekimde espresso monogram aynı çerçevede kalır.
 * Hover: hafif zoom + altın hairline (gallery mosaic dili).
 */
export function DoctorCard({
  name,
  title,
  slug,
  photo,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority,
}: {
  name?: string;
  title?: string;
  slug: string;
  photo?: { ref?: string; lqip?: string };
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={routes.doctor(slug)}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      aria-label={name ? `${name}${title ? ` — ${title}` : ""}` : undefined}
    >
      <div className="relative overflow-hidden rounded-[4px] bg-ivory-2 aspect-[4/5]">
        <DoctorPortrait
          name={name}
          photo={photo}
          alt={name ?? ""}
          frameClassName="h-full w-full aspect-auto"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
          sizes={sizes}
          priority={priority}
        />
        {/* Altın hairline — hover'da soldan açılır (mosaic caption çizgisi). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
        />
      </div>
      <p className="mt-4 font-serif text-navy [text-wrap:balance] text-[length:var(--dvn-text-title-size)] leading-[var(--dvn-text-title-lh)]">
        {name}
      </p>
      {title ? (
        <p className="mt-1.5 flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.08em] text-muted">
          <span aria-hidden="true" className="h-px w-4 shrink-0 bg-gold" />
          {title}
        </p>
      ) : null}
    </Link>
  );
}
