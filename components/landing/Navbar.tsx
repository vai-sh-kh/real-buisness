"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Info,
  Briefcase,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const navLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "About", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Contact", href: "/contact", icon: MessageCircle },
];

const BOTTOM_NAV_HEIGHT = "4rem";

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar: logo + name (mobile) / full nav + CTA (desktop) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] pt-[env(safe-area-inset-top)]">
        <nav className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 h-14 md:h-[4.5rem] flex items-center justify-between max-w-[1680px] w-full">
          {/* Left: logo + name (no truncation on mobile so title and logo stay full) */}
          <div className="flex flex-1 min-w-0 items-center gap-2 justify-start">
            <Logo
              href="/"
              height={36}
              iconOnly
              className="shrink-0 md:hidden"
              title="The Real Business"
            />
            <Logo
              href="/"
              height={44}
              iconOnly
              className="shrink-0 hidden md:block"
              title="The Real Business"
            />
            <span className="mt-1.5 md:mt-2 whitespace-nowrap text-lg md:text-2xl font-semibold tracking-tight leading-[1.1] text-brand-charcoal">
              The Real Business
            </span>
          </div>

          {/* Center: nav links (desktop only) */}
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
                      : "after:w-0 after:opacity-0 text-muted-foreground hover:text-brand-charcoal",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA (desktop only; mobile uses bottom nav) */}
          <div className="flex flex-1 min-w-0 items-center justify-end">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-brand-charcoal text-white text-sm font-semibold hover:bg-brand-charcoal/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile bottom nav — touch-action for faster tap response */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around border-t border-border bg-white shadow-[0_-1px_6px_rgba(0,0,0,0.06)] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [touch-action:manipulation]"
        style={{ minHeight: BOTTOM_NAV_HEIGHT }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          const isContact = link.href === "/contact";
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={cn(
                "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] sm:text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset",
                isContact && isActive && "text-brand-gold",
                isContact &&
                  !isActive &&
                  "text-muted-foreground active:text-brand-gold",
                !isContact && isActive && "text-brand-charcoal",
                !isContact &&
                  !isActive &&
                  "text-muted-foreground active:text-brand-charcoal",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative flex flex-col items-center gap-0.5">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    isContact && isActive && "bg-brand-gold/15 text-brand-gold",
                    isContact && !isActive && "text-muted-foreground",
                    !isContact && isActive && "text-brand-gold",
                    !isContact && !isActive && "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="h-5 w-5 sm:h-5 sm:w-5 shrink-0"
                    strokeWidth={isActive ? 2.25 : 1.75}
                    aria-hidden
                  />
                </span>
                {isActive && !isContact && (
                  <span
                    className="h-0.5 w-4 rounded-full bg-brand-gold"
                    aria-hidden
                  />
                )}
              </span>
              <span className="truncate max-w-[4rem] sm:max-w-[4.5rem] leading-tight">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
