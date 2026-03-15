"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ASK_LEON, CONTACT } from "@/lib/constants/site";

export function AskLeon() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const ctaHref = ASK_LEON.useWhatsApp ? CONTACT.whatsappUrl : "/contact";
  const isExternal = ASK_LEON.useWhatsApp;

  return (
    <section
      ref={ref}
      className="py-12 sm:py-14 md:py-16 lg:py-20 bg-brand-charcoal overflow-hidden"
      aria-labelledby="ask-leon-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-2xl mx-auto text-center min-w-0">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-brand-gold/90 text-xs sm:text-sm font-semibold tracking-widest uppercase"
          >
            {ASK_LEON.tagline}
          </motion.span>
          <motion.h2
            id="ask-leon-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2 mb-4 sm:mb-5"
          >
            {ASK_LEON.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8"
          >
            {ASK_LEON.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            {isExternal ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                {ASK_LEON.ctaLabel}
              </a>
            ) : (
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                {ASK_LEON.ctaLabel}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
