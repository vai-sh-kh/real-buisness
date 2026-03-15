import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HomeExploreProperties } from "@/components/landing/HomeExploreProperties";
import { StatsBar } from "@/components/landing/StatsBar";
import { OurVision } from "@/components/landing/OurVision";
import { Testimonials } from "@/components/landing/Testimonials";
import { HomeWhyUs } from "@/components/landing/HomeWhyUs";
import { AskLeon } from "@/components/landing/AskLeon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Real Business — Find Premium Properties",
  description:
    "Discover premium properties for sale and rent. Find your dream home with The Real Business.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <HomeExploreProperties />
      <StatsBar />
      <OurVision />
      <Testimonials />
      <HomeWhyUs />
      <AskLeon />
    </>
  );
}
