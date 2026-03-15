import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-[4.5rem] pb-[max(5rem,env(safe-area-inset-bottom))] md:pb-0 bg-white min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
