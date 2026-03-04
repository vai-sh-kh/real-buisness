"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-[#0f0f0f]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left: Heading */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm text-white/30 tracking-widest"
            >
              /Get In Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 leading-tight max-w-xl"
            >
              Ready to find your
              <br />
              <span className="italic font-light">dream home?</span>
            </motion.h2>
          </div>

          {/* Right: Description + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="lg:max-w-xs"
          >
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Get in touch with our experts and start your journey to finding
              the perfect property tailored to your lifestyle and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/properties"
                className="flex items-center justify-center gap-2 border border-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:border-white/60 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider + bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="text-xs text-white/30">
            Main Street Plaza, Downtown Business District
          </div>
          <a
            href="mailto:contact@horizonestate.com"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            contact@horizonestate.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
