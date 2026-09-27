import type { Metadata } from "next";

import { Heading, Section } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { GalleryLightbox } from "../../components/lightbox";
import { fetchHomeData } from "../../src/content/home";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/fotograf-galerisi",
  title: "Fotoğraf Galerisi",
  description: "Dentaliva fotoğraf galerisi",
});

export default async function GalleryPage() {
  const data = await fetchHomeData(readClient);
  const images = data.homePage?.gallery ?? [];

  return (
    <Section>
      <Heading level="h1" size="lg">
        Fotoğraf Galerisi
      </Heading>
      <div className="mt-8">
        {images.length === 0 ? (
          <p className="font-sans text-ink">Galeri hazırlanıyor.</p>
        ) : (
          <>
            <p className="sr-only">Galeri: {images.length} görsel, büyütmek için görsel seçin.</p>
            <GalleryLightbox images={images} />
          </>
        )}
      </div>
      {images[0]?.alt?.tr ? (
        <p className="sr-only">İlk görsel açıklaması: {pickLocalized(images[0].alt)}</p>
      ) : null}
    </Section>
  );
}
