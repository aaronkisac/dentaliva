"use client";

import { useEffect, useRef, useState } from "react";

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

function DesktopDropdown({ item }: { item: NavLink }) {
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
        className="px-3 py-2 font-sans text-sm text-navy hover:text-gold-deep"
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

function MobileMenu({ items, onClose }: { items: NavLink[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);

  return (
    <div ref={ref} className="border-t border-[var(--dvn-line-gold)] bg-ivory md:hidden">
      <nav aria-label="Mobile" className="px-4 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-2 py-3 text-base text-navy"
                onClick={onClose}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-6 py-2 text-sm text-muted"
                  onClick={onClose}
                >
                  {child.label}
                </Link>
              ))}
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full" onClick={onClose}>
          Close menu
        </Button>
      </nav>
    </div>
  );
}

/** Site header: contact top bar, desktop nav with dropdown, mobile menu. */
export function Header({ items, cta, logo, contact }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-[var(--dvn-line-soft)] bg-white">
      {contact ? (
        <div className="bg-navy px-4 py-2 text-center font-sans text-xs text-white">
          <a href={`tel:${contact.phone}`} className="hover:text-gold-soft">
            {contact.phone}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${contact.email}`} className="hover:text-gold-soft">
            {contact.email}
          </a>
        </div>
      ) : null}
      <div className="mx-auto flex h-[var(--dvn-header-h)] max-w-[var(--dvn-container-max)] items-center justify-between px-[var(--dvn-container-gutter)]">
        {logo}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.href} item={item} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-navy hover:text-gold-deep"
              >
                {item.label}
              </Link>
            ),
          )}
          {cta ? (
            <Link href={cta.href} className="ml-3">
              <Button>{cta.label}</Button>
            </Link>
          ) : null}
        </nav>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((open) => !open)}
          className={cn("px-2 py-3 text-navy md:hidden")}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {mobileOpen ? <MobileMenu items={items} onClose={() => setMobileOpen(false)} /> : null}
    </header>
  );
}
