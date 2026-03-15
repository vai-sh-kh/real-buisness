import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted to-white px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-6">
          <Search className="w-10 h-10 text-brand-gold" />
        </div>
        <h1 className="text-6xl font-black text-brand-charcoal tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-foreground mb-3">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-charcoal text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Back to home
          </Link>
          <BackButton className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors" />
        </div>
      </div>
    </div>
  );
}
