"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <nav className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 h-20 sm:h-[5.25rem] flex items-center justify-between max-w-[1680px] w-full">
        {/* Left: logo + name */}
        <div className="flex flex-1 min-w-0 items-center gap-2 justify-start">
          <Logo
            href="/"
            height={44}
            iconOnly
            className="shrink-0"
            title="The Real Business"
          />
          <span className="mt-2 truncate text-xl font-semibold tracking-tight leading-[1.1] sm:text-2xl text-brand-charcoal">
            The Real Business
          </span>
        </div>

        {/* Center: nav links */}
        <div className="hidden md:flex shrink-0 items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative whitespace-nowrap text-[15px] font-medium py-3 px-5 sm:px-6 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 transition-colors duration-200",
                  "after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-current after:transition-all after:duration-300 after:ease-out",
                  isActive
                    ? "after:w-4/5 after:opacity-100 text-brand-charcoal font-semibold"
                    : "after:w-0 after:opacity-0 text-neutral-600 hover:text-brand-charcoal",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: CTA on desktop, menu button on mobile */}
        <div className="flex flex-1 min-w-0 items-center justify-end gap-3">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-charcoal text-white text-sm font-semibold hover:bg-brand-charcoal/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 transition-colors"
          >
            Get in Touch
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2.5 rounded-lg transition-colors text-brand-charcoal hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-neutral-100 bg-white px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-3 px-4 rounded-lg text-base font-medium transition-colors border-l-2 -ml-px pl-[15px]",
                    isActive &&
                      "border-current font-semibold text-brand-charcoal border-brand-charcoal",
                    !isActive &&
                      "text-neutral-700 hover:bg-neutral-100 hover:text-brand-charcoal border-transparent",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center py-3 px-4 rounded-lg bg-brand-charcoal text-white text-base font-semibold hover:bg-brand-charcoal/90"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
