import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatPrice(price: number, currency = "₹"): string {
  if (price >= 10_000_000) {
    return `${currency}${(price / 10_000_000).toFixed(2)} Cr`;
  }
  if (price >= 100_000) {
    return `${currency}${(price / 100_000).toFixed(2)} L`;
  }
  return `${currency}${price.toLocaleString("en-IN")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) return formatDate(dateString);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  }
  return qs.toString();
}

/** Validates if a string is a valid image URL (http/https) */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Normalize image URL for display (empty string -> null) */
export function normalizeImageUrl(
  url: string | null | undefined
): string | null {
  if (!url || typeof url !== "string" || url.trim() === "") return null;
  return url.trim();
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "shall", "can", "need",
]);

/** Generate SEO metadata from title and description */
export function generateSeoFromContent(
  title: string | null | undefined,
  description: string | null | undefined,
  siteName = "TheRealBusiness"
): {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
} {
  const t = (title ?? "").trim();
  const d = (description ?? "").trim();
  const desc = d || t;
  const suffix = ` | ${siteName}`;
  const maxTitleLen = 70 - suffix.length;

  const meta_title = t
    ? t.length > maxTitleLen
      ? t.slice(0, maxTitleLen - 3).trim() + "..." + suffix
      : t + suffix
    : "";

  const meta_description =
    desc.length > 160 ? desc.slice(0, 157).trim() + "..." : desc;

  const words = [...t.toLowerCase().split(/\s+/), ...desc.toLowerCase().split(/\s+/)];
  const seen = new Set<string>();
  const keywords = words
    .map((w) => w.replace(/[^\w-]/g, ""))
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w))
    .filter((w) => {
      if (seen.has(w)) return false;
      seen.add(w);
      return true;
    })
    .slice(0, 10)
    .join(", ");

  return {
    meta_title,
    meta_description,
    meta_keywords: keywords,
  };
}
