"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const featuredHomes = [
  {
    num: "01",
    title: "The Futuristic House",
    description:
      "Our expertise ensures you get the true value your property deserves. Sell your property seamlessly and efficiently, opening a new chapter with peace of mind and financial security.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "02",
    title: "The Minimalist House",
    description:
      "Our expertise ensures you get the true value your property deserves. Sell your property seamlessly and efficiently, opening a new chapter with peace of mind and financial security.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
];

function HomeCard({ home, delay }: { home: typeof featuredHomes[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.image}
          alt={home.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex items-start gap-4">
        <span className="text-4xl font-bold text-gray-150 leading-none shrink-0 select-none" style={{ color: '#e8e8e8' }}>
          {home.num}
        </span>
        <div>
          <h3 className="text-base font-bold text-black mb-2">{home.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{home.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function MoveInReady() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div ref={headRef} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight"
          >
            Move-In Ready Gems:
            <br />
            Discover Your Dream Home Today
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {featuredHomes.map((home, i) => (
            <HomeCard key={home.num} home={home} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
