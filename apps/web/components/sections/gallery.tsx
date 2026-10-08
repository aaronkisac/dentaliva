import { Heading, Section } from "@dentaliva/ui";

import type { GalleryImage } from "../../src/content/home";
import { GalleryLightbox } from "../lightbox";

/**
 * DSN-46: ana sayfa galerisi — başlık siteCopy'den (yoksa render edilmez),
 * istatistik bandı en az 2 kartta görünür (tek kart kafa karıştırır), grid
 * GalleryLightbox'a devredilir: fotoğrafa tıklayınca büyütme + CMS'ten
 * "Kapat". Fotoğraflar geçici (müşteri CMS'ten değiştirir) — yapı sabit.
 */
export function GallerySection({
  images,
  stats,
  onceSonra,
  heading,
  closeLabel,
}: {
  images: GalleryImage[];
  stats?: Array<{ value?: string; label?: { tr?: string } }>;
  onceSonra?: GalleryImage[];
  heading?: string;
  closeLabel?: string;
}) {
  const rendered = images.filter((image) => image.asset?._ref).slice(0, 8);
  if (rendered.length === 0) return null;
  const visibleStats = (stats ?? []).filter((stat) => stat.value);
  return (
    <Section>
      {heading ? (
        <Heading level="h2" size="md">
          {heading}
        </Heading>
      ) : null}
      {visibleStats.length >= 2 ? (
        <div className="mt-6 flex flex-wrap gap-6">
          {visibleStats.map((stat) => (
            <div key={stat.value} className="border border-[var(--dvn-line-gold)] px-6 py-4">
              <p className="font-serif text-3xl text-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-ink/70">{stat.label?.tr}</p>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-8">
        <GalleryLightbox
          images={rendered}
          onceSonra={onceSonra?.filter((image) => image.asset?._ref)}
          closeLabel={closeLabel}
        />
      </div>
    </Section>
  );
}
