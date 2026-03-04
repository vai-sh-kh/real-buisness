"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Hero() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [search, setSearch] = useState("");

  return (
    <section className="relative w-full min-h-screen bg-[#0f0f0f] flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury home exterior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10">
        {/* Upper content area */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between flex-1 pt-28 pb-14 gap-10">
          {/* Left: Headline */}
          <div className="lg:max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-7"
            >
              <span className="h-px w-10 bg-white/40 inline-block" />
              <span className="text-white/50 text-xs tracking-[0.2em] uppercase">
                Premium Real Estate
              </span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-[82px] font-bold text-white leading-[0.95] tracking-tight"
            >
              Find a place
              <br />
              you will call
              <br />
              <span className="italic font-light">home.</span>
            </motion.h1>
          </div>

          {/* Right: Subtext + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:max-w-[280px]"
          >
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              With us you will find not just accommodation, but a place where
              your new life begins, full of coziness and possibilities.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center bg-white text-black text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>

        {/* Search bar — pinned to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pb-10"
        >
          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-2xl">
            {/* Buy / Rent tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
              {(["buy", "rent"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all",
                    activeTab === tab
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="flex items-center gap-3 flex-1 px-4 min-w-0">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search property or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-800 placeholder:text-gray-400 bg-transparent min-w-0"
              />
            </div>

            {/* Filters */}
            <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors sm:shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* CTA */}
            <Link
              href={`/properties?type=${activeTab}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap text-center sm:shrink-0"
            >
              Show Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
