"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Innovative Living Spaces",
    description:
      "Technology and modern design combined for exceptional, forward-thinking homes.",
  },
  {
    title: "Sustainable Communities",
    description:
      "Eco-friendly neighborhoods that enhance quality of life and responsibility.",
  },
  {
    title: "Exceptional Real Estate",
    description:
      "Top-tier properties and unmatched service for a superior experience.",
  },
  {
    title: "Quality Craftsmanship",
    description:
      "Meticulous attention to detail and superior construction for lasting value.",
  },
];

export function OurVision() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-white"
      ref={ref}
      aria-labelledby="vision-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm text-brand-gold/80 tracking-widest"
            >
              /Our Vision
            </motion.span>

            <motion.h2
              id="vision-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.06,
              }}
              className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-charcoal mt-2 sm:mt-3 mb-4 sm:mb-5 leading-tight"
            >
              Our vision is to create innovative, sustainable communities
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-md"
            >
              We create innovative, sustainable communities that enhance
              lifestyles, prioritize comfort, and deliver lasting value through
              exceptional real estate solutions.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                >
                  <h3 className="font-semibold text-brand-charcoal text-sm sm:text-base mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-2 sm:mb-3">
                    {feature.description}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-charcoal hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded"
                  >
                    Learn more{" "}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="relative order-first lg:order-last"
          >
            <div className="aspect-[3/4] max-h-[480px] lg:max-h-none rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Modern sustainable home"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 right-4 sm:right-auto sm:w-48 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xl border border-gray-100">
              <div className="text-2xl sm:text-3xl font-bold text-brand-gold">
                14%
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Annual ROI average
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
