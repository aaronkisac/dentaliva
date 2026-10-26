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
import { TrustStripSection } from "./trust-strip";
import { TreatmentPathsSection } from "./treatment-paths";
import { ReviewFormSection } from "./review-form";
import { HowItWorksSection } from "./how-it-works";
import { DecisionModulesSection } from "./decision-modules";
import { AftercareSection, TravelStaySection } from "./travel-aftercare";
import { t } from "../../src/i18n";
import { routes } from "../../src/routes";

type SectionRenderer = (data: HomeData) => ReactNode;

/** DSN-11: bölümler görünüme girerken kayarak belirir (hero hariç — LCP). */
function reveal(node: ReactNode): ReactNode {
  return <Reveal>{node}</Reveal>;
}

/** Registry: section id → renderer. Order comes from the site config. */
export const sectionRegistry: Record<HomeSectionId, SectionRenderer> = {
  hero: (data) => (
    <HeroSection
      data={data.homePage?.hero ?? null}
      trust={data.siteCopy?.heroTrust ?? null}
      whatsapp={data.siteSettings?.whatsapp ?? null}
    />
  ),
  ticker: (data) => <ServiceTicker items={data.quickServices} />,
  trustStrip: (data) => reveal(<TrustStripSection data={data.homePage?.trustStrip ?? null} />),
  treatmentPaths: (data) =>
    reveal(
      <TreatmentPathsSection
        items={data.homePage?.treatmentPaths ?? []}
        eyebrow={t(data.siteCopy?.sectionHeadings?.treatmentPathsEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.treatmentPathsHeading)}
      />,
    ),
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
  reviewForm: (data) =>
    reveal(
      <ReviewFormSection
        data={data.homePage?.reviewForm ?? null}
        eyebrow={t(data.siteCopy?.sectionHeadings?.reviewFormEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.reviewFormHeading)}
      />,
    ),
  howItWorks: (data) =>
    reveal(
      <HowItWorksSection
        steps={data.homePage?.howItWorks?.steps ?? []}
        eyebrow={t(data.siteCopy?.sectionHeadings?.howItWorksEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.howItWorksHeading)}
      />,
    ),
  decisionModules: (data) =>
    reveal(<DecisionModulesSection modules={data.homePage?.decisionModules ?? []} />),
  travelStay: (data) =>
    reveal(
      <TravelStaySection
        data={data.homePage?.travelStay ?? null}
        eyebrow={t(data.siteCopy?.sectionHeadings?.travelEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.travelHeading)}
      />,
    ),
  aftercare: (data) =>
    reveal(
      <AftercareSection
        data={data.homePage?.aftercare ?? null}
        eyebrow={t(data.siteCopy?.sectionHeadings?.aftercareEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.aftercareHeading)}
        normalTitle={t(data.siteCopy?.sectionHeadings?.aftercareNormalTitle)}
        urgentTitle={t(data.siteCopy?.sectionHeadings?.aftercareUrgentTitle)}
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
        eyebrow={t(data.siteCopy?.sectionHeadings?.galleryEyebrow)}
        heading={t(data.siteCopy?.sectionHeadings?.galleryHome)}
        lead={t(data.siteCopy?.sectionHeadings?.galleryLead)}
        allLabel={t(data.siteCopy?.sectionHeadings?.allGalleryCta)}
        allHref={routes.gallery}
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
        trustLine={data.homePage?.cta?.trustLine ?? null}
        eyebrow={data.siteCopy?.sectionHeadings?.finalCtaEyebrow ?? null}
        phone={data.siteSettings?.phone ?? ""}
        whatsapp={data.siteSettings?.whatsapp ?? null}
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
