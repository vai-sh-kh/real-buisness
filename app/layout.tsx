import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TheRealBusiness — Premier Real Estate",
    template: "%s | TheRealBusiness",
  },
  description:
    "Discover premium properties for sale and rent. Find your dream home with TheRealBusiness.",
  keywords: ["real estate", "properties", "buy", "sell", "rent", "India"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TheRealBusiness",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
