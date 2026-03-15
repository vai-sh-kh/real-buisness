"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
        minHeight: "min(70vh, 520px)",
        maxHeight: "min(92vh, 880px)",
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

      <div className="relative z-10 flex flex-col flex-1 min-h-0 max-w-[1680px] mx-auto w-full px-4 xs:px-5 sm:px-6 lg:px-16 xl:px-24 pt-5 sm:pt-8 md:pt-10 pb-[env(safe-area-inset-bottom)]">
        {/* Text above the white box — clear separation from search */}
        <div className="flex-shrink-0 mb-4 sm:mb-6 md:mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
          >
            <span className="h-px w-6 sm:w-8 bg-brand-gold/60 inline-block shrink-0" />
            <span className="text-brand-gold/90 text-[11px] xs:text-xs sm:text-xs tracking-[0.16em] sm:tracking-[0.18em] uppercase">
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
            className="font-heading text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-bold text-white leading-[1.08] tracking-tight min-w-0"
          >
            Find a place
            <br />
            you will call <span className="italic font-light">home.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 sm:mt-4 text-white/70 text-[13px] sm:text-sm"
          >
            <span className="tabular-nums">{ABOUT.yearsExperience}+ years</span>
            <span className="text-white/40" aria-hidden>
              ·
            </span>
            <span>Buy · Rent · Invest</span>
            <span className="text-white/40" aria-hidden>
              ·
            </span>
            <Link
              href="/about"
              className="text-brand-gold font-medium hover:text-brand-gold/90 active:opacity-80 py-1 -my-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal transition-colors"
            >
              Our story
            </Link>
          </motion.div>
        </div>

        {/* Search: white box at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-auto pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8 lg:pb-10 flex-shrink-0"
        >
          <div className="bg-white rounded-xl sm:rounded-xl md:rounded-2xl p-3 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2 shadow-xl border border-white/10">
            <div className="flex bg-muted rounded-lg sm:rounded-lg p-1 shrink-0">
              {(["buy", "rent"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 sm:flex-none min-h-[48px] sm:min-h-[42px] px-4 sm:px-5 py-3 sm:py-2 text-sm font-semibold rounded-md capitalize transition-all focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2",
                    activeTab === tab
                      ? "bg-brand-charcoal text-white shadow-sm"
                      : "text-muted-foreground hover:text-brand-charcoal",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-1 min-h-[48px] sm:min-h-[42px] px-4 sm:px-4 min-w-0 rounded-lg bg-muted/80 sm:bg-transparent">
              <Search
                className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground shrink-0"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search property or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 text-base sm:text-sm outline-none text-foreground placeholder:text-muted-foreground bg-transparent"
                aria-label="Search property or location"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[42px] px-4 sm:px-5 py-3 rounded-lg border border-border text-sm sm:text-base text-foreground hover:border-brand-gold/50 hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              >
                <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
                <span>Filters</span>
              </button>
              <Link
                href={`/properties?type=${activeTab}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                className="flex items-center justify-center min-h-[48px] sm:min-h-[42px] bg-brand-charcoal text-white text-sm sm:text-base font-semibold px-4 sm:px-5 md:px-6 py-3 rounded-lg hover:bg-brand-charcoal/90 focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2 transition-colors"
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
