"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "No.1",
    title: "Research Market",
    description:
      "Explore neighborhoods, property types, and prices to find the right real estate investment opportunities for your needs.",
  },
  {
    number: "No.2",
    title: "Secure Financing",
    description:
      "Arrange mortgage options and gather necessary funds to ensure a smooth purchasing or leasing process.",
  },
  {
    number: "No.3",
    title: "Close the Deal",
    description:
      "Finalize paperwork, negotiate terms, and transfer ownership to complete your real estate transaction.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal leading-tight max-w-lg"
          >
            We help you find the home
            <br />
            that will be yours
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-500 text-sm max-w-xs leading-relaxed"
          >
            Our approach is about harmony, style, and care — ensuring everyone
            lives in a place that is truly important to them.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 + i * 0.1,
              }}
              className="group relative pr-0 md:pr-12 lg:pr-16 pb-8 md:pb-0"
            >
              {/* Divider line */}
              <div className="h-px bg-gray-200 mb-6 group-hover:bg-brand-gold/30 transition-colors" />

              <div className="text-xs text-brand-gold tracking-widest mb-4 uppercase font-semibold">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
