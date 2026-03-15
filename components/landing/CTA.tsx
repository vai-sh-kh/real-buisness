"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-brand-charcoal"
      ref={ref}
      aria-labelledby="cta-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-10">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm text-brand-gold/70 tracking-widest"
            >
              /Get In Touch
            </motion.span>
            <motion.h2
              id="cta-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.06,
              }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mt-2 sm:mt-3 leading-tight max-w-xl"
            >
              Ready to find your{" "}
              <span className="italic font-light">dream home?</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="lg:max-w-xs"
          >
            <p className="text-white/60 text-base leading-relaxed mb-6 sm:mb-8">
              Get in touch with our experts and start your journey to the
              perfect property for your lifestyle and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] bg-brand-gold text-white text-sm font-semibold px-6 sm:px-7 py-3.5 rounded-full hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal transition-opacity"
              >
                Contact Us <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center min-h-[48px] border border-white/20 text-white text-sm font-semibold px-6 sm:px-7 py-3.5 rounded-full hover:border-brand-gold/60 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
        >
          <div className="text-xs text-white/30">
            Main Street Plaza, Downtown Business District
          </div>
          <a
            href="mailto:contact@therealbusiness.com"
            className="text-base text-white/50 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded py-2 min-h-[44px] inline-flex items-center"
          >
            contact@therealbusiness.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
