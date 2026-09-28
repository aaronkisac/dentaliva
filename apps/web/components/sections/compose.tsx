import type { ReactNode } from "react";

import { Reveal } from "@dentaliva/ui";

import type { HomeSectionId } from "../../src/config-types";
import type { HomeData } from "../../src/content/home";
import { AboutSection } from "./about";
import { CtaSection, FaqSection } from "./faq-cta";
import { DoctorsSection } from "./doctors";
import { GallerySection } from "./gallery";
import { HeroSection } from "./hero";
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
  hero: (data) => <HeroSection data={data.homePage?.hero ?? null} />,
  ticker: (data) => <ServiceTicker items={data.quickServices} />,
  quickServices: (data) => reveal(<QuickServicesSection items={data.quickServices} />),
  about: (data) => reveal(<AboutSection data={data.homePage?.about ?? null} />),
  videoTestimonials: (data) => reveal(<VideoTestimonialsSection items={data.testimonials} />),
  reviews: (data) => reveal(<ReviewsSection items={data.testimonials} />),
  gallery: (data) =>
    reveal(
      <GallerySection images={data.homePage?.gallery ?? []} stats={data.homePage?.stats ?? []} />,
    ),
  doctors: (data) => reveal(<DoctorsSection items={data.doctors} />),
  faq: (data) => reveal(<FaqSection items={data.faqs} />),
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
