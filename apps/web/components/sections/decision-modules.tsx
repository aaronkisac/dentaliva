import Image from "next/image";

import { buttonVariants, Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import { uiString } from "../../src/ui-strings";
import type { DecisionModule } from "../../src/content/home";

const ENV = imageTarget();

/** DSN-38 ok ikonu dili — seçenek kartlarında sağ ok olarak. */
function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

function ModuleMedia({ module, title }: { module: DecisionModule; title: string }) {
  const ref = module.image?.ref;
  if (module.youtubeId) {
    return (
      <div className="rounded-[4px] border border-gold/60 p-1.5">
        <a
          href={`https://www.youtube-nocookie.com/embed/${module.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-video overflow-hidden rounded-[2px]"
        >
          <img
            src={`https://i.ytimg.com/vi/${module.youtubeId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-navy/30 text-3xl text-white"
          >
            ▶
          </span>
        </a>
      </div>
    );
  }
  if (ref) {
    // DSN-84: about kartının altın çerçeve dili (iç radius = dış − padding).
    return (
      <div className="rounded-[4px] border border-gold/60 p-1.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
          <Image
            src={ref}
            alt={t(module.image?.alt) || title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={module.image?.lqip ?? lqipUrl(ref, ENV)}
            className="object-cover"
          />
        </div>
      </div>
    );
  }
  return null;
}

/**
 * DSN-65/84: doküman #08/#09 karar modülleri — en yüksek niyetli tedavi
 * gruplarına (implant / gülüş tasarımı) kontrollü derin geçiş. Her modül iki
 * kolon: solda eyebrow + başlık + metin + en fazla 3 seçenek kartı (DSN-84:
 * hairline kutular + ok + hover lift), sağda medya (altın çerçeveli kart —
 * hekim açıklama videosu posteri ya da görsel). Modül CTA'sı outline buton.
 * Marka üstünlüğü iddiası bilinçli yok; modüller GROQ'ta hidden ile öge
 * bazlı gizlenebilir (DSN-56 deseni). Modül yoksa bölüm render edilmez.
 */
export function DecisionModulesSection({ modules }: { modules: DecisionModule[] }) {
  const visible = modules.filter((module) => t(module.heading));
  if (visible.length === 0) return null;
  return (
    <Section className="bg-ivory">
      <div className="space-y-16 md:space-y-24">
        {visible.map((module, index) => {
          const title = t(module.heading);
          const options = (module.options ?? [])
            .map((option) => ({
              title: t(option.title),
              text: t(option.text),
              slug: option.treatment?.slug,
            }))
            .filter((option) => option.title)
            .slice(0, 3);
          const ctaSlug = module.ctaTreatment?.slug;
          return (
            <div
              key={`${index}-${title}`}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                {t(module.eyebrow) ? (
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-8 bg-gold" />
                    <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                      {t(module.eyebrow)}
                    </p>
                  </div>
                ) : null}
                <Heading level="h2" size="md" className="mt-4">
                  {title}
                </Heading>
                {t(module.body) ? (
                  <p className="mt-4 font-sans text-lg text-ink/70">{t(module.body)}</p>
                ) : null}
                {options.length > 0 ? (
                  <ul className="mt-8 space-y-3">
                    {options.map((option, i) => {
                      const inner = (
                        <>
                          <span className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-1 font-serif text-sm text-gold-deep"
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>
                              <span className="font-serif text-lg text-ink group-hover:text-gold-deep">
                                {option.title}
                              </span>
                              {option.text ? (
                                <span className="mt-1 block font-sans text-sm text-ink/70">
                                  {option.text}
                                </span>
                              ) : null}
                            </span>
                          </span>
                          {option.slug ? <ChevronIcon /> : null}
                        </>
                      );
                      return (
                        <li key={`${i}-${option.title}`}>
                          {option.slug ? (
                            <Link
                              href={routes.treatment(option.slug)}
                              className="group flex items-center justify-between gap-4 rounded-[4px] border border-[var(--dvn-line-soft)] bg-white p-4 no-underline transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)]"
                            >
                              {inner}
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between gap-4 rounded-[4px] border border-[var(--dvn-line-soft)] bg-white p-4">
                              {inner}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {ctaSlug ? (
                  <Link
                    href={routes.treatment(ctaSlug)}
                    className={`${buttonVariants({ variant: "outline" })} mt-6`}
                  >
                    {uiString("moduleCta")}
                  </Link>
                ) : null}
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <ModuleMedia module={module} title={title} />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
