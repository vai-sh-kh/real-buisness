"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ABOUT } from "@/lib/constants/site";

export function Hero() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [search, setSearch] = useState("");

  return (
    <section
      className="relative w-full overflow-hidden bg-brand-charcoal flex flex-col"
      style={{
        minHeight: "min(55vh, 460px)",
        maxHeight: "min(68vh, 620px)",
      }}
      aria-label="Hero"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-home.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-charcoal/55" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-0 max-w-[1680px] mx-auto w-full px-4 xs:px-5 sm:px-6 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-10">
        {/* Content row: heading + tagline/CTA — compact, mobile-first */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5 md:gap-6 flex-shrink-0">
          <div className="min-w-0 lg:max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
            >
              <span className="h-px w-6 sm:w-8 bg-brand-gold/60 inline-block shrink-0" />
              <span className="text-brand-gold/90 text-[10px] xs:text-[11px] sm:text-xs tracking-[0.18em] uppercase">
                Premium Real Estate
              </span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-bold text-white leading-[1.05] tracking-tight"
            >
              Find a place
              <br />
              you will call{" "}
              <span className="italic font-light">home.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:max-w-[260px] flex flex-col gap-3 sm:gap-4"
          >
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              Not just accommodation — a place where your new life begins, with
              comfort and possibility.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[46px] w-full sm:w-auto bg-brand-gold text-white text-sm sm:text-base font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal transition-colors"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* Trust / value line — added content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 sm:mt-4 text-white/60 text-xs sm:text-sm"
        >
          <span>{ABOUT.yearsExperience}+ years experience</span>
          <span className="hidden xs:inline" aria-hidden>·</span>
          <span>Buy · Rent · Invest</span>
          <span className="hidden xs:inline" aria-hidden>·</span>
          <Link
            href="/about"
            className="text-brand-gold/90 hover:text-brand-gold font-medium transition-colors"
          >
            Our story
          </Link>
        </motion.div>

        {/* Search bar — always visible, compact on small screens */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-5 md:mt-6 flex-shrink-0"
        >
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 shadow-xl">
            <div className="flex bg-muted rounded-md sm:rounded-lg p-1 shrink-0">
              {(["buy", "rent"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 sm:flex-none min-h-[44px] sm:min-h-[42px] px-3 sm:px-4 md:px-5 py-2.5 sm:py-2 text-sm font-semibold rounded-md capitalize transition-all focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2",
                    activeTab === tab
                      ? "bg-brand-charcoal text-white shadow-sm"
                      : "text-muted-foreground hover:text-brand-charcoal",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-h-[44px] sm:min-h-[42px] px-3 sm:px-4 min-w-0 rounded-md sm:rounded-lg bg-muted/80 sm:bg-transparent">
              <Search
                className="h-4 w-4 text-muted-foreground shrink-0"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search property or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 text-sm sm:text-base outline-none text-foreground placeholder:text-muted-foreground bg-transparent"
                aria-label="Search property or location"
              />
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[42px] px-4 sm:px-5 py-2.5 rounded-md sm:rounded-lg border border-border text-sm sm:text-base text-foreground hover:border-brand-gold/50 hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              >
                <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
                <span>Filters</span>
              </button>
              <Link
                href={`/properties?type=${activeTab}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                className="flex items-center justify-center min-h-[44px] sm:min-h-[42px] bg-brand-charcoal text-white text-sm sm:text-base font-semibold px-4 sm:px-5 md:px-6 py-2.5 rounded-md sm:rounded-lg hover:bg-brand-charcoal/90 focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2 transition-colors"
              >
                Show Properties
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
