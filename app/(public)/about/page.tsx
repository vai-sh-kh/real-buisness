import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — The Real Business",
  description:
    "Learn about The Real Business's mission to create innovative, sustainable communities and exceptional real estate experiences.",
};

const values = [
  {
    title: "Innovative Living Spaces",
    description:
      "Blending technology with modern design to create exceptional, forward-thinking homes that redefine what it means to live well.",
  },
  {
    title: "Sustainable Communities",
    description:
      "Building eco-friendly neighborhoods that enhance quality of life and environmental responsibility for generations to come.",
  },
  {
    title: "Exceptional Service",
    description:
      "Delivering top-tier properties and unmatched service. We guide every client through a seamless real estate experience.",
  },
  {
    title: "Quality Craftsmanship",
    description:
      "Ensuring meticulous attention to detail and superior construction. Every property we represent meets the highest standards.",
  },
  {
    title: "Client-First Approach",
    description:
      "Your goals are our goals. We listen first, then act — ensuring every decision is aligned with your vision and budget.",
  },
  {
    title: "Transparent Process",
    description:
      "No surprises, no hidden fees. We believe in honest communication and clarity at every step of your property journey.",
  },
];

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "15+", label: "Years of Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const milestones = [
  {
    year: "2009",
    title: "Founded",
    description:
      "The Real Business was founded with a mission to redefine real estate through design and innovation.",
  },
  {
    year: "2013",
    title: "500th Client",
    description:
      "Reached our 500th satisfied client milestone, expanding across three major metropolitan areas.",
  },
  {
    year: "2018",
    title: "Digital Transformation",
    description:
      "Launched our digital platform with virtual tours and online property management.",
  },
  {
    year: "2024",
    title: "National Expansion",
    description:
      "Expanded to cover 20+ cities nationwide with over 500 active listings at any time.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-20 pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                About Us
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                We&apos;re on a mission
                <br />
                to redefine
                <br />
                <span className="italic font-light">real estate.</span>
              </h1>
            </div>
            <div className="lg:max-w-xs">
              <p className="text-white/50 text-sm leading-relaxed">
                Since 2009, The Real Business has been connecting people with
                exceptional properties and communities. We believe every home
                should reflect its owner&apos;s vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About image + story */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                  alt="The Real Business office and team"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-2xl p-5 shadow-xl max-w-[200px]">
                <div className="text-3xl font-bold text-black">15+</div>
                <div className="text-xs text-gray-500 mt-1">
                  Years transforming real estate
                </div>
              </div>
            </div>

            {/* Story text */}
            <div>
              <span className="text-sm text-gray-400 tracking-widest">
                /Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-3 mb-6 leading-tight">
                Built on trust,
                <br />
                driven by results
              </h2>
              <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                <p>
                  The Real Business was founded in 2009 with a single guiding
                  principle: that finding a home should be an inspiring journey,
                  not a stressful ordeal. We started with a small team of
                  passionate real estate professionals who believed that every
                  client deserved expert guidance and genuine care.
                </p>
                <p>
                  Over the years, we&apos;ve grown into a nationally recognized
                  real estate company with deep roots in the communities we
                  serve. Our portfolio spans luxury residences, family homes,
                  investment properties, and commercial spaces.
                </p>
                <p>
                  Today, we leverage cutting-edge technology — from virtual
                  tours to AI-powered property matching — to deliver a seamless,
                  modern real estate experience without losing the human touch
                  that makes all the difference.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Work with us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-black mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="text-sm text-gray-400 tracking-widest">
              /Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mt-3 leading-tight max-w-lg">
              What drives everything we do
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="relative pt-8 border-t border-gray-200"
              >
                <div className="text-xs text-gray-400 tracking-widest mb-4 uppercase">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-black text-lg mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-[#0f0f0f] px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="text-sm text-white/30 tracking-widest">
              /Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 leading-tight">
              Our journey
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="relative pr-8 pb-8 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/10 last:border-0"
              >
                <div className="text-white/30 text-xs tracking-widest mb-4">
                  {m.year}
                </div>
                <div className="h-px bg-white/10 mb-6" />
                <h3 className="font-bold text-white text-lg mb-3">{m.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Meet the team behind The Real Business
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            Our talented professionals bring decades of combined experience and
            a shared passion for exceptional real estate.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            Meet our team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
