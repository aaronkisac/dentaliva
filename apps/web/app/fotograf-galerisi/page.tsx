import type { Metadata } from "next";

import { Heading, Section } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { GalleryLightbox } from "../../components/lightbox";
import { fetchHomePageDocument } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/fotograf-galerisi",
  title: "Fotoğraf Galerisi",
  description: "Dentaliva fotoğraf galerisi",
});

export default async function GalleryPage() {
  // PRF-5: yalnızca homePage dokümanı — liste sorguları çekilmez.
  const [homePage, copy] = await Promise.all([
    fetchHomePageDocument(readClient),
    fetchSiteCopy(readClient),
  ]);
  const headings = copy?.sectionHeadings;
  const images = homePage?.gallery ?? [];
  // DSN-29: önce/sonra görselleri müşteriden (hasta izinli) gelir;
  // dolana kadar sekme filtresi hiç görünmez.
  const onceSonra = homePage?.onceSonraGallery ?? [];

  return (
    <Section>
      {headings?.galleryPage?.tr ? (
        <Heading level="h1" size="lg">
          {headings.galleryPage.tr}
        </Heading>
      ) : null}
      <div className="mt-8">
        {images.length === 0 && onceSonra.length === 0 ? (
          <p className="font-sans text-ink">{headings?.galleryEmpty?.tr}</p>
        ) : (
          <>
            <p className="sr-only">Galeri: {images.length} görsel, büyütmek için görsel seçin.</p>
            <GalleryLightbox
              images={images}
              onceSonra={onceSonra}
              closeLabel={copy?.ui?.lightboxClose?.tr}
            />
          </>
        )}
      </div>
      {images[0]?.alt?.tr ? (
        <p className="sr-only">İlk görsel açıklaması: {pickLocalized(images[0].alt)}</p>
      ) : null}
    </Section>
  );
}
