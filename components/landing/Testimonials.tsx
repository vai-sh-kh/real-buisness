"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "The Real Business transformed our home buying experience with professionalism and care, making the process smooth and enjoyable. Highly recommended.",
    quote2:
      "The team exceeded our expectations, delivering exceptional results and personalized attention. Their expertise made our property investment truly successful.",
    name: "Adriana O'Sullivan",
    handle: "adriana@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Needed a quick sale. The Real Business delivered an amazing offer, exceeding our expectations. So grateful for their expertise and guidance.",
    quote2:
      "The entire team was responsive, knowledgeable, and truly cared about finding us the right outcome. I couldn't have asked for a better partner.",
    name: "John Miles",
    handle: "john.m@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Professional, fast, and reliable. They handled everything and we got our dream home in under 30 days. Incredibly seamless.",
    quote2:
      "From the first consultation to the final paperwork, their attention to detail and commitment to excellence was outstanding.",
    name: "Marcus Johnson",
    handle: "marcus.j@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () =>
    setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  const t = testimonials[active];

  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted overflow-hidden"
      ref={ref}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 lg:gap-10">
          <div className="lg:w-64 shrink-0 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="text-xs text-muted-foreground tracking-widest mb-1">
                Main Street Plaza, Downtown
              </div>
              <div className="text-xs text-muted-foreground">
                +1 (555) 123-4567
              </div>
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm text-brand-gold/80 tracking-widest"
            >
              /Testimonials
            </motion.span>

            <motion.h2
              id="testimonials-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-charcoal mt-1 mb-6 sm:mb-8 lg:mb-10 leading-tight"
            >
              What our clients say
            </motion.h2>

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-charcoal truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.handle}
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  {t.quote}
                </p>
              </div>
              <div className="md:pt-0 pt-2">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed md:mt-12">
                  {t.quote2}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={prev}
                className="min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 rounded-full border border-border flex items-center justify-center hover:bg-brand-charcoal hover:border-brand-charcoal hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>

              <div className="flex-1 h-px bg-gray-200 relative min-w-0">
                <div
                  className="absolute top-0 left-0 h-full bg-brand-charcoal transition-all duration-400"
                  style={{
                    width: `${((active + 1) / testimonials.length) * 100}%`,
                  }}
                />
              </div>

              <span
                className="text-xs text-muted-foreground tabular-nums shrink-0"
                aria-live="polite"
              >
                {active + 1} / {testimonials.length}
              </span>

              <button
                type="button"
                onClick={next}
                className="min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 rounded-full border border-border flex items-center justify-center hover:bg-brand-charcoal hover:border-brand-charcoal hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
