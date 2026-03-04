import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturedProperties } from "@/components/landing/FeaturedProperties";
import { StatsBar } from "@/components/landing/StatsBar";
import { OurVision } from "@/components/landing/OurVision";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HorizonEstate — Find Premium Properties",
  description:
    "Discover premium properties for sale and rent. Find your dream home with HorizonEstate.",
};

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedProperties />
        <StatsBar />
        <OurVision />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
