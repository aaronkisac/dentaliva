import Image from "next/image";

import { Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import { uiString } from "../../src/ui-strings";
import type { DecisionModule } from "../../src/content/home";

const ENV = imageTarget();

function ModuleMedia({ module, title }: { module: DecisionModule; title: string }) {
  const ref = module.image?.ref;
  if (module.youtubeId) {
    return (
      <a
        href={`https://www.youtube-nocookie.com/embed/${module.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video overflow-hidden border border-[var(--dvn-line-soft)]"
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
    );
  }
  if (ref) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px]">
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
    );
  }
  return null;
}

/**
 * DSN-65: strateji dokümanı #08/#09 karar modülleri — en yüksek niyetli
 * tedavi gruplarına (implant / gülüş tasarımı) kontrollü derin geçiş. Her
 * modül iki kolon: solda eyebrow + başlık + metin + en fazla 3 seçenek
 * kartı (ilgili tedaviye link — self-segmentation treatmentPaths dilinde),
 * sağda medya (hekim açıklama videosu posteri click-to-load ya da görsel).
 * Marka üstünlüğü iddiası bilinçli yok; modüller GROQ'ta hidden ile
 * öge bazlı gizlenebilir (DSN-56 deseni). Modül yoksa bölüm render edilmez.
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
                  <ul className="mt-8 divide-y divide-[var(--dvn-line-soft)]">
                    {options.map((option, i) => (
                      <li key={`${i}-${option.title}`} className="py-3">
                        {option.slug ? (
                          <Link
                            href={routes.treatment(option.slug)}
                            className="group block hover:no-underline"
                          >
                            <span className="flex items-baseline gap-3">
                              <span
                                aria-hidden="true"
                                className="font-serif text-sm text-gold-deep"
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
                          </Link>
                        ) : (
                          <span className="flex items-baseline gap-3">
                            <span aria-hidden="true" className="font-serif text-sm text-gold-deep">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>
                              <span className="font-serif text-lg text-ink">{option.title}</span>
                              {option.text ? (
                                <span className="mt-1 block font-sans text-sm text-ink/70">
                                  {option.text}
                                </span>
                              ) : null}
                            </span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {ctaSlug ? (
                  <Link
                    href={routes.treatment(ctaSlug)}
                    className="mt-6 inline-flex items-center font-sans text-sm font-semibold text-gold-deep hover:text-ink"
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
