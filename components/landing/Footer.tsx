import Link from "next/link";
import {
  SITE_NAME,
  SOCIAL_LINKS,
  CONTACT,
  LEGAL_LINKS,
} from "@/lib/constants/site";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { SocialPlatform } from "@/lib/constants/site";

const pages = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Buy Property", href: "/properties?type=sale" },
  { label: "Rent Property", href: "/properties?type=rent" },
  { label: "Property Valuation", href: "/contact" },
  { label: "Investment Advice", href: "/contact" },
  { label: "Property Management", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 sm:pt-20 pb-24 md:pb-10">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 sm:pb-14 border-b border-white/15">
          <div className="lg:col-span-2">
            {/* Text logo - white */}
            <Link
              href="/"
              className="inline-block mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal rounded"
            >
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white uppercase leading-tight">
                <span className="block">The Real</span>
                <span className="block">Business</span>
              </span>
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mb-7 sm:mb-8">
              We provide exceptional real estate services, helping you find the
              perfect property that fits your lifestyle and budget.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm uppercase tracking-widest text-white/50 mb-5 sm:mb-6 font-medium">
              Pages
            </div>
            <ul className="space-y-3 sm:space-y-3.5">
              {pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-3 min-h-[44px] flex items-center inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm uppercase tracking-widest text-white/50 mb-5 sm:mb-6 font-medium">
              Services
            </div>
            <ul className="space-y-3 sm:space-y-3.5">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-white/60 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-3 min-h-[44px] flex items-center inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-sm text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-6">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm text-white/40 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              {CONTACT.email}
            </a>
            <span className="text-white/20 hidden sm:inline">|</span>
            <Link
              href={LEGAL_LINKS.privacy}
              className="text-sm text-white/40 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href={LEGAL_LINKS.terms}
              className="text-sm text-white/40 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
