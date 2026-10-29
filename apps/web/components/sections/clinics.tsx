import Image from "next/image";

import { Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import type { BranchItem } from "../../src/content/branches";

const ENV = imageTarget();

/** DSN-38 ikon dili — adres/telefon/saat satırlarında küçük stroke ikonlar. */
function RowIcon({ kind }: { kind: "pin" | "phone" | "clock" }) {
  const paths: Record<typeof kind, string> = {
    pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6l4 2",
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

/**
 * DSN-67/84: doküman #13 WHY THREE CLINICS MATTER — DentalX'in dolu lokasyon
 * kartı deseni: foto üstte, şube adı serif, altında ikonlu ADRES / TELEFON /
 * SAAT satırları + detay bağlantısı. Kartlar şube detayına gider; "hangi
 * tedavi hangi şubede" eşleşmesi CMS verisi doğrulanmadan iddia edilmez
 * (doküman kuralı). Başlıklar siteCopy'den; şube yoksa bölüm render edilmez.
 */
export function ClinicsSection({
  branches,
  eyebrow,
  heading,
  intro,
  detailLabel,
}: {
  branches: BranchItem[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** siteCopy.ui.branchDetailLink — copy yoksa satır bağlantısı basılmaz. */
  detailLabel?: string;
}) {
  if (branches.length === 0) return null;
  return (
    <Section>
      {eyebrow ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">{eyebrow}</p>
        </div>
      ) : null}
      {heading ? (
        <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
          {heading}
        </Heading>
      ) : null}
      {intro ? <p className="mt-4 max-w-3xl font-sans text-lg text-ink/70">{intro}</p> : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {branches.slice(0, 3).map((branch) => {
          const address = t(branch.address);
          const phone = branch.phone;
          const hours = t(branch.hours);
          const rows = [
            address ? { kind: "pin" as const, text: address } : null,
            phone ? { kind: "phone" as const, text: phone } : null,
            hours ? { kind: "clock" as const, text: hours } : null,
          ].filter((row): row is { kind: "pin" | "phone" | "clock"; text: string } => row !== null);
          const card = (
            <>
              {branch.image?.ref ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-navy">
                  <Image
                    src={branch.image.ref}
                    alt={t(branch.image.alt) || branch.name || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={branch.image.lqip ?? lqipUrl(branch.image.ref, ENV)}
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="mt-4 font-serif text-xl text-ink">{branch.name}</h3>
              {rows.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {rows.map((row) => (
                    <li
                      key={`${branch.slug}-${row.kind}`}
                      className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-ink/70"
                    >
                      <RowIcon kind={row.kind} />
                      <span>{row.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {branch.slug && detailLabel ? (
                <span className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold-deep">
                  {detailLabel}
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
                </span>
              ) : null}
            </>
          );
          if (!branch.slug) {
            return <article key={branch.name ?? "branch"}>{card}</article>;
          }
          return (
            <Link
              key={branch.slug}
              href={routes.branch(branch.slug)}
              className="group block rounded-[4px] no-underline transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)]"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
