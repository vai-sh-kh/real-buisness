import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — The Real Business",
  description:
    "Get in touch with The Real Business. We're here to help you find your perfect property.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
