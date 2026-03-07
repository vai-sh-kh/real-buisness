"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "light" | "dark";

interface LogoProps {
  href?: string;
  variant?: LogoVariant;
  height?: number;
  className?: string;
  title?: string;
  /** Use the icon-only (golden buildings) transparent logo, e.g. in sidebar header */
  iconOnly?: boolean;
}

export function Logo({
  href = "/",
  variant = "light",
  height = 32,
  className,
  title,
  iconOnly = false,
}: LogoProps) {
  const img = (
    <Image
      src={iconOnly ? "/logo-icon-bg.png" : "/logo.png"}
      alt={
        iconOnly
          ? "The Real Business"
          : "The Real Business — Beyond expectations"
      }
      width={iconOnly ? height : height * 4}
      height={height}
      className={cn("object-contain object-left", className)}
      style={{ height, width: "auto" }}
      priority
    />
  );

  return (
    <Link href={href} className={cn("inline-flex", className)} title={title}>
      {img}
    </Link>
  );
}
