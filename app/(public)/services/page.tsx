import {
  ChevronRight,
  Home,
  Key,
  TrendingUp,
  FileSearch,
  Building2,
  Handshake,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants/site";

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4XzkesJf4GAdQLSUfhopuSdW1qG2qG5AXd12hAF9QK4AduZcDB5IsZBYLYj75jHshqfYSetG0VG6imPUcfnUYXWu-Kzaj1_6oL-ieQHl7wgmdLBm1JDVmKyJP2I1wP2DeCjN9_ug2cJ7SeyNRMGBoeXqxXM1OP9pbP_Wbd_gbvRMKxC-KeAz6dY8Wo1GzGCCKkJFAlNXPsuFKgF8P7snspE40jPsDAdK1FTx2zG95569M6ai4hhSqnz6Lwht5eRv-qNqDVU2xW9T6";

const SECTION_BG_IMAGE = HERO_IMAGE_URL;

export const metadata: Metadata = {
  title: `Our Services — ${SITE_NAME}`,
  description: `Explore ${SITE_NAME}'s full range of real estate services: buying, selling, rentals, valuations, investment advisory, and property management. Your trusted partner for premium property solutions.`,
};

const services = [
  {
    title: "Residential Sales & Purchases",
    description:
      "From first-time buyers to luxury acquisitions, we guide you through every step of buying or selling your home with market expertise and personalized service.",
    icon: Home,
  },
  {
    title: "Luxury & Premium Listings",
    description:
      "We specialize in high-end residential and estate properties, offering discreet service, global reach, and presentation that matches the caliber of your asset.",
    icon: Key,
  },
  {
    title: "Rental & Lease Management",
    description:
      "Whether you're a landlord or a tenant, we handle listings, viewings, negotiations, and lease administration so your rental experience is smooth and professional.",
    icon: Building2,
  },
  {
    title: "Property Valuation & Appraisal",
    description:
      "Accurate, defensible valuations for sales, refinancing, tax, and estate planning. We use current market data and comparable analysis to support your decisions.",
    icon: FileSearch,
  },
  {
    title: "Investment & Portfolio Advisory",
    description:
      "Strategic advice on residential and commercial real estate investments: yield analysis, risk assessment, and portfolio diversification tailored to your goals.",
    icon: TrendingUp,
  },
  {
    title: "Property Management",
    description:
      "Full-service management for owners: tenant placement, rent collection, maintenance coordination, and compliance—so your asset performs while you enjoy peace of mind.",
    icon: Handshake,
  },
];

const whyUs = [
  {
    title: "Transparency",
    description: "Clear fees, honest advice, and no hidden costs.",
    icon: Shield,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[320px] xs:h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE_URL}
            alt="Luxury real estate services"
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
          <h1 className="text-4xl xs:text-5xl md:text-6xl font-black mb-3 sm:mb-4">
            Our Services
          </h1>
          <div className="flex items-center justify-center gap-2 text-base font-medium opacity-90">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-gold">Services</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto bg-white">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 leading-tight text-brand-charcoal">
            Full-Spectrum Real Estate Services, Tailored to You
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mt-6">
            {SITE_NAME} delivers end-to-end real estate solutions for buyers,
            sellers, investors, and landlords. From luxury sales and rentals to
            valuations and property management, we combine local expertise with
            the high standards and golden touch you expect from a trusted
            partner.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-white p-6 sm:p-8 rounded-xl border border-border hover:border-brand-gold/40 transition-all shadow-sm"
                >
                  <div className="w-14 h-14 bg-brand-gold/20 rounded-xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-105 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-charcoal">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-bleed section with second background image */}
      <section className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={SECTION_BG_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.5))",
            }}
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Your Trusted Partner in Premium Real Estate
          </h2>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            From valuation to closing, we bring expertise and integrity to every
            transaction.
          </p>
        </div>
      </section>

      {/* Why Choose Us - accent strip */}
      <section className="bg-brand-gold/10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-sm">
            Why {SITE_NAME}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 text-brand-charcoal">
            Expertise, Integrity, and a Commitment to Your Success
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            We have replaced our former &quot;Our Team&quot; section with a
            dedicated Services page so you can see exactly how we can help. Our
            focus is on delivering exceptional real estate services—backed by
            the same values of transparency and excellence that define our
            brand.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[44px] border-2 border-brand-gold text-brand-gold px-8 py-3 rounded-lg font-bold hover:bg-brand-gold hover:text-white transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
