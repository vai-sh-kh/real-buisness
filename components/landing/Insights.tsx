"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const articles = [
  {
    title: "The Art of Kitchen Arrangement",
    description:
      "Planning for proper work, especially for users with different heights and needs.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Your Couch Can Now Make Coffee?",
    description:
      "Some designers have showcased futuristic couch concepts with integrated...",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "First-Time Guide: Everything You Need to Know",
    description:
      "Create a sense of empowerment by suggesting access to all necessary kno...",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Guide to Seattle's First-Time Buyer Hubs",
    description:
      "Move beyond the expensive downtown scene! This guide unveils Seattle's hot...",
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=500&q=80",
  },
];

function ArticleCard({
  article,
  delay,
}: {
  article: (typeof articles)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className="group cursor-pointer"
    >
      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="font-semibold text-black text-sm leading-snug mb-2">
        {article.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">
        {article.description}
      </p>
      <a
        href="#"
        className="text-xs font-semibold text-black underline underline-offset-2 hover:no-underline"
      >
        Read More
      </a>
    </motion.div>
  );
}

export function Insights() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section id="insights" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div ref={headRef} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-black leading-tight"
          >
            Insights &amp; Innovations
            <br />
            Uncover the Latest
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.title}
              article={article}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
