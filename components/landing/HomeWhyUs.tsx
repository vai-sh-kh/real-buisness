"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/lib/constants/site";

export function HomeWhyUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-t border-border">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[4/3] max-h-[320px] sm:max-h-[400px] lg:max-h-[480px] rounded-xl sm:rounded-2xl overflow-hidden border border-border shadow-lg order-first">
            <Image
              src="/services-company.jpg"
              alt="Our team and expertise"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-brand-charcoal/20" />
          </div>
          <div className="min-w-0 order-last">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              Why work with us
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-charcoal mt-2 mb-3 sm:mb-4">
              Expertise, transparency, and a commitment to your success
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              We combine local market knowledge with the highest standards of
              service. Whether you are buying, selling, or renting, we guide you
              through every step with clarity and care.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                {CONTACT.contactUsLabel}
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 rounded-xl border-2 border-brand-charcoal text-brand-charcoal font-semibold hover:bg-brand-charcoal hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                About us
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
              <a
                href={`mailto:${CONTACT.email}`}
                className="hover:text-brand-gold transition-colors"
              >
                {CONTACT.email}
              </a>
              {" · "}
              {CONTACT.workingHours.weekdays}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
