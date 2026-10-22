import type { ReactNode } from "react";

import { Reveal } from "@dentaliva/ui";

import type { HomeSectionId } from "../../src/config-types";
import type { HomeData } from "../../src/content/home";
import { AboutSection } from "./about";
import { CtaSection, FaqSection } from "./faq-cta";
import { DoctorsSection } from "./doctors";
import { GallerySection } from "./gallery";
import { HeroSection } from "./hero";
import { OnceSonraSection } from "./once-sonra";
import { QuickServicesSection } from "./quick-services";
import { ServiceTicker } from "./service-ticker";
import { ReviewsSection, VideoTestimonialsSection } from "./testimonials";
import { t } from "../../src/i18n";

type SectionRenderer = (data: HomeData) => ReactNode;

/** DSN-11: bölümler görünüme girerken kayarak belirir (hero hariç — LCP). */
function reveal(node: ReactNode): ReactNode {
  return <Reveal>{node}</Reveal>;
}

/** Registry: section id → renderer. Order comes from the site config. */
export const sectionRegistry: Record<HomeSectionId, SectionRenderer> = {
  hero: (data) => (
    <HeroSection data={data.homePage?.hero ?? null} trust={data.siteCopy?.heroTrust ?? null} />
  ),
  ticker: (data) => <ServiceTicker items={data.quickServices} />,
  quickServices: (data) =>
    reveal(
      <QuickServicesSection
        items={data.quickServices}
        eyebrow={t(data.siteCopy?.sectionHeadings?.servicesEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.servicesHeading)}
        ctaLabel={t(data.siteCopy?.sectionHeadings?.allServicesCta)}
      />,
    ),
  about: (data) =>
    reveal(
      <AboutSection
        data={data.homePage?.about ?? null}
        stats={data.homePage?.stats ?? []}
        tone="dark"
      />,
    ),
  videoTestimonials: (data) =>
    reveal(
      <VideoTestimonialsSection
        items={data.testimonials}
        heading={t(data.siteCopy?.sectionHeadings?.videoReviews)}
      />,
    ),
  reviews: (data) =>
    reveal(
      <ReviewsSection
        items={data.testimonials}
        heading={t(data.siteCopy?.sectionHeadings?.reviews)}
      />,
    ),
  gallery: (data) =>
    reveal(
      <GallerySection
        images={data.homePage?.gallery ?? []}
        onceSonra={data.homePage?.onceSonraGallery ?? []}
        heading={t(data.siteCopy?.sectionHeadings?.galleryHome)}
        closeLabel={t(data.siteCopy?.ui?.lightboxClose)}
      />,
    ),
  onceSonra: (data) =>
    reveal(
      <OnceSonraSection
        items={data.homePage?.onceSonraCases ?? []}
        eyebrow={t(data.siteCopy?.sectionHeadings?.onceSonraEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.onceSonraHeading)}
        beforeLabel={t(data.siteCopy?.ui?.onceSonraBefore)}
        afterLabel={t(data.siteCopy?.ui?.onceSonraAfter)}
      />,
    ),
  doctors: (data) =>
    reveal(<DoctorsSection items={data.doctors} team={data.homePage?.teamSection ?? null} />),
  faq: (data) =>
    reveal(
      <FaqSection
        items={data.faqs}
        heading={t(data.siteCopy?.sectionHeadings?.faq)}
        copy={data.siteCopy?.faq ?? null}
      />,
    ),
  cta: (data) =>
    reveal(
      <CtaSection
        title={data.homePage?.cta?.title ?? null}
        text={data.homePage?.cta?.text ?? null}
        phone={data.siteSettings?.phone ?? ""}
      />,
    ),
};

export function HomeSections({ data, order }: { data: HomeData; order: HomeSectionId[] }) {
  // DSN-56: CRM'den gizlenen bölümler sıradan çıkar (veri silinmez; boş
  // liste/unset alan hiçbir bölümü gizlemez).
  const hidden = new Set(data.homePage?.hiddenSections ?? []);
  return (
    <>
      {order
        .filter((id) => !hidden.has(id))
        .map((id) => (
          <div key={id} data-section={id}>
            {sectionRegistry[id](data)}
          </div>
        ))}
    </>
  );
}
