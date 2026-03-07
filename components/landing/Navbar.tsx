"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100",
      )}
    >
      <nav className="mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between max-w-7xl">
        <div className="flex min-w-0 flex-1 items-center gap-3 shrink-0">
          <Logo
            href="/"
            height={36}
            iconOnly
            className="shrink-0"
            title="The Real Business"
          />
          <p
            className={cn(
              "hidden sm:block truncate text-lg font-semibold leading-tight sm:text-xl",
              isTransparent ? "text-white" : "text-brand-charcoal",
            )}
          >
            The Real Business
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-base transition-colors py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
                isTransparent
                  ? cn(
                      "text-white/80 hover:text-white",
                      pathname === link.href && "text-white font-semibold",
                    )
                  : cn(
                      "text-gray-600 hover:text-brand-charcoal",
                      pathname === link.href &&
                        "text-brand-charcoal font-semibold",
                    ),
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link
            href="/contact"
            className={cn(
              "text-base font-semibold px-5 py-3 sm:px-6 rounded-full transition-opacity min-h-[44px] flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
              isTransparent
                ? "bg-brand-gold text-white hover:opacity-90"
                : "bg-brand-charcoal text-white hover:opacity-90",
            )}
          >
            Get Started
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>

        <button
          type="button"
          className={cn(
            "md:hidden p-2.5 -mr-2.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
            isTransparent ? "text-white" : "text-brand-charcoal",
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          role="dialog"
          aria-label="Mobile menu"
        >
          <div className="px-4 py-4 space-y-0 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center text-base py-3.5 px-2 rounded-lg min-h-[44px] border-b border-gray-50 last:border-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset",
                  pathname === link.href
                    ? "text-brand-charcoal font-semibold bg-gray-50/50"
                    : "text-gray-600 hover:text-brand-charcoal hover:bg-gray-50/50",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full text-base bg-brand-charcoal text-white font-semibold rounded-full py-3.5 hover:bg-brand-charcoal/90 min-h-[44px]"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
