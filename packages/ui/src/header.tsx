"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "./button";
import { cn } from "./cn";
import { Link } from "./link";
import { useFocusTrap } from "./use-focus-trap";

export interface NavLink {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
}

export interface HeaderProps {
  items: NavLink[];
  cta?: { label: string; href: string };
  logo: React.ReactNode;
  contact?: { phone: string; email: string };
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
          "px-3 py-2 font-sans text-sm",
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
              className="block px-3 py-2 text-sm text-ink hover:bg-ivory"
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

function MobileMenu({
  items,
  phone,
  dark,
  onClose,
}: {
  items: NavLink[];
  phone?: string;
  dark: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);

  return (
    <div
      ref={ref}
      className={cn(
        "border-t md:hidden",
        dark ? "border-gold/30 bg-navy" : "border-[var(--dvn-line-soft)] bg-ivory",
      )}
    >
      <nav aria-label="Mobile" className="px-4 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn("block px-2 py-3 text-base", dark ? "text-ivory" : "text-navy")}
                onClick={onClose}
              >
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
            </li>
          ))}
        </ul>
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
        <Button className="mt-4 w-full" onClick={onClose}>
          Close menu
        </Button>
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
export function Header({ items, cta, logo, contact }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dark = pathname === "/";

  const linkClass = dark ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep";
  const ctaClass = dark
    ? "border-[1.5px] border-ivory/40 text-ivory hover:border-gold hover:text-gold-soft"
    : "border-[1.5px] border-ink/30 text-ink hover:border-gold-deep hover:text-gold-deep";

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--dvn-z-header)] border-b",
        dark ? "border-gold/20 bg-navy" : "border-[var(--dvn-line-soft)] bg-ivory/95 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-[var(--dvn-header-h)] max-w-[var(--dvn-container-max)] items-center justify-between gap-6 px-[var(--dvn-container-gutter)]">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center bg-gold font-serif text-xl font-bold text-navy"
          >
            D
          </span>
          {logo}
        </div>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.href} item={item} dark={dark} />
            ) : (
              <Link key={item.href} href={item.href} className={cn("px-3 py-2 text-sm", linkClass)}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          {contact?.phone ? (
            <a
              href={`tel:${contact.phone}`}
              className={cn("flex items-center gap-2 text-sm", linkClass)}
            >
              <PhoneIcon />
              {contact.phone}
            </a>
          ) : null}
          {cta ? (
            <Link href={cta.href} className={cn("px-5 py-2.5 text-sm", ctaClass)}>
              {cta.label}
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((open) => !open)}
          className={cn("px-2 py-3 md:hidden", dark ? "text-ivory" : "text-navy")}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {mobileOpen ? (
        <MobileMenu
          items={items}
          phone={contact?.phone}
          dark={dark}
          onClose={() => setMobileOpen(false)}
        />
      ) : null}
    </header>
  );
}
