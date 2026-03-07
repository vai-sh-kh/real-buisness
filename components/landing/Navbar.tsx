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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100",
      )}
    >
      <nav className="mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Logo
          variant={isTransparent ? "dark" : "light"}
          height={32}
          className={isTransparent ? undefined : "h-8"}
        />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                isTransparent
                  ? cn(
                      "text-white/60 hover:text-white",
                      pathname === link.href && "text-white font-medium",
                    )
                  : cn(
                      "text-gray-500 hover:text-brand-charcoal",
                      pathname === link.href &&
                        "text-brand-charcoal font-semibold",
                    ),
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Admin + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/login"
            className={cn(
              "text-xs transition-colors",
              isTransparent
                ? "text-white/40 hover:text-white/60"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            Admin
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-semibold px-5 py-2 rounded-full transition-colors",
              isTransparent
                ? "bg-brand-gold text-white hover:opacity-90"
                : "bg-brand-charcoal text-white hover:opacity-90",
            )}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            "md:hidden p-1",
            isTransparent ? "text-white" : "text-brand-charcoal",
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-sm py-3 border-b border-gray-50 last:border-0 transition-colors",
                  pathname === link.href
                    ? "text-brand-charcoal font-semibold"
                    : "text-gray-600 hover:text-brand-charcoal",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex gap-3">
              <Link
                href="/admin/login"
                className="flex-1 text-center text-xs border border-gray-200 rounded-full py-2.5 text-gray-500"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/contact"
                className="flex-1 text-center text-sm bg-brand-charcoal text-white font-semibold rounded-full py-2.5 hover:bg-brand-charcoal/90"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
