import Image from "next/image";

import { Link } from "@dentaliva/ui";
import { site } from "../src/config";
import type { BlogListItem } from "../src/content/blog";
import { t } from "../src/i18n";
import { routes } from "../src/routes";
import { clampWords } from "./treatment-card";

/**
 * DSN-72: blog listeleme kartı — Dentologie /blog referansının dersi: kart
 * kutusu YOK; portre görsel + tarih + serif başlık + kısa özet akıyor, kartın
 * tamamı tek link. Görseller legacy og:image'lardan (2:3 portre ağırlıklı)
 * geldiği için çerçeve native orana yakın — sabit yükseklik kırpımı değil
 * (hekim kartlarındaki yüz-kaybı tuzağına bakmayız). Özet kesimi TreatmentCard
 * ile aynı veri-seviyesi clampWords (CSS line-clamp yeni Chromium'da ölü).
 * Görselsiz yazıda espresso zeminde serif altın baş harf monogramı (DSN-43
 * dili) — veri gelince rebuild'de otomatik görsel döner.
 */

/** 2026-09-01T09:00:00Z → "1 Eylül 2026" / "1 September 2026" (site dili). */
export function formatPostDate(publishedAt: string, locale = site.defaultLocale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(publishedAt));
}

function monogramInitials(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr"))
    .join("");
}

function BlogPortrait({
  post,
  sizes,
  priority,
}: {
  post: BlogListItem;
  sizes: string;
  priority?: boolean;
}) {
  if (!post.heroImage?.ref) {
    return (
      <div
        className="flex aspect-[2/3] w-full items-center justify-center bg-navy"
        aria-hidden="true"
      >
        <span className="font-serif text-6xl text-gold-soft">
          {monogramInitials(t(post.title))}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={post.heroImage.ref}
      alt={t(post.heroImage.alt) || t(post.title)}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={post.heroImage.lqip ? "blur" : "empty"}
      blurDataURL={post.heroImage.lqip}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
    />
  );
}

/** /blog vitrini: en yeni yazı — solda büyük portre, sağda başlık + özet + okuma bağlantısı. */
export function BlogFeature({
  post,
  eyebrow,
  readLabel,
}: {
  post: BlogListItem;
  eyebrow?: string;
  readLabel?: string;
}) {
  const title = t(post.title);
  const excerpt = t(post.excerpt);

  return (
    <Link
      href={routes.blogPost(post.slug ?? "")}
      className="group grid items-center gap-8 hover:no-underline lg:grid-cols-[5fr_6fr] lg:gap-14"
    >
      <div className="relative aspect-[2/3] max-h-[640px] w-full overflow-hidden rounded-[4px] bg-navy outline outline-1 outline-offset-8 outline-[color:var(--dvn-line-gold)]">
        <BlogPortrait post={post} sizes="(max-width: 1024px) 100vw, 45vw" priority />
      </div>
      <div>
        {eyebrow ? (
          <p className="flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {eyebrow}
          </p>
        ) : null}
        {post.publishedAt ? (
          <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            {formatPostDate(post.publishedAt)}
          </p>
        ) : null}
        <h2 className="mt-3 font-serif text-[length:var(--dvn-text-display-sm-size)] leading-[var(--dvn-text-display-sm-lh)] text-navy [text-wrap:balance] group-hover:text-gold-deep">
          {title}
        </h2>
        {excerpt ? (
          <p className="mt-4 max-w-prose font-sans text-ink">{clampWords(excerpt, 34)}</p>
        ) : null}
        {readLabel ? (
          <span className="mt-6 inline-block border-b border-[color:var(--dvn-line-gold)] pb-1 font-sans text-sm font-semibold text-gold-deep">
            {readLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

/** /blog grid kartı: kartsız — görsel + tarih + başlık + kısa özet, tamamı tek link. */
export function BlogCard({ post, readLabel }: { post: BlogListItem; readLabel?: string }) {
  const title = t(post.title);
  const excerpt = t(post.excerpt);

  return (
    <Link
      href={routes.blogPost(post.slug ?? "")}
      className="group flex flex-col hover:no-underline"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[4px] bg-navy">
        <BlogPortrait post={post} sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      {post.publishedAt ? (
        <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          {formatPostDate(post.publishedAt)}
        </p>
      ) : null}
      <h3 className="mt-2 font-serif text-[length:var(--dvn-text-title-size)] leading-[var(--dvn-text-title-lh)] text-navy [text-wrap:balance] group-hover:text-gold-deep">
        {title}
      </h3>
      {excerpt ? (
        <p className="mt-2 font-sans text-sm leading-relaxed text-ink">{clampWords(excerpt, 18)}</p>
      ) : null}
      {readLabel ? (
        <span className="mt-3 font-sans text-sm font-semibold text-gold-deep underline-offset-4 group-hover:underline">
          {readLabel}
        </span>
      ) : null}
    </Link>
  );
}
