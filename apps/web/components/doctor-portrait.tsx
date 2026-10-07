import Image from "next/image";

import { cn } from "@dentaliva/ui";

export interface DoctorPortraitPhoto {
  ref?: string;
  lqip?: string;
}

/**
 * DSN-43: hekim portresi — foto varsa next/image (lqip blur), yoksa markalı
 * baş harf monogramı (espresso zemin, serif altın baş harfler). Foto
 * Sanity'ye sonradan eklendiğinde sıradaki build'de otomatik görünür;
 * bileşen yalnızca veriye bakar. Baş harfler unvan öneklerini atıp isimden
 * türetilir (Türkçe büyük harf kurallarıyla).
 */

/** "Dr. Dt. Emel Özdemir" -> "EO" · "Dt. Şehmus Saygın" -> "ŞS" · boşsa "D". */
export function monogramInitials(name?: string): string {
  const given = (name ?? "").replace(/\b(?:Dr|Dt)\.?\s*/gi, " ").trim();
  if (!given) return "D";
  const letters = given
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR"));
  return letters.join("") || "D";
}

export function DoctorPortrait({
  name,
  photo,
  alt,
  frameClassName,
  imageClassName,
  initialsClassName,
  width,
  height,
  sizes,
  priority,
}: {
  name?: string;
  photo?: DoctorPortraitPhoto;
  alt?: string;
  /** İki dalda da taşınan çerçeve sınıfları (oran, kenarlık, boyut). */
  frameClassName?: string;
  /** Yalnızca foto dalında — nesne kırpma vb. */
  imageClassName?: string;
  /** Monogram baş harf boyutu (token ölçeğinden verilir). */
  initialsClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  if (photo?.ref) {
    return (
      <Image
        src={photo.ref}
        alt={alt ?? ""}
        width={width ?? 600}
        height={height ?? 400}
        sizes={sizes}
        priority={priority}
        placeholder={photo.lqip ? "blur" : "empty"}
        blurDataURL={photo.lqip}
        className={cn("object-cover", frameClassName, imageClassName)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center bg-navy", frameClassName)}
    >
      <span
        className={cn(
          "font-serif text-gold-soft",
          initialsClassName ?? "text-[length:var(--dvn-text-display-md-size)]",
        )}
      >
        {monogramInitials(name)}
      </span>
    </div>
  );
}
