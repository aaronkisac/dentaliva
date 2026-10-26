import type { Metadata } from "next";

import { Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { CtaBand } from "../../components/cta-band";
import { GalleryLightbox } from "../../components/lightbox";
import { PageHero } from "../../components/page-hero";
import { fetchHomePageDocument, fetchSiteSettings } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.gallery,
  title: pageString("galleryTitle"),
  description: pageString("galleryDescription"),
});

export default async function GalleryPage() {
  // PRF-5: yalnızca homePage + siteCopy + siteSettings — liste sorguları çekilmez.
  const [homePage, copy, settings] = await Promise.all([
    fetchHomePageDocument(readClient),
    fetchSiteCopy(readClient),
    fetchSiteSettings(readClient),
  ]);
  const headings = copy?.sectionHeadings;
  const images = homePage?.gallery ?? [];
  // DSN-29: önce/sonra görselleri müşteriden (hasta izinli) gelir;
  // dolana kadar sekme filtresi hiç görünmez.
  const onceSonra = homePage?.onceSonraGallery ?? [];

  return (
    <>
      {/* DSN-68: galeri sayfası PageHero kalıbına alındı — diğer listeleme
          sayfalarıyla tek şablon (DSN-25); lead siteCopy'den. */}
      <PageHero
        eyebrow="Dentaliva"
        title={t(headings?.galleryPage) || pageString("galleryTitle")}
        lead={t(headings?.galleryLead)}
      />
      <Section>
        {images.length === 0 && onceSonra.length === 0 ? (
          <Text>{t(headings?.galleryEmpty)}</Text>
        ) : (
          <>
            <p className="sr-only">{pageString("gallerySrSummary")(images.length)}</p>
            <GalleryLightbox
              images={images}
              onceSonra={onceSonra}
              closeLabel={t(copy?.ui?.lightboxClose)}
            />
          </>
        )}
        {images[0]?.alt ? (
          <p className="sr-only">{pageString("galleryFirstAltSr")(t(images[0]?.alt))}</p>
        ) : null}
      </Section>
      {/* DSN-68: dönüşüm bandı — hizmet/hekim/blog detay sayfalarıyla aynı. */}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
        actionLabel={t(copy?.ui?.appointmentCta)}
      />
    </>
  );
}
