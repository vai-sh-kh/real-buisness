import Link from "next/link";
import {
  SITE_NAME,
  SOCIAL_LINKS,
  CONTACT,
  LEGAL_LINKS,
} from "@/lib/constants/site";
import type { SocialPlatform } from "@/lib/constants/site";

const pages = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Buy Property", href: "/properties?type=sale" },
  { label: "Rent Property", href: "/properties?type=rent" },
  { label: "Property Valuation", href: "/contact" },
  { label: "Investment Advice", href: "/contact" },
  { label: "Property Management", href: "/contact" },
];

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const className = "h-4 w-4";
  switch (platform) {
    case "facebook":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      );
    case "x":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 sm:pt-20 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 sm:pb-14 border-b border-white/15">
          <div className="lg:col-span-2">
            {/* Text logo - white */}
            <Link
              href="/"
              className="inline-block mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
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
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
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
                    className="text-base text-white/60 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-1 inline-block"
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
                    className="text-base text-white/60 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-1 inline-block"
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
