"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn("inline-flex items-center justify-center gap-2", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      Go back
    </button>
  );
}
