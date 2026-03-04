"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Home } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const [searchType] = useState("Rent/Buy");
  const [propertyType] = useState("House");
  const [location, setLocation] = useState("");

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
          alt="Hero house"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-36 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight max-w-3xl"
        >
          More Than a Home,
          <br />
          Build Your Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-5 text-sm sm:text-base text-white/75 max-w-md leading-relaxed"
        >
          Dive into a world of comfort and convenience as we connect you the
          finest hotels, ensuring a perfect getaway tailored to your preferences
        </motion.p>
      </div>

      {/* Floating property info card — bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-36 right-6 md:right-14 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl max-w-[210px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black shrink-0">
            <Home className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-xs text-black leading-tight">DuneHaven Residences</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          2972 Westheimer Rd. Santa Ana,
          <br />
          Illinois 85486
        </p>
        <button className="w-full bg-black text-white text-xs font-medium py-1.5 rounded-full hover:bg-gray-800 transition-colors">
          Learn More
        </button>
      </motion.div>

      {/* Spacer */}
      <div className="relative z-10 h-36 sm:h-44" />

      {/* Search bar — overlapping bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-2xl px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Rent/Buy */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl cursor-pointer select-none shrink-0">
            <span className="text-sm font-medium text-gray-700">{searchType}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 shrink-0" />

          {/* Property type */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl cursor-pointer select-none shrink-0">
            <Home className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{propertyType}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 shrink-0" />

          {/* Location */}
          <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Malang, Indonesia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent min-w-0"
            />
          </div>

          {/* CTA */}
          <button className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0">
            Find Property
          </button>
        </div>
      </motion.div>
    </section>
  );
}
