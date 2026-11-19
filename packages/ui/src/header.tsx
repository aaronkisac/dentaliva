"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";

import { Button, buttonVariants } from "./button";
import { cn } from "./cn";
import { Link } from "./link";
import { useFocusTrap } from "./use-focus-trap";

export interface NavMenuLink {
  label: string;
  href: string;
}

/** Açılır menü grubu — başlık (opsiyonel) + bağlantı listesi. */
export interface NavMenuGroup {
  heading?: string;
  headingHref?: string;
  links: NavMenuLink[];
}

/** NavLink.menu — gruplu açılır menü + listeleme sayfası bağlantısı. */
export interface NavMenu {
  groups: NavMenuGroup[];
  all?: NavMenuLink;
}

export interface NavLink {
  label: string;
  href: string;
  children?: Array<NavMenuLink>;
  menu?: NavMenu;
}

/**
 * Brand lockup shown as the home link. `srcDark` is the variant rendered while
 * the header is transparent over the dark home hero (DSN-58: the original
 * Dentaliva logo ships as a light and a white file); alt text comes from the
 * caller — the package hardcodes no copy.
 */
export interface HeaderLogo {
  src: string;
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * DSN-97: bayraklı dil toggle'ının bayrak kimlikleri — orijinal sitedeki
 * sıranın karşılığı. TR bayrağı com'u (Türkçe), GB bayrağı eu'yu (İngilizce),
 * NL bayrağı nl'yi (Felemenkçe) temsil eder; bayraklar inline SVG'dir
 * (flag-icons yolları — sıfır istek, orijinal Elementor toggle'ının
 * kullandığı kütüphane).
 */
export type HeaderFlag = "tr" | "gb" | "nl";

/** Çapraz-domain dil girişi; etiket dil ottonimidir (Türkçe/English/…). */
export interface HeaderLanguage {
  flag: HeaderFlag;
  /** O dile ait sitenin bugünkü served adresi. */
  url: string;
  label: string;
  /** Bu header'ın kendi sitesi — bağlantı değil, geçerli dil işareti. */
  active?: boolean;
}

export interface HeaderProps {
  items: NavLink[];
  cta?: { label: string; href: string };
  logo: HeaderLogo;
  contact?: { phone: string; email: string };
  /** Locale chrome copy — the package hardcodes no language (i18n-ready). */
  labels: { toggleMenu: string; closeMenu: string; languageSwitcher?: string };
  /** Cross-domain language switcher (DSN-97) — verilmeyince hiç render edilmez. */
  languages?: HeaderLanguage[];
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FlagTR({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 480" className={className}>
      <g fillRule="evenodd">
        <path fill="#e30a17" d="M0 0h640v480H0z" />
        <path
          fill="#fff"
          d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"
        />
        <path
          fill="#e30a17"
          d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"
        />
        <path
          fill="#fff"
          d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"
        />
      </g>
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 480" className={className}>
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#fff"
        d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
      />
      <path
        fill="#c8102e"
        d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
      />
      <path fill="#fff" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#c8102e" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </svg>
  );
}

function FlagNL({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 480" className={className}>
      <path fill="#ae1c28" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#21468b" d="M0 320h640v160H0z" />
    </svg>
  );
}

const FLAGS: Record<HeaderFlag, ComponentType<{ className?: string }>> = {
  tr: FlagTR,
  gb: FlagGB,
  nl: FlagNL,
};

/**
 * DSN-97: orijinal sitedeki bayraklı dil toggle'ı — her bayrak o dilin
 * alan adına gider. Harici adresler ui Link marka kuralıyla target=_blank
 * açılır (orijinal Elementor toggle'ı da target=_blank kullanıyordu).
 * Geçerli dil bağlantı değil, altın çerçeveli işarettir.
 */
function LanguageSwitcher({
  languages,
  label,
  dark,
  className,
}: {
  languages: HeaderLanguage[];
  label?: string;
  dark: boolean;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn("flex items-center gap-2", className)}>
      {languages.map((lang) => {
        const Flag = FLAGS[lang.flag];
        const ringClass = lang.active ? "ring-gold" : dark ? "ring-ivory/25" : "ring-ink/15";
        const flag = (
          <Flag
            className={cn(
              "block h-[18px] w-6 rounded-[2px] ring-1 ring-inset",
              ringClass,
              !lang.active && "opacity-80",
            )}
          />
        );
        if (lang.active) {
          return (
            <span key={lang.url} aria-current="true" title={lang.label} className="flex">
              {flag}
            </span>
          );
        }
        return (
          <Link
            key={lang.url}
            href={lang.url}
            aria-label={lang.label}
            title={lang.label}
            className="flex transition-opacity hover:opacity-100"
          >
            {flag}
          </Link>
        );
      })}
    </nav>
  );
}

function DesktopDropdown({ item, dark }: { item: NavLink; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      // v8 ignore next 3 — the ref is always mounted while this listener exists
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "whitespace-nowrap px-3 py-2 font-sans text-sm",
          dark ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep",
        )}
      >
        {item.label}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-[var(--dvn-z-header)] min-w-56 border border-[var(--dvn-line-gold)] bg-white p-2 shadow-[var(--dvn-shadow-soft)]">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block whitespace-nowrap px-3 py-2 text-sm text-ink hover:bg-ivory"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const MEGA_PANEL_ID = "dvn-mega-panel";

function DesktopMegaTrigger({
  item,
  dark,
  open,
  onToggle,
}: {
  item: NavLink;
  dark: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={MEGA_PANEL_ID}
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-sans text-sm",
        dark ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep",
      )}
    >
      {item.label}
      <ChevronIcon
        className={cn(
          "transition-transform duration-[var(--dvn-duration-base)]",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

/**
 * Tam genişlik mega panel — header çubuğunun altında, container ızgarasında
 * grup sütunları. Başlıksız grup da başlık yüksekliği kadar aşağıdan başlar;
 * sütunlar hizalı kalır.
 */
function MegaPanel({ menu, onClose }: { menu: NavMenu; onClose: () => void }) {
  return (
    <div
      id={MEGA_PANEL_ID}
      className="absolute inset-x-0 top-full hidden border-b border-[var(--dvn-line-gold)] bg-white shadow-[var(--dvn-shadow-soft)] xl:block"
    >
      <div className="mx-auto grid max-w-[var(--dvn-container-max)] grid-cols-2 gap-x-8 gap-y-6 px-[var(--dvn-container-gutter)] py-6 md:grid-cols-4">
        {menu.groups.map((group) => (
          <div key={group.heading ?? group.links[0]?.href}>
            <div className="mb-2 min-h-6">
              {group.heading ? (
                group.headingHref ? (
                  <Link
                    href={group.headingHref}
                    onClick={onClose}
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-navy hover:text-gold-deep"
                  >
                    {group.heading}
                  </Link>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-navy">
                    {group.heading}
                  </span>
                )
              ) : null}
            </div>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block whitespace-nowrap py-1 text-sm text-ink/80 hover:text-gold-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {menu.all ? (
        <div className="border-t border-[var(--dvn-line-soft)]">
          <div className="mx-auto max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)] py-3">
            <Link
              href={menu.all.href}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm font-medium text-gold-deep hover:text-navy"
            >
              {menu.all.label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileNavItem({
  item,
  dark,
  onClose,
}: {
  item: NavLink;
  dark: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const linkClass = cn("block px-2 py-3 text-base", dark ? "text-ivory" : "text-navy");

  if (!item.menu) {
    return (
      <>
        <Link href={item.href} className={linkClass} onClick={onClose}>
          {item.label}
        </Link>
        {item.children?.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={cn("block px-6 py-2 text-sm", dark ? "text-ivory/70" : "text-muted")}
            onClick={onClose}
          >
            {child.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-center justify-between px-2 py-3 text-base",
          dark ? "text-ivory" : "text-navy",
        )}
      >
        {item.label}
        <ChevronIcon
          className={cn(
            "h-4 w-4 transition-transform duration-[var(--dvn-duration-base)]",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="ml-2 border-l border-[var(--dvn-line-soft)] pb-2 pl-3">
          {item.menu.all ? (
            <Link
              href={item.menu.all.href}
              onClick={onClose}
              className={cn(
                "block px-2 py-2 text-sm font-medium",
                dark ? "text-gold-soft" : "text-gold-deep",
              )}
            >
              {item.menu.all.label}
            </Link>
          ) : null}
          {item.menu.groups.map((group) => (
            <div key={group.heading ?? group.links[0]?.href} className="mt-2">
              {group.heading ? (
                group.headingHref ? (
                  <Link
                    href={group.headingHref}
                    onClick={onClose}
                    className={cn(
                      "block px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
                      dark ? "text-ivory/90" : "text-navy",
                    )}
                  >
                    {group.heading}
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
                      dark ? "text-ivory/90" : "text-navy",
                    )}
                  >
                    {group.heading}
                  </div>
                )
              ) : null}
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn("block px-4 py-1.5 text-sm", dark ? "text-ivory/70" : "text-muted")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function MobileMenu({
  items,
  phone,
  cta,
  dark,
  onClose,
  labels,
  languages,
}: {
  items: NavLink[];
  phone?: string;
  cta?: HeaderProps["cta"];
  dark: boolean;
  onClose: () => void;
  labels: HeaderProps["labels"];
  languages?: HeaderLanguage[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);

  return (
    <div
      ref={ref}
      className={cn(
        "border-t xl:hidden",
        dark ? "border-gold/30 bg-navy" : "border-[var(--dvn-line-soft)] bg-ivory",
      )}
    >
      <nav aria-label="Mobile" className="px-4 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <MobileNavItem item={item} dark={dark} onClose={onClose} />
            </li>
          ))}
        </ul>
        {languages && languages.length > 1 ? (
          <LanguageSwitcher
            languages={languages}
            label={labels.languageSwitcher}
            dark={dark}
            className="mt-4"
          />
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className={cn(
              "mt-4 flex items-center gap-2 px-2 py-2 text-sm",
              dark ? "text-ivory/80" : "text-ink",
            )}
          >
            <PhoneIcon />
            {phone}
          </a>
        ) : null}
        {/* DSN-23: altın slot randevu aksiyonuna ait — kapatma burger/Escape ile. */}
        {cta ? (
          <Link
            href={cta.href}
            className={cn(buttonVariants({ variant: "gold", size: "md" }), "mt-4 w-full")}
            onClick={onClose}
          >
            {cta.label}
          </Link>
        ) : (
          <Button className="mt-4 w-full" onClick={onClose}>
            {labels.closeMenu}
          </Button>
        )}
      </nav>
    </div>
  );
}

/**
 * Site header — DSN-10: ReoDental-pattern navigation
 * (logo mark | centered links | phone + outlined CTA). Dark variant on the
 * home route (solid espresso, merging with the hero); light ivory/blur
 * variant elsewhere. Sticky on both.
 */
/**
 * DSN-11: header durumu — ana sayfada hero boyunca şeffaf (açık metin),
 * hero bitince (scroll eşiği) ışık ivory + blur; iç sayfalarda her zaman ışık.
 * DSN-23: mobil menünün altın slotu randevu CTA'sıdır (cta prop'u varsa);
 * menü burger toggle, Escape veya bağlantı tıklamasıyla kapanır. Burger
 * unicode değil SVG ikondur; durum aria-expanded ile bildirilir (APG pattern).
 * Gruplu açılır menü (mega panel) header seviyesinde tek state ile yönetilir;
 * Escape ve dış tıklama kapatır (APG disclosure).
 * DSN-60: masaüstü chrome'u (nav + telefon + CTA) xl(1280) altında gizli —
 * tek satırlık satır ihtiyacı en geniş yerel (EN) için ~1166px'tir ve 1280
 * altındaki kullanılabilir genişlik bunu karşılayamaz; etiketler İKİ SATIRA
 * sarılıyordu. 1280 altı burger + mobil mega akordeonla hizmet verir. Tüm
 * satır öğeleri nowrap'dır — sarma imkânsız, taşma olursa flex sıkıştırır.
 */
export function headerMode(
  pathname: string,
  scrollY: number,
  viewportHeight: number,
): "dark" | "light" {
  if (pathname !== "/") return "light";
  return scrollY > Math.max(viewportHeight - 84, 120) ? "light" : "dark";
}

export function Header({ items, cta, logo, contact, labels, languages }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  // PRF-5: başlangıç değeri SSR ile aynı kuraldan gelir (scrollY=0, vh=800) —
  // render içinde window okunmaz, hidrasyon eşleşir.
  const [dark, setDark] = useState(() => headerMode(pathname ?? "/", 0, 800) === "dark");

  // PRF-5: state boolean — yalnızca eşik geçişinde render olur; her scroll
  // karesi değil. Gerçek viewport ölçümü efekttedir (resize'da da güncellenir).
  useEffect(() => {
    const update = () => {
      setDark(headerMode(pathname ?? "/", window.scrollY, window.innerHeight) === "dark");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Mega panel açıkken dış tıklama ve Escape kapatır — APG disclosure.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      // v8 ignore next 3 — the ref is always mounted while this listener exists
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  // PRF-5: stabil identity — aksi halde her Header render'ı (scroll'da)
  // useFocusTrap efektini yeniden koşturup odağı menünün ilk bağlantısına
  // çalar ve "restores focus" zincirini bozar.
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  const closeOpenMenu = useCallback(() => setOpenMenu(null), []);

  const onHome = pathname === "/";
  const openMenuItem = openMenu
    ? items.find((item) => item.href === openMenu && item.menu)
    : undefined;

  const linkClass = dark ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep";
  const ctaClass = dark
    ? "border-[1.5px] border-ivory/40 text-ivory hover:border-gold hover:text-gold-soft"
    : "border-[1.5px] border-ink/30 text-ink hover:border-gold-deep hover:text-gold-deep";

  // Ana sayfada header hero'nun ÜZERİNDE sabit durur (şeffaf → scroll'da ışık);
  // iç sayfalarda akışta kalır (sticky + ışık).
  const positionClass = onHome ? "fixed inset-x-0 top-0" : "sticky top-0";

  return (
    <header
      ref={headerRef}
      className={cn(
        positionClass,
        "z-[var(--dvn-z-header)] border-b transition-colors duration-[var(--dvn-duration-base)]",
        dark
          ? "border-transparent bg-transparent"
          : "border-[var(--dvn-line-soft)] bg-ivory/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-[var(--dvn-header-h)] max-w-[var(--dvn-container-max)] items-center justify-between gap-6 px-[var(--dvn-container-gutter)]">
        {/* DSN-58: orijinal marka kilidi (kuğu logosu) home bağlantısıdır —
            header'da daha önce link yoktu. Varyant dark/light durumunu izler:
            şeffaf hero üstünde beyaz, ışık header'da renkli. Kaynak dosya
            yerel public asset'idir; Sanity custom loader'ı yalnız CDN
            görsellerini hedefler, bu yüzden düz img. */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src={dark ? (logo.srcDark ?? logo.src) : logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-11 w-auto"
          />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {items.map((item) =>
            item.menu ? (
              <DesktopMegaTrigger
                key={item.href}
                item={item}
                dark={dark}
                open={openMenu === item.href}
                onToggle={() =>
                  setOpenMenu((current) => (current === item.href ? null : item.href))
                }
              />
            ) : item.children ? (
              <DesktopDropdown key={item.href} item={item} dark={dark} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn("whitespace-nowrap px-3 py-2 text-sm", linkClass)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden items-center gap-5 xl:flex">
          {/* DSN-97: tek dilli sitede toggle'ın anlamı yok — en az iki dil. */}
          {languages && languages.length > 1 ? (
            <LanguageSwitcher languages={languages} label={labels.languageSwitcher} dark={dark} />
          ) : null}
          {contact?.phone ? (
            <a
              href={`tel:${contact.phone}`}
              className={cn("flex items-center gap-2 whitespace-nowrap text-sm", linkClass)}
            >
              <PhoneIcon />
              {contact.phone}
            </a>
          ) : null}
          {cta ? (
            <Link href={cta.href} className={cn("whitespace-nowrap px-5 py-2.5 text-sm", ctaClass)}>
              {cta.label}
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label={labels.toggleMenu}
          onClick={() => setMobileOpen((open) => !open)}
          className={cn("px-2 py-3 xl:hidden", dark ? "text-ivory" : "text-navy")}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {openMenuItem?.menu ? <MegaPanel menu={openMenuItem.menu} onClose={closeOpenMenu} /> : null}
      {mobileOpen ? (
        <MobileMenu
          items={items}
          phone={contact?.phone}
          cta={cta}
          dark={dark}
          onClose={closeMobileMenu}
          labels={labels}
          languages={languages}
        />
      ) : null}
    </header>
  );
}
