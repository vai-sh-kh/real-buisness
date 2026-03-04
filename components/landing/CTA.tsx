"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=80"
          alt="CTA background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div ref={ref} className="relative z-10 py-32 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto"
        >
          Find Your Dream Home Faster
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="text-white/70 text-sm max-w-md mx-auto mb-10 leading-relaxed"
        >
          Dive into a world of comfort and convenience as we connect you the finest hotels,
          ensuring a perfect getaway tailored to your preferences
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
        >
          <a
            href="#"
            className="inline-block border border-white text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
