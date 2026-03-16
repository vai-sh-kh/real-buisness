import {
  ChevronRight,
  Rocket,
  Eye,
  Shield,
  Star,
  Lightbulb,
  Heart,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, ABOUT } from "@/lib/constants/site";

const HERO_BANNER = "/hero-about.jpg";
const STORY_IMAGE = "/about-story.jpg";

const valueIcons = [Shield, Star, Lightbulb, Heart];

export const metadata: Metadata = {
  title: `About Us — ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}'s mission, vision, and our legacy of excellence in luxury real estate. Your trusted partner for premium property consulting.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[380px] xs:min-h-[440px] sm:min-h-[520px] flex items-center justify-center overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0">
          <Image
            src={HERO_BANNER}
            alt=""
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
            <span className="text-brand-gold">About Us</span>
          </nav>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            {ABOUT.tagline}
          </p>
        </div>
      </section>

      {/* Company story — from ABOUT + CONTACT */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-border">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-brand-gold font-semibold tracking-widest uppercase text-xs mb-4">
                Our legacy
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal leading-tight mb-6">
                Crafting a legacy of excellence in real estate
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {ABOUT.shortStory}
              </p>
              {ABOUT.storyParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-lg leading-relaxed mb-6"
                >
                  {para}
                </p>
              ))}
              <ul className="space-y-2 mb-8">
                {[
                  "Residential and luxury sales",
                  "Rentals and lease management",
                  "Valuations and investment advisory",
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
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                Explore our services
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/5] max-h-[560px] rounded-2xl overflow-hidden border border-border shadow-xl">
                <Image
                  src={STORY_IMAGE}
                  alt="Our approach to real estate"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:left-0 bg-brand-gold p-6 sm:p-8 rounded-2xl shadow-lg">
                <p className="text-4xl sm:text-5xl font-black text-white">
                  {ABOUT.yearsExperience}+
                </p>
                <p className="text-sm font-semibold text-white/90 uppercase tracking-wider mt-1">
                  Years of experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — from ABOUT */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 text-center">
            {ABOUT.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-gold mb-2">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision — from ABOUT */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6">
                <Rocket className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                {ABOUT.mission}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-6">
                <Eye className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                {ABOUT.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values — from ABOUT */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/40">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-brand-gold font-semibold tracking-widest uppercase text-xs">
              Core values
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mt-2 mb-4">
              The pillars of our success
            </h2>
            <p className="text-muted-foreground text-lg">
              What we stand for and how we work with every client.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {ABOUT.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <div
                  key={value.title}
                  className="group bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm hover:border-brand-gold/30 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-5 group-hover:bg-brand-gold/25 transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-charcoal mb-2">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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