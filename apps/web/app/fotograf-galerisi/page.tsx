import type { Metadata } from "next";

import { Heading, Section } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { GalleryLightbox } from "../../components/lightbox";
import { fetchHomePageDocument } from "../../src/content/home";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/fotograf-galerisi",
  title: "Fotoğraf Galerisi",
  description: "Dentaliva fotoğraf galerisi",
});

export default async function GalleryPage() {
  // PRF-5: yalnızca homePage dokümanı — liste sorguları çekilmez.
  const homePage = await fetchHomePageDocument(readClient);
  const images = homePage?.gallery ?? [];
  // DSN-29: önce/sonra görselleri müşteriden (hasta izinli) gelir;
  // dolana kadar sekme filtresi hiç görünmez.
  const onceSonra = homePage?.onceSonraGallery ?? [];

  return (
    <Section>
      <Heading level="h1" size="lg">
        Fotoğraf Galerisi
      </Heading>
      <div className="mt-8">
        {images.length === 0 && onceSonra.length === 0 ? (
          <p className="font-sans text-ink">Galeri hazırlanıyor.</p>
        ) : (
          <>
            <p className="sr-only">Galeri: {images.length} görsel, büyütmek için görsel seçin.</p>
            <GalleryLightbox images={images} onceSonra={onceSonra} />
          </>
        )}
      </div>
      {images[0]?.alt?.tr ? (
        <p className="sr-only">İlk görsel açıklaması: {pickLocalized(images[0].alt)}</p>
      ) : null}
    </Section>
  );
}
