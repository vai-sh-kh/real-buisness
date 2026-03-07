import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team — The Real Business",
  description:
    "Meet the talented professionals behind The Real Business — passionate experts dedicated to exceptional real estate service.",
};

const team = [
  {
    name: "Marcus Lee",
    role: "CEO & Co-Founder",
    bio: "With over 20 years in luxury real estate, Marcus leads The Real Business with vision and an unwavering commitment to client excellence.",
    rating: 4.9,
    reviews: 71,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Amelia Stephenson",
    role: "Head of Sales",
    bio: "Amelia specializes in premium residential properties and has facilitated over $200M in transactions throughout her career.",
    rating: 4.8,
    reviews: 58,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "David Chen",
    role: "Lead Property Advisor",
    bio: "David brings deep market knowledge and a data-driven approach to helping clients find properties that exceed their expectations.",
    rating: 4.7,
    reviews: 44,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Sofia Martinez",
    role: "Investment Consultant",
    bio: "Sofia helps investors identify high-yield opportunities in residential and commercial real estate markets across the country.",
    rating: 4.9,
    reviews: 63,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "James Okafor",
    role: "Commercial Properties Director",
    bio: "James has 15 years of experience in commercial real estate, advising businesses on office spaces, retail locations, and industrial properties.",
    rating: 4.6,
    reviews: 37,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rachel Kim",
    role: "Property Marketing Lead",
    bio: "Rachel combines creative storytelling with data analytics to showcase properties in their best light, driving faster sales and better outcomes.",
    rating: 4.8,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Thomas Rivera",
    role: "Senior Property Advisor",
    bio: "Thomas guides buyers through every step of the purchasing process, from initial search to closing day, with patience and expertise.",
    rating: 4.7,
    reviews: 41,
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Elena Walsh",
    role: "Rental Specialist",
    bio: "Elena helps landlords and tenants navigate the rental market with ease, ensuring fair terms and long-lasting relationships.",
    rating: 4.8,
    reviews: 48,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-[#f8f8f6] pt-20 pb-16 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="text-sm text-gray-400 tracking-widest mb-3">
                  /Our Team
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-black leading-[0.95] tracking-tight max-w-2xl">
                  The experts
                  <br />
                  behind your
                  <br />
                  <span className="italic font-light">dream home.</span>
                </h1>
              </div>
              <div className="lg:max-w-xs">
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Our team brings decades of combined expertise, a passion for
                  real estate, and a genuine commitment to exceeding your
                  expectations at every step.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Talk to an expert <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Team grid */}
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <div key={member.name} className="group">
                  {/* Photo */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Number overlay */}
                    <div className="absolute top-4 left-4 text-xs font-medium text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
                        <div className="text-xs font-semibold text-black">
                          ★ {member.rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.reviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="h-px bg-gray-200 mb-4" />
                    <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">
                      {member.role}
                    </p>
                    <h3 className="font-bold text-black text-lg mb-3">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {member.bio}
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-black hover:opacity-60 transition-opacity"
                    >
                      Contact <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join the team CTA */}
        <section className="py-20 bg-black px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Want to join our team?
              </h2>
              <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                We&apos;re always looking for talented real estate professionals
                who share our passion for excellence and innovation.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
