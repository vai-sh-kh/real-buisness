"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote:
      "The Real Business transformed our home buying experience with professionalism and care, making the process smooth and enjoyable. Highly recommended. The team exceeded our expectations.",
    name: "Adriana O'Sullivan",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "2 weeks ago",
  },
  {
    quote:
      "Needed a quick sale. The Real Business delivered an amazing offer, exceeding our expectations. So grateful for their expertise and guidance. Truly cared about finding us the right outcome.",
    name: "John Miles",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "1 month ago",
  },
  {
    quote:
      "Professional, fast, and reliable. We got our dream home in under 30 days. From the first consultation to the final paperwork, their attention to detail was outstanding.",
    name: "Marcus Johnson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "3 weeks ago",
  },
];

const averageRating =
  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
const formattedRating = averageRating.toFixed(1);

function ReviewCard({
  name,
  avatar,
  rating,
  quote,
  date,
  index,
  inView,
}: {
  name: string;
  avatar: string;
  rating: number;
  quote: string;
  date: string;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-2xl bg-white border border-neutral-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
    >
      {/* Top row: avatar + name + stars + date */}
      <div className="flex items-start gap-3 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-10 w-10 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-neutral-900 text-sm">
              {name}
            </span>
            <span
              className="flex items-center gap-0.5 text-amber-500"
              aria-label={`${rating} stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 shrink-0 ${i < rating ? "fill-[#FFC107] text-[#FFC107]" : "fill-neutral-200 text-neutral-200"}`}
                  aria-hidden
                />
              ))}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{date}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-700 leading-relaxed flex-1">{quote}</p>
    </motion.article>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-neutral-100 overflow-hidden"
      ref={ref}
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        {/* Header: Google Reviews style — title + aggregate rating + count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2
                id="reviews-heading"
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900"
              >
                Reviews
              </h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-neutral-900 font-semibold">
                  <Star
                    className="h-6 w-6 fill-amber-400 text-amber-400 shrink-0"
                    aria-hidden
                  />
                  {formattedRating}
                </span>
                <span className="text-neutral-500 text-sm">
                  · {reviews.length} reviews
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              What our clients say about us
            </p>
          </div>
        </div>

        {/* Review cards grid — like Google Reviews listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review, i) => (
            <ReviewCard
              key={review.name}
              name={review.name}
              avatar={review.avatar}
              rating={review.rating}
              quote={review.quote}
              date={review.date}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* Optional: subtle "Google" style hint — text only, no trademark */}
        <p className="text-center text-xs text-neutral-400 mt-8">
          Customer reviews
        </p>
      </div>
    </section>
  );
}
