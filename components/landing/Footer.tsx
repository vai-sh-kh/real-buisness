import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

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

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-14 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo href="/" variant="dark" height={36} />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6 sm:mb-7">
              We provide exceptional real estate services, helping you find the
              perfect property that fits your lifestyle and budget.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="X"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-gold hover:border-brand-gold/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4 sm:mb-5">
              Pages
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4 sm:mb-5">
              Services
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/30 text-center sm:text-left">
            &copy; {new Date().getFullYear()} The Real Business. All Rights
            Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <a
              href="mailto:contact@therealbusiness.com"
              className="text-xs text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              contact@therealbusiness.com
            </a>
            <span className="text-white/10 hidden sm:inline">|</span>
            <Link
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
