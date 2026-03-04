"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "HorizonEstate transformed our home buying experience with professionalism and care, making the process smooth and enjoyable. Highly recommended for anyone seeking quality service.",
    quote2:
      "The team at HorizonEstate exceeded our expectations, delivering exceptional results and personalized attention. Their expertise made our property investment truly successful.",
    name: "Adriana O'Sullivan",
    handle: "adriana@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Needed a quick sale. HorizonEstate delivered an amazing offer, exceeding our expectations. So grateful for their expertise and the way they guided us through every step.",
    quote2:
      "The entire team was responsive, knowledgeable, and truly cared about finding us the right outcome. I couldn't have asked for a better real estate partner.",
    name: "John Miles",
    handle: "john.m@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Professional, fast, and reliable. They handled everything and we got our dream home in under 30 days. The process was incredibly seamless.",
    quote2:
      "From the very first consultation to the final paperwork, HorizonEstate's attention to detail and commitment to excellence was truly outstanding.",
    name: "Marcus Johnson",
    handle: "marcus.j@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const t = testimonials[active];

  return (
    <section className="py-24 bg-[#f8f8f6]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Footer info row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Left: branding info */}
          <div className="lg:w-64 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs text-gray-400 tracking-widest mb-2">
                Main Street Plaza, Downtown Business District
              </div>
              <div className="text-xs text-gray-400">+1 (555) 123-4567</div>
            </motion.div>
          </div>

          {/* Right: Testimonial block */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <span className="text-sm text-gray-400 tracking-widest">/Testimonial</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-10 leading-tight"
            >
              What our clients say
            </motion.h2>

            {/* Active testimonial */}
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-8 mb-8"
            >
              {/* Reviewer info + first quote */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-black">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{t.quote}</p>
              </div>

              {/* Second paragraph */}
              <div className="pt-15 md:pt-0">
                <p className="text-sm text-gray-500 leading-relaxed md:mt-16">
                  {t.quote2}
                </p>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Progress bar */}
              <div className="flex-1 h-px bg-gray-200 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-black transition-all duration-500"
                  style={{ width: `${((active + 1) / testimonials.length) * 100}%` }}
                />
              </div>

              <span className="text-xs text-gray-400 tabular-nums">
                {active + 1} / {testimonials.length}
              </span>

              <button
                onClick={next}
                className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
                aria-label="Next"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
