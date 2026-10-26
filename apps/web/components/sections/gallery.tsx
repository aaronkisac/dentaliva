import { Heading, Link, Section } from "@dentaliva/ui";

import type { GalleryImage } from "../../src/content/home";
import { GalleryLightbox } from "../lightbox";

/**
 * DSN-68: ana sayfa galerisi için küme seçimi — CMS'te "Ana sayfa galeri
 * seçkisi" doluysa o basılır; boşsa galeri sayfasının külliyatının ilk 8'i
 * (bugünkü davranış) kalır. Seçki boş referanslı öğeler içerirse elenir.
 */
export function pickHomeGallery(
  homeGallery: GalleryImage[] | undefined,
  gallery: GalleryImage[],
): GalleryImage[] {
  const selection = (homeGallery ?? []).filter((image) => image.asset?._ref);
  return selection.length > 0 ? selection : gallery;
}

/**
 * DSN-46: ana sayfa galerisi — başlık siteCopy'den (yoksa render edilmez),
 * grid GalleryLightbox'a devredilir: fotoğrafa tıklayınca büyütme + CMS'ten
 * "Kapat". Fotoğraflar geçici (müşteri CMS'ten değiştirir) — yapı sabit.
 * DSN-52: istatistik bandı about bölümündeki fotoğraf rozetlerine taşındı;
 * bant buradan kaldırıldı (mükerrer kanıt yüzeyi olmasın).
 * DSN-68: header row (eyebrow + başlık + lead solda, "Tüm Fotoğraflar"
 * bağlantısı sağda — DSN-45 hizmetler deseni) + küratörlü mosaic.
 */
export function GallerySection({
  images,
  onceSonra,
  eyebrow,
  heading,
  lead,
  allLabel,
  allHref,
  closeLabel,
}: {
  images: GalleryImage[];
  onceSonra?: GalleryImage[];
  eyebrow?: string;
  heading?: string;
  lead?: string;
  allLabel?: string;
  allHref?: string;
  closeLabel?: string;
}) {
  const rendered = images.filter((image) => image.asset?._ref).slice(0, 8);
  if (rendered.length === 0) return null;
  return (
    <Section>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          {heading ? (
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
              {heading}
            </Heading>
          ) : null}
          {lead ? (
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-muted">{lead}</p>
          ) : null}
        </div>
        {allLabel && allHref ? (
          <div className="max-md:mt-2">
            <Link
              href={allHref}
              className="font-sans text-sm font-semibold text-navy underline-offset-4 hover:text-gold-deep hover:underline"
            >
              {allLabel} →
            </Link>
          </div>
        ) : null}
      </div>
      <div className="mt-10">
        <GalleryLightbox
          images={rendered}
          onceSonra={onceSonra?.filter((image) => image.asset?._ref)}
          closeLabel={closeLabel}
        />
      </div>
    </Section>
  );
}
