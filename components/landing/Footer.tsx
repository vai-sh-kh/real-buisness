import Link from "next/link";
import { Home } from "lucide-react";

const email = "contact@homefinder.io";
const marqueeText = Array.from({ length: 12 }, () => email).join("  ·  ");

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Properties", href: "#properties" },
  { label: "News", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Scrolling email marquee */}
      <div className="overflow-hidden py-3 select-none border-b border-white/5">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-sm text-white/30 tracking-widest mr-8">{marqueeText}</span>
          <span className="text-sm text-white/30 tracking-widest mr-8" aria-hidden>{marqueeText}</span>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + copyright */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-white mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
                <Home className="h-3.5 w-3.5 text-black" />
              </div>
              DreamHouse
            </Link>
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} homefinder, Inc. All Rights Reserved
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="text-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" aria-label="X" className="text-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
