import { Heading, Link, Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import type { DoctorItem, HomeTeamSection } from "../../src/content/home";
import { DoctorPortrait } from "../doctor-portrait";
import { routes } from "../../src/routes";

const VISIBLE = 4;

/**
 * DSN-84: doküman #14 DENTISTS — Dentia'nın 3/4 portre ekip kartı deseni:
 * vitrinde 3-4 hekim kartı (tam isim, resmi unvan, profil linki; stok foto
 * yok — DoctorPortrait monogram fallback'i DSN-43). Seçki CMS'ten
 * (teamSection.doctors, en fazla 4); boşsa hekim listesinin ilk 4'ü.
 * Altta CTA hekimler sayfasına (teamSection.ctaLabel — copy yoksa buton
 * basılmaz). DSN-18/19 carousel'i v1'de kaldı (git tag homepage-v1);
 * bölüm server component'tir (carousel state JS'i kalktı — perf).
 */
export function DoctorsSection({
  items,
  team,
}: {
  items: DoctorItem[];
  team?: HomeTeamSection | null;
}) {
  const curated = (team?.doctors ?? []).filter((doctor): doctor is DoctorItem & { name: string } =>
    Boolean(doctor?.name),
  );
  const featured = (curated.length > 0 ? curated : items).slice(0, VISIBLE);
  if (featured.length === 0) return null;
  const eyebrow = t(team?.eyebrow);
  const heading = t(team?.heading);
  const text = t(team?.text);
  const ctaLabel = t(team?.ctaLabel);
  return (
    <Section>
      {heading || eyebrow ? (
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          {heading ? (
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
              {heading}
            </Heading>
          ) : null}
          {text ? <Text className="mt-4 max-w-2xl">{text}</Text> : null}
        </div>
      ) : null}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((doctor) => {
          const title = t(doctor.title);
          return (
            <article
              key={doctor.slug ?? doctor.name}
              className="group rounded-[4px] border border-transparent p-2 -m-2 transition-shadow duration-300 hover:border-[var(--dvn-line-soft)] hover:bg-white hover:shadow-[var(--dvn-shadow-lift)]"
            >
              <DoctorPortrait
                name={doctor.name}
                photo={doctor.photo?.ref ? { ref: doctor.photo.ref, lqip: doctor.lqip } : undefined}
                alt={t(doctor.photo?.alt) || doctor.name || ""}
                frameClassName="relative aspect-[3/4] w-full overflow-hidden rounded-[4px]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <h3 className="mt-4 font-serif text-lg leading-snug text-ink">
                {doctor.slug ? (
                  <Link
                    href={routes.doctor(doctor.slug)}
                    className="hover:text-gold-deep hover:no-underline"
                  >
                    {doctor.name}
                  </Link>
                ) : (
                  doctor.name
                )}
              </h3>
              {title ? <p className="mt-1 font-sans text-sm text-ink/70">{title}</p> : null}
            </article>
          );
        })}
      </div>
      {ctaLabel ? (
        <Link
          href={routes.doctors}
          className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold-deep hover:text-ink"
        >
          {ctaLabel}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14m0 0-6-6m6 6-6 6" />
          </svg>
        </Link>
      ) : null}
    </Section>
  );
}
