"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const guides = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="16" width="28" height="20" rx="2" />
        <path d="M3 18L20 6l17 12" />
        <rect x="15" y="26" width="10" height="10" rx="1" />
      </svg>
    ),
    title: "Buy Properties",
    description:
      "Discover the perfect property that reflects your unique style and needs. Transform it into your personal haven, filled with cherished memories and the joy of building equity.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="14" />
        <path d="M20 12v16M16 16h6a2 2 0 010 4h-4a2 2 0 000 4h6" strokeLinecap="round" />
      </svg>
    ),
    title: "Sell Properties",
    description:
      "Our expertise ensures you get the true value your property deserves. Sell your property seamlessly and efficiently, opening a new chapter with peace of mind and financial security.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="10" width="32" height="24" rx="2" />
        <path d="M4 18h32M12 10v4M20 10v4M28 10v4" strokeLinecap="round" />
      </svg>
    ),
    title: "Rent Properties",
    description:
      "Our expertise ensures you get the true value your property deserves. Rent your property seamlessly and efficiently, opening a new chapter with peace of mind and financial security.",
  },
];

function GuideCard({ guide, delay }: { guide: typeof guides[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="flex flex-col"
    >
      <div className="text-black mb-5">{guide.icon}</div>
      <h3 className="text-lg font-bold text-black mb-3">{guide.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-1">{guide.description}</p>
      <div className="mt-6">
        <a
          href="#properties"
          className="inline-block border border-black text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
        >
          Get Info
        </a>
      </div>
    </motion.div>
  );
}

export function ExpertGuides() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div ref={headRef} className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight"
          >
            Expert Guides to Finding
            <br />
            Your Perfect Fit
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {guides.map((guide, i) => (
            <GuideCard key={guide.title} guide={guide} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
