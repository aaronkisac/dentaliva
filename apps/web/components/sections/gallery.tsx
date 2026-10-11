import { Heading, Section } from "@dentaliva/ui";

import type { GalleryImage } from "../../src/content/home";
import { GalleryLightbox } from "../lightbox";

/**
 * DSN-46: ana sayfa galerisi — başlık siteCopy'den (yoksa render edilmez),
 * grid GalleryLightbox'a devredilir: fotoğrafa tıklayınca büyütme + CMS'ten
 * "Kapat". Fotoğraflar geçici (müşteri CMS'ten değiştirir) — yapı sabit.
 * DSN-52: istatistik bandı about bölümündeki fotoğraf rozetlerine taşındı;
 * bant buradan kaldırıldı (mükerrer kanıt yüzeyi olmasın).
 */
export function GallerySection({
  images,
  onceSonra,
  heading,
  closeLabel,
}: {
  images: GalleryImage[];
  onceSonra?: GalleryImage[];
  heading?: string;
  closeLabel?: string;
}) {
  const rendered = images.filter((image) => image.asset?._ref).slice(0, 8);
  if (rendered.length === 0) return null;
  return (
    <Section>
      {heading ? (
        <Heading level="h2" size="md">
          {heading}
        </Heading>
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
