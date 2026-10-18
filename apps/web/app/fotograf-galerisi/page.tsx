import type { Metadata } from "next";

import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { GalleryLightbox } from "../../components/lightbox";
import { fetchHomePageDocument } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { uiString } from "../../src/ui-strings";

export const metadata: Metadata = pageMetadata({
  path: "/fotograf-galerisi",
  title: uiString("galleryTitle"),
  description: uiString("galleryDescription"),
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
      {t(headings?.galleryPage) ? (
        <Heading level="h1" size="lg">
          {t(headings?.galleryPage)}
        </Heading>
      ) : null}
      <div className="mt-8">
        {images.length === 0 && onceSonra.length === 0 ? (
          <p className="font-sans text-ink">{t(headings?.galleryEmpty)}</p>
        ) : (
          <>
            <p className="sr-only">{uiString("gallerySrSummary")(images.length)}</p>
            <GalleryLightbox
              images={images}
              onceSonra={onceSonra}
              closeLabel={t(copy?.ui?.lightboxClose)}
            />
          </>
        )}
      </div>
      {images[0]?.alt ? (
        <p className="sr-only">{uiString("galleryFirstAltSr")(t(images[0]?.alt))}</p>
      ) : null}
    </Section>
  );
}
