import {
  ChevronRight,
  Rocket,
  Eye,
  Shield,
  Star,
  Lightbulb,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants/site";

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4XzkesJf4GAdQLSUfhopuSdW1qG2qG5AXd12hAF9QK4AduZcDB5IsZBYLYj75jHshqfYSetG0VG6imPUcfnUYXWu-Kzaj1_6oL-ieQHl7wgmdLBm1JDVmKyJP2I1wP2DeCjN9_ug2cJ7SeyNRMGBoeXqxXM1OP9pbP_Wbd_gbvRMKxC-KeAz6dY8Wo1GzGCCKkJFAlNXPsuFKgF8P7snspE40jPsDAdK1FTx2zG95569M6ai4hhSqnz6Lwht5eRv-qNqDVU2xW9T6";

export const metadata: Metadata = {
  title: `About Us — ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}'s mission, vision, and our legacy of excellence in luxury real estate. Your trusted partner for premium property consulting.`,
};

const mission =
  "To provide unparalleled real estate services that empower our clients to achieve their lifestyle aspirations through expertise, transparency, and personalized care.";

const vision =
  "To be the global benchmark for excellence in luxury real estate, continuously innovating and shaping the future of sophisticated living.";

const values = [
  {
    title: "Integrity",
    description:
      "Honesty and transparency are the foundations of every relationship we build.",
    icon: Shield,
  },
  {
    title: "Excellence",
    description:
      "We settle for nothing less than the highest quality in service and presentation.",
    icon: Star,
  },
  {
    title: "Innovation",
    description:
      "Leveraging the latest technology to stay ahead in the dynamic property market.",
    icon: Lightbulb,
  },
  {
    title: "Client First",
    description:
      "Your goals are our priority. We are committed to your long-term success.",
    icon: Heart,
  },
];

const stats = [
  { value: "$2.4B+", label: "Total Sales" },
  { value: "1.5k+", label: "Properties Sold" },
  { value: "120+", label: "Expert Agents" },
  { value: "99%", label: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[320px] xs:h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Modern luxury villa with pool at sunset"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
            }}
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl xs:text-5xl md:text-6xl font-black mb-3 sm:mb-4">About Us</h1>
          <div className="flex items-center justify-center gap-2 text-base font-medium opacity-90">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-gold">About Us</span>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto bg-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm">
              Our Legacy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-brand-charcoal">
              Crafting a Legacy of Excellence in Luxury Real Estate
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded on the principles of integrity and architectural
              brilliance, {SITE_NAME} has been the cornerstone of premium
              property consulting for over two decades. We specialize in
              curating experiences that transcend simple transactions.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our journey began with a single vision: to redefine what it means
              to live in luxury. Today, we stand as a global leader, connecting
              discerning clients with the world&apos;s most exceptional living
              spaces.
            </p>
            <p className="text-muted-foreground text-sm italic pt-2">
              We have replaced our former &quot;Our Team&quot; section with a
              dedicated{" "}
              <Link
                href="/services"
                className="text-brand-gold font-semibold hover:underline"
              >
                Services
              </Link>{" "}
              page—so you can see exactly how we can help with buying, selling,
              rentals, valuations, and more.
            </p>
            <div className="pt-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center min-h-[44px] border-2 border-brand-gold text-brand-gold px-8 py-3 rounded-lg font-bold hover:bg-brand-gold hover:text-white transition-all"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm2cpyJgC8sT_9hmRdwNBpe6UdFQvWw2QUSeiWN0WMCS-p2m1-Y-gm4dgbosXU8L1p_pvGxAK9YWvMhXOD6fT9xVDHV2A1rPFbOgZHWlQZ2FVB4HhQCOPKL_o0VA2VS47SFpF7-VXXLaXBxq6twwtPb_yoy-ku4O72RDKSUil8pZo1LDGL1ur5pGlOmrrX8rV9YY-ujE3wXNduenb5IBDgDj35OktOroGSbN9C0zmmASgpLNpdWtHDRrZLyde542Uk7GERKAT5HjHD"
                alt="Sophisticated modern interior design"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-gold p-8 rounded-xl hidden md:block">
              <p className="text-4xl font-black text-white">25+</p>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider">
                Years of Experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-gold/10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-brand-gold mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted p-8 sm:p-10 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mb-6">
              <Rocket className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-brand-charcoal">
              Our Mission
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">{mission}</p>
          </div>
          <div className="bg-muted p-8 sm:p-10 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mb-6">
              <Eye className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-brand-charcoal">
              Our Vision
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">{vision}</p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm">
              Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-brand-charcoal">
              The Pillars of Our Success
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group bg-white p-8 rounded-xl border border-border hover:border-brand-gold/40 transition-all shadow-sm"
                >
                  <Icon className="w-10 h-10 text-brand-gold mb-4 group-hover:scale-110 transition-transform inline-block" />
                  <h4 className="text-xl font-bold mb-2 text-brand-charcoal">
                    {value.title}
                  </h4>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
