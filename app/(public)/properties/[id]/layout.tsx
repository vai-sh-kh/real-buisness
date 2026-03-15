import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property — The Real Business",
  description: "View property details.",
};

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
