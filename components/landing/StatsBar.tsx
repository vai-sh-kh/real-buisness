"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-10 sm:py-14 md:py-16 lg:py-20 bg-brand-charcoal overflow-hidden"
      ref={ref}
      aria-label="Company statistics"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center min-w-0"
            >
              <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight break-words">
                <span className="text-brand-gold">{stat.value}</span>
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/50 mt-1 break-words px-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
