import type { Metadata } from "next";

import { Reveal, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { DoctorCard } from "../../components/doctor-card";
import { t } from "../../src/i18n";

import { fetchDoctors } from "../../src/content/doctors";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.doctors,
  title: pageString("doctorsTitle"),
  description: "Dentaliva hekim kadrosu",
});

export default async function DoctorsPage() {
  // DSN-69: hero lead siteCopy'den (yoksa satır render edilmez).
  const [doctors, copy] = await Promise.all([
    fetchDoctors(readClient),
    fetchSiteCopy(readClient),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Dentaliva"
        title={pageString("doctorsTitle")}
        lead={t(copy?.sectionHeadings?.doctorsLead)}
      />
      <Reveal>
        <Section>
          {doctors.length === 0 ? (
            <Text className="mt-6">{pageString("doctorsEmpty")}</Text>
          ) : (
            /* DSN-69: portre vitrini — 4/5 portreler yüzü tam gösterir,
               kartın tamamı detaya gider; cömert boşluk editorial ritim. */
            <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor.slug}
                  name={doctor.name}
                  title={t(doctor.title)}
                  slug={doctor.slug ?? ""}
                  photo={{ ref: doctor.photo?.ref, lqip: doctor.lqip }}
                  priority={index < 3}
                />
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
