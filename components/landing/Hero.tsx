"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Hero() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [search, setSearch] = useState("");

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-screen overflow-hidden bg-brand-charcoal flex flex-col">
      {/* Background — priority so banner loads with page */}
      <div className="absolute inset-0">
        <Image
          src="/hero-home.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-charcoal/60" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-[1680px] mx-auto w-full px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* Content: mobile stacked, desktop two-column */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between flex-1 pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-14 gap-6 sm:gap-8 md:gap-10">
          <div className="lg:max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-3 sm:mb-5 md:mb-7"
            >
              <span className="h-px w-8 sm:w-10 bg-brand-gold/60 inline-block" />
              <span className="text-brand-gold/90 text-[11px] sm:text-xs tracking-[0.2em] uppercase">
                Premium Real Estate
              </span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-heading text-3xl xs:text-4xl sm:text-6xl lg:text-[72px] xl:text-[82px] font-bold text-white leading-[0.98] tracking-tight"
            >
              Find a place
              <br />
              you will call
              <br />
              <span className="italic font-light">home.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:max-w-[280px]"
          >
            <p className="text-white/70 text-base sm:text-base leading-relaxed mb-4 sm:mb-6 md:mb-7">
              Not just accommodation — a place where your new life begins, with
              comfort and possibility.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] bg-brand-gold text-white text-base font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal transition-opacity"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pb-6 sm:pb-8 md:pb-10"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 shadow-2xl">
            <div className="flex bg-muted rounded-lg sm:rounded-xl p-1 shrink-0">
              {(["buy", "rent"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 sm:flex-none min-h-[44px] sm:min-h-0 px-4 sm:px-5 py-2.5 sm:py-2 text-base sm:text-sm font-semibold rounded-md sm:rounded-lg capitalize transition-all focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2",
                    activeTab === tab
                      ? "bg-brand-charcoal text-white shadow-sm"
                      : "text-muted-foreground hover:text-brand-charcoal",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-1 min-h-[44px] sm:min-h-0 px-3 sm:px-4 min-w-0 rounded-lg bg-muted/80 sm:bg-transparent">
              <Search
                className="h-4 w-4 text-muted-foreground shrink-0"
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

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 py-3 rounded-lg sm:rounded-xl border border-border text-base sm:text-sm text-foreground hover:border-brand-gold/50 hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                <span>Filters</span>
              </button>
              <Link
                href={`/properties?type=${activeTab}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
                className="flex items-center justify-center min-h-[44px] bg-brand-charcoal text-white text-base sm:text-sm font-semibold px-5 sm:px-6 py-3 rounded-lg sm:rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2 transition-opacity"
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
