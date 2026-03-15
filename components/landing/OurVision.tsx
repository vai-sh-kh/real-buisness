"use client";

import Link from "next/link";
import Image from "next/image";
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
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden"
      ref={ref}
      aria-labelledby="vision-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-stretch">
          {/* Content column */}
          <div className="min-w-0 order-2 lg:order-1 flex flex-col">
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
              className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-charcoal mt-2 sm:mt-3 mb-3 sm:mb-5 leading-tight"
            >
              Our vision is to create innovative, sustainable communities
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md"
            >
              We create innovative, sustainable communities that enhance
              lifestyles, prioritize comfort, and deliver lasting value through
              exceptional real estate solutions.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                  className="min-w-0"
                >
                  <h3 className="font-semibold text-brand-charcoal text-sm sm:text-base mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                    {feature.description}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 min-h-[44px] py-2 text-sm sm:text-base font-medium text-brand-charcoal hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded"
                  >
                    Learn more{" "}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image column: same height as content on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="relative order-1 lg:order-last min-w-0 flex flex-col lg:h-full"
          >
            <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0 lg:h-full rounded-xl sm:rounded-2xl overflow-hidden bg-muted border border-border">
              <Image
                src="/about-story.jpg"
                alt="Real estate development and sustainable communities"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-44 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-border">
                <div className="text-2xl sm:text-3xl font-bold text-brand-gold">
                  14%
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Annual ROI average
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
