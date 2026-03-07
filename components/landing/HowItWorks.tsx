"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Research Market",
    description:
      "Explore neighborhoods, property types, and prices to find the right real estate opportunities.",
  },
  {
    number: "02",
    title: "Secure Financing",
    description:
      "Arrange mortgage options and gather necessary funds for a smooth purchase or lease.",
  },
  {
    number: "03",
    title: "Close the Deal",
    description:
      "Finalize paperwork, negotiate terms, and complete your real estate transaction.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-white"
      ref={ref}
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <motion.h2
              id="how-it-works-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-charcoal leading-tight max-w-lg"
            >
              We help you find the home that will be yours
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gray-500 text-sm sm:text-base max-w-md mt-4 lg:mt-0 lg:max-w-xs leading-relaxed"
            >
              Harmony, style, and care — so you live in a place that truly
              matters to you.
            </motion.p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-0">
          {steps.map((step, i) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08 + i * 0.1,
              }}
              className="relative pr-0 lg:pr-8 xl:pr-12 pb-8 lg:pb-0 last:pb-0 border-b lg:border-b-0 lg:border-r border-gray-100 last:border-0"
            >
              <div className="h-px w-12 bg-brand-gold/50 mb-5 sm:mb-6" />
              <span className="text-xs text-brand-gold font-semibold tracking-widest uppercase">
                {step.number}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-brand-charcoal mt-2 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
