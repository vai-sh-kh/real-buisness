import Image from "next/image";

/**
 * Full-screen loader for admin panel: logo, name, and spinner.
 * Used in loading.tsx so refresh shows branded loader instead of a blank/black page.
 */
export function AdminFullScreenLoader() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[hsl(220,14%,96%)] px-4"
      style={{ minHeight: "100dvh" }}
    >
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo-icon-bg.png"
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-auto object-contain"
          priority
        />
        <p className="font-heading text-center text-lg font-bold uppercase leading-tight tracking-tight text-[#1a1a1a] sm:text-xl">
          <span className="block">The Real</span>
          <span className="block">Business</span>
        </p>
      </div>
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(220,14%,90%)] border-t-[hsl(221,83%,53%)]"
        aria-hidden
      />
    </div>
  );
}
