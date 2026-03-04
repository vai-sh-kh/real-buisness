import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ExpertGuides } from "@/components/landing/ExpertGuides";
import { MoveInReady } from "@/components/landing/MoveInReady";
import { FeaturedProperties } from "@/components/landing/FeaturedProperties";
import { Insights } from "@/components/landing/Insights";
import { FAQ } from "@/components/landing/FAQ";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DreamHouse — Find Premium Properties",
  description:
    "Discover premium properties for sale and rent. Buy, sell, or rent your dream home with DreamHouse.",
};

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main>
        <Hero />
        <ExpertGuides />
        <MoveInReady />
        <FeaturedProperties />
        <Insights />
        <FAQ />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
