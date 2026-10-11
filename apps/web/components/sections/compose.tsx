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
        eyebrow={data.siteCopy?.sectionHeadings?.servicesEyebrow?.tr}
        heading={data.siteCopy?.sectionHeadings?.servicesHeading?.tr}
        ctaLabel={data.siteCopy?.sectionHeadings?.allServicesCta?.tr}
      />,
    ),
  about: (data) =>
    reveal(<AboutSection data={data.homePage?.about ?? null} stats={data.homePage?.stats ?? []} />),
  videoTestimonials: (data) => reveal(<VideoTestimonialsSection items={data.testimonials} />),
  reviews: (data) => reveal(<ReviewsSection items={data.testimonials} />),
  gallery: (data) =>
    reveal(
      <GallerySection
        images={data.homePage?.gallery ?? []}
        onceSonra={data.homePage?.onceSonraGallery ?? []}
        heading={data.siteCopy?.sectionHeadings?.galleryHome?.tr}
        closeLabel={data.siteCopy?.ui?.lightboxClose?.tr}
      />,
    ),
  onceSonra: (data) =>
    reveal(
      <OnceSonraSection
        items={data.homePage?.onceSonraCases ?? []}
        eyebrow={data.siteCopy?.sectionHeadings?.onceSonraEyebrow?.tr}
        heading={data.siteCopy?.sectionHeadings?.onceSonraHeading?.tr}
        beforeLabel={data.siteCopy?.ui?.onceSonraBefore?.tr}
        afterLabel={data.siteCopy?.ui?.onceSonraAfter?.tr}
      />,
    ),
  doctors: (data) =>
    reveal(<DoctorsSection items={data.doctors} team={data.homePage?.teamSection ?? null} />),
  faq: (data) =>
    reveal(
      <FaqSection
        items={data.faqs}
        heading={data.siteCopy?.sectionHeadings?.faq?.tr}
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
  return (
    <>
      {order.map((id) => (
        <div key={id} data-section={id}>
          {sectionRegistry[id](data)}
        </div>
      ))}
    </>
  );
}
