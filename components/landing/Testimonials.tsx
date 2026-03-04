"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "Needed a quick sale. Dream House delivered an amazing offer, exceeding expectations! So grateful for their expertise.",
    name: "John Miles",
    location: "Austin",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "The team made buying our first home so easy. They were responsive, knowledgeable, and truly cared about finding us the right fit.",
    name: "Sarah Sm.",
    location: "Denver",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    quote:
      "Professional, fast, and reliable. They handled everything and we got our dream home in under 30 days.",
    name: "Marcus J.",
    location: "Seattle",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

function TestimonialCard({ t, delay }: { t: typeof testimonials[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="bg-gray-50 rounded-2xl p-6 flex flex-col"
    >
      <span className="text-5xl font-serif text-gray-200 leading-none select-none mb-2">&ldquo;</span>
      <p className="text-sm text-gray-700 leading-relaxed flex-1">{t.quote}</p>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.avatar}
          alt={t.name}
          className="h-9 w-9 rounded-full object-cover shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-black">{t.name}</p>
          <p className="text-xs text-gray-400">{t.location}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div ref={headRef} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight"
          >
            Hear from Your Neighbors,
            <br />
            Why They Chose Us
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
