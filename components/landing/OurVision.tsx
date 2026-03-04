"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Innovative Living Spaces",
    description:
      "Blending technology with modern design to create exceptional, forward-thinking homes.",
  },
  {
    title: "Sustainable Communities",
    description:
      "Building eco-friendly neighborhoods that enhance quality of life and environmental responsibility.",
  },
  {
    title: "Exceptional Real Estate",
    description:
      "Delivering top-tier properties and unmatched service for a superior real estate experience.",
  },
  {
    title: "Quality Craftsmanship",
    description:
      "Ensuring meticulous attention to detail and superior construction for lasting value.",
  },
];

export function OurVision() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-400 tracking-widest"
            >
              /Our Vision
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-3 mb-5 leading-tight"
            >
              Our vision is to create
              <br />
              innovative, sustainable
              <br />
              communities
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm"
            >
              Our vision is to create innovative, sustainable communities that
              enhance lifestyles, prioritize comfort, and deliver lasting value
              through exceptional real estate solutions.
            </motion.p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                >
                  <h4 className="font-semibold text-black text-sm mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 text-xs font-medium text-black mt-3 hover:opacity-60 transition-opacity"
                  >
                    Learn more <ArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Modern sustainable home"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-bold text-black">14%</div>
              <div className="text-xs text-gray-500 mt-1">Annual ROI average</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
