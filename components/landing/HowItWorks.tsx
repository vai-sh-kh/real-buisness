"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Wallet, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Research Market",
    description:
      "Explore neighborhoods, property types, and prices to find the right real estate opportunities.",
    icon: Search,
  },
  {
    number: "02",
    title: "Secure Financing",
    description:
      "Arrange mortgage options and gather necessary funds for a smooth purchase or lease.",
    icon: Wallet,
  },
  {
    number: "03",
    title: "Close the Deal",
    description:
      "Finalize paperwork, negotiate terms, and complete your real estate transaction.",
    icon: FileCheck,
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-10 sm:py-14 md:py-16 lg:py-20 bg-muted/20 overflow-hidden"
      ref={ref}
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* Header: eyebrow + heading + tagline */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 md:mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-brand-gold font-semibold text-xs tracking-[0.2em] uppercase"
          >
            How it works
          </motion.span>
          <motion.h2
            id="how-it-works-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-heading text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-charcoal mt-2 mb-2 sm:mb-3 leading-tight px-1"
          >
            We help you find the home that will be yours
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            Harmony, style, and care — so you live in a place that truly matters
            to you.
          </motion.p>
        </div>

        {/* Steps: card layout with icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + i * 0.08,
                }}
                className={cn(
                  "relative rounded-xl sm:rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 min-w-0",
                  "flex flex-col",
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="flex h-10 w-10 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                    <Icon className="h-5 w-5 sm:h-5 sm:w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold text-brand-gold/80 tabular-nums">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 min-h-0">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
