import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { CONTACT } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "How It Works — The Real Business",
  description:
    "Learn how we help you find and secure your perfect property — from research to closing the deal.",
};

const steps = [
  {
    number: "01",
    title: "Research Market",
    description:
      "Explore neighborhoods, property types, and prices to find the right real estate opportunities. Our team provides market insights, neighborhood guides, and tailored recommendations so you can make informed decisions.",
  },
  {
    number: "02",
    title: "Secure Financing",
    description:
      "Arrange mortgage options and gather necessary funds for a smooth purchase or lease. We connect you with trusted financial partners and help you understand your budget and financing options.",
  },
  {
    number: "03",
    title: "Close the Deal",
    description:
      "Finalize paperwork, negotiate terms, and complete your real estate transaction. We guide you through every step — from offer to closing — so the process is clear and stress-free.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-charcoal pt-20 pb-24 px-4 sm:px-6 lg:px-16 xl:px-24 overflow-hidden">
        <div className="max-w-[1680px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                Process
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                How it
                <br />
                <span className="italic font-light">works</span>
              </h1>
            </div>
            <div className="lg:max-w-xs">
              <p className="text-white/50 text-base leading-relaxed">
                From first search to keys in hand — we make your property
                journey simple, transparent, and successful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-[1680px] mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-16 sm:space-y-20">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col sm:flex-row gap-8 sm:gap-12 border-b border-border pb-16 sm:pb-20 last:border-0 last:pb-0"
                >
                  <div className="sm:w-24 shrink-0">
                    <span className="text-xs text-brand-gold font-semibold tracking-widest uppercase">
                      {step.number}
                    </span>
                    <div className="h-px w-12 bg-brand-gold/50 mt-2" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-charcoal mb-4">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-[1680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-charcoal mb-3">
              Ready to find your home?
            </h2>
            <p className="text-muted-foreground text-base max-w-md">
              Browse our properties or get in touch — we&apos;re here to help
              every step of the way.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-brand-charcoal text-white text-base font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              View properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] border border-brand-charcoal text-brand-charcoal text-base font-semibold px-7 py-3.5 rounded-full hover:bg-brand-charcoal hover:text-white transition-colors"
            >
              {CONTACT.contactUsLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
