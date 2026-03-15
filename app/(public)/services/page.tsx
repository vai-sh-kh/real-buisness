import {
  ChevronRight,
  Home,
  Key,
  TrendingUp,
  FileSearch,
  Building2,
  Handshake,
  Shield,
  CheckCircle2,
  Users,
  Award,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, CONTACT } from "@/lib/constants/site";

const HERO_BANNER = "/hero-services.jpg";
const SECTION_IMAGE = "/services-company.jpg";

export const metadata: Metadata = {
  title: `Our Services — ${SITE_NAME}`,
  description: `Explore ${SITE_NAME}'s full range of real estate services: buying, selling, rentals, valuations, investment advisory, and property management. Your trusted partner for premium property solutions.`,
};

const services = [
  {
    title: "Residential Sales & Purchases",
    description:
      "From first-time buyers to luxury acquisitions, we guide you through every step of buying or selling your home with market expertise and personalized service.",
    details: [
      "End-to-end support from listing to closing",
      "Market analysis and pricing strategy",
      "Staging and photography for sellers",
      "Negotiation and contract management",
    ],
    icon: Home,
  },
  {
    title: "Luxury & Premium Listings",
    description:
      "We specialize in high-end residential and estate properties, offering discreet service, global reach, and presentation that matches the caliber of your asset.",
    details: [
      "Discrete, confidential representation",
      "International buyer and investor networks",
      "Premium marketing and virtual tours",
      "White-glove coordination",
    ],
    icon: Key,
  },
  {
    title: "Rental & Lease Management",
    description:
      "Whether you're a landlord or a tenant, we handle listings, viewings, negotiations, and lease administration so your rental experience is smooth and professional.",
    details: [
      "Tenant screening and placement",
      "Lease drafting and renewals",
      "Rent collection and reporting",
      "Maintenance and compliance",
    ],
    icon: Building2,
  },
  {
    title: "Property Valuation & Appraisal",
    description:
      "Accurate, defensible valuations for sales, refinancing, tax, and estate planning. We use current market data and comparable analysis to support your decisions.",
    details: [
      "Sales and refinance valuations",
      "Estate and tax planning reports",
      "Portfolio and investment analysis",
      "Market trend reports",
    ],
    icon: FileSearch,
  },
  {
    title: "Investment & Portfolio Advisory",
    description:
      "Strategic advice on residential and commercial real estate investments: yield analysis, risk assessment, and portfolio diversification tailored to your goals.",
    details: [
      "Yield and cash flow modeling",
      "Risk and opportunity assessment",
      "Portfolio diversification strategy",
      "Exit and hold recommendations",
    ],
    icon: TrendingUp,
  },
  {
    title: "Property Management",
    description:
      "Full-service management for owners: tenant placement, rent collection, maintenance coordination, and compliance—so your asset performs while you enjoy peace of mind.",
    details: [
      "24/7 maintenance coordination",
      "Financial reporting and budgeting",
      "Legal and regulatory compliance",
      "Vendor and contractor networks",
    ],
    icon: Handshake,
  },
];

const processSteps = [
  {
    step: "01",
    title: "Consult",
    description:
      "We listen to your goals, timeline, and preferences so we can tailor our approach from day one.",
  },
  {
    step: "02",
    title: "Plan",
    description:
      "We design a clear strategy—pricing, marketing, or search criteria—aligned with your objectives.",
  },
  {
    step: "03",
    title: "Execute",
    description:
      "Our team handles listings, viewings, negotiations, and paperwork with precision and care.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "From closing onward we remain your partner for referrals, management, or future transactions.",
  },
];

const whyUs = [
  {
    title: "Transparency",
    description:
      "Clear fees, honest advice, and no hidden costs. You always know where you stand.",
    icon: Shield,
  },
  {
    title: "Expertise",
    description:
      "Deep market knowledge, proven processes, and a track record of successful outcomes.",
    icon: Award,
  },
  {
    title: "Client-first",
    description:
      "Your goals drive every decision. We are committed to your long-term success.",
    icon: Users,
  },
  {
    title: "Local presence",
    description:
      "On-the-ground insight and networks where you buy, sell, or invest.",
    icon: MapPin,
  },
];

const stats = [
  { value: "15+", label: "Years of experience" },
  { value: "2,500+", label: "Happy clients" },
  { value: "1,200+", label: "Properties transacted" },
  { value: "98%", label: "Client satisfaction" },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[380px] xs:min-h-[440px] sm:min-h-[520px] flex items-center justify-center overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0">
          <Image
            src={HERO_BANNER}
            alt="Luxury real estate services"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-charcoal/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <nav className="flex items-center justify-center gap-2 text-sm font-medium text-white/80 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-brand-gold">Services</span>
          </nav>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Full-spectrum real estate solutions—from sales and rentals to
            valuations and management—backed by expertise and integrity.
          </p>
        </div>
      </section>

      {/* Company overview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-border">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-brand-gold font-semibold tracking-widest uppercase text-xs mb-4">
                About our company
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal leading-tight mb-6">
                Who we are and how we can help
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {SITE_NAME} is a full-service real estate partner for buyers,
                sellers, investors, and landlords. We combine local market
                expertise with the high standards and personalized attention you
                expect from a trusted advisor.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Whether you are buying your first home, selling a luxury
                property, building a rental portfolio, or need valuations and
                management—we deliver end-to-end solutions with transparency,
                professionalism, and a commitment to your success.
              </p>
              <ul className="space-y-3">
                {[
                  "Residential and luxury sales & purchases",
                  "Rental and lease management",
                  "Property valuation and appraisal",
                  "Investment and portfolio advisory",
                  "Full-service property management",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-brand-charcoal font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] max-h-[480px] rounded-2xl overflow-hidden border border-border shadow-lg">
              <Image
                src={SECTION_IMAGE}
                alt="Our team and approach"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-brand-charcoal/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/50">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              What we offer
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-2 mb-4">
              Full-spectrum real estate services
            </h2>
            <p className="text-muted-foreground text-lg">
              From sales and rentals to valuations and management—everything you
              need under one roof.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300"
                >
                  <div className="p-6 sm:p-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold/25 transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-charcoal mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.details.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              Our process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-2 mb-4">
              How we work with you
            </h2>
            <p className="text-muted-foreground text-lg">
              A clear, proven approach from first conversation to closing and
              beyond.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item) => (
              <div key={item.step} className="relative">
                <div className="relative bg-muted/50 rounded-2xl p-6 sm:p-8 border border-border/50">
                  <span className="text-3xl font-black text-brand-gold/30">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-brand-charcoal mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/40">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              Why {SITE_NAME}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-2 mb-4">
              Expertise, integrity, and a commitment to your success
            </h2>
            <p className="text-muted-foreground text-lg">
              We are built on transparency, local expertise, and putting your
              goals first.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm hover:border-brand-gold/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 sm:py-16 bg-brand-charcoal text-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-border">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tell us your goals—whether you want to buy, sell, rent, or
              invest—and we will tailor our services to you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                <MessageCircle className="h-5 w-5" />
                {CONTACT.whatsappLabel}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-xl border-2 border-brand-gold text-brand-gold font-semibold hover:bg-brand-gold hover:text-white transition-colors w-full sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                {CONTACT.contactUsLabel}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              {CONTACT.workingHours.weekdays} · {CONTACT.workingHours.saturday}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
