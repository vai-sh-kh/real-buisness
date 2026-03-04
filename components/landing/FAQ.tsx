"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Does Dream House Estate provide after-sales services?",
    answer:
      "Yes, we provide comprehensive after-sales services including documentation support, interior consultation referrals, and dedicated customer care for 12 months post-purchase.",
  },
  {
    question: "Does Dream House Estate offer financing options?",
    answer:
      "Yes, we are professionals with trusted financial partners to assist you in finding financing options that suit your needs. Our team will provide guidance and support throughout the financing process.",
  },
  {
    question: "How long will it take to sell my house?",
    answer:
      "The timeline varies depending on market conditions, property type, and pricing. Typically, well-priced properties in desirable locations sell within 30–60 days.",
  },
  {
    question: "How can I schedule a tour of a property?",
    answer:
      "You can schedule a tour by contacting us via phone, email, or by filling out the contact form on any property listing page. We offer both in-person and virtual tours.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(index === 1);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-black leading-snug">{faq.question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-500 leading-relaxed pr-6">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-white">
      <div ref={ref} className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=80"
              alt="Property"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Right FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">General FAQs</h2>
            <div>
              {faqs.map((faq, i) => (
                <FAQItem key={faq.question} faq={faq} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
