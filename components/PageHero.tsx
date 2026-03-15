import Link from "next/link";
import Image from "next/image";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  imageSrc: string;
  breadcrumbs: Breadcrumb[];
  description?: string;
}

export default function PageHero({
  title,
  imageSrc,
  breadcrumbs,
  description,
}: PageHeroProps) {
  return (
    <section className="relative h-[320px] xs:h-[380px] sm:h-[500px] md:h-[600px] overflow-hidden">
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="(min-width: 1024px) 80vw, 100vw"
      />
      <div className="absolute inset-0 bg-brand-charcoal/60" />
      <div className="absolute inset-0 flex flex-col justify-end max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pb-8 sm:pb-10 md:pb-12">
        <nav className="text-white/80 text-sm mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
          {breadcrumbs.map((item, i) => (
            <span key={item.label} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-60">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-heading text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 sm:mt-3 text-white/90 text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
