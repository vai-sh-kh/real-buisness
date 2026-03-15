import { z } from "zod";
import {
  PROPERTY_IMAGE_EXTENSIONS,
  COVER_IMAGE_EXTENSIONS,
  COVER_IMAGE_MAX_SIZE_BYTES,
  COVER_IMAGE_ALLOWED_MIME_TYPES,
  GALLERY_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_COUNT,
} from "@/lib/constants/upload";

const GALLERY_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

/** Validate a single file for cover image upload (max 25MB, all image types, one image only) */
export function validateCoverFile(file: File): z.ZodError | null {
  const ext = getExtension(file.name);
  if (!COVER_IMAGE_EXTENSIONS.includes(ext as (typeof COVER_IMAGE_EXTENSIONS)[number])) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: `Invalid file type. Allowed: ${COVER_IMAGE_EXTENSIONS.join(", ")}`,
      },
    ]);
  }
  if (
    !COVER_IMAGE_ALLOWED_MIME_TYPES.includes(file.type as (typeof COVER_IMAGE_ALLOWED_MIME_TYPES)[number])
  ) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: "Invalid MIME type. Cover must be an image (e.g. JPEG, PNG, WebP, GIF, SVG, AVIF).",
      },
    ]);
  }
  if (file.size > COVER_IMAGE_MAX_SIZE_BYTES) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: `Cover image too large. Max ${COVER_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB`,
      },
    ]);
  }
  return null;
}

/** Validate files for gallery upload */
export function validateGalleryFiles(
  files: File[],
  currentCount: number
): z.ZodError | null {
  if (files.length === 0) return null;
  const total = currentCount + files.length;
  if (total > GALLERY_IMAGE_MAX_COUNT) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["files"],
        message: `Max ${GALLERY_IMAGE_MAX_COUNT} images allowed. You have ${currentCount}, adding ${files.length} would exceed.`,
      },
    ]);
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = getExtension(file.name);
    if (!PROPERTY_IMAGE_EXTENSIONS.includes(ext)) {
      return new z.ZodError([
        {
          code: "custom",
          path: ["files", i],
          message: `${file.name}: Invalid type. Allowed: ${PROPERTY_IMAGE_EXTENSIONS.join(", ")}`,
        },
      ]);
    }
    if (!GALLERY_MIME.includes(file.type as (typeof GALLERY_MIME)[number])) {
      return new z.ZodError([
        {
          code: "custom",
          path: ["files", i],
          message: `${file.name}: Invalid MIME type`,
        },
      ]);
    }
    if (file.size > GALLERY_IMAGE_MAX_SIZE_BYTES) {
      return new z.ZodError([
        {
          code: "custom",
          path: ["files", i],
          message: `${file.name}: Too large. Max ${GALLERY_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB each`,
        },
      ]);
    }
  }
  return null;
}

/** Get first error message from ZodError */
export function getZodErrorMessage(err: z.ZodError): string {
  const first = err.errors[0];
  return first?.message ?? "Validation failed";
}

const GALLERY_MAX_MB = GALLERY_IMAGE_MAX_SIZE_BYTES / 1024 / 1024;

/**
 * Map API error string from gallery upload to a user-friendly message.
 * Used in add/edit property assets tab so errors are clear and actionable.
 */
export function getGalleryUploadErrorMessage(apiError: string): string {
  const lower = apiError.toLowerCase();
  if (lower.includes("too large") || lower.includes("max") && lower.includes("mb")) {
    return `File too large. Max ${GALLERY_MAX_MB}MB per image.`;
  }
  if (lower.includes("invalid file type") || lower.includes("invalid type")) {
    return `Invalid file type. Allowed: ${PROPERTY_IMAGE_EXTENSIONS.join(", ")}.`;
  }
  if (lower.includes("invalid mime") || lower.includes("mime type")) {
    return "Invalid image format. Use JPEG, PNG, WebP, or GIF.";
  }
  if (lower.includes("max") && lower.includes("images")) {
    return `Maximum ${GALLERY_IMAGE_MAX_COUNT} gallery images allowed.`;
  }
  if (lower.includes("unauthorized") || lower.includes("missing propertyid")) {
    return "Session expired or invalid. Please save the property first, then add images.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network error. Check your connection and try again.";
  }
  return apiError || "Upload failed. Please try again.";
}

const COVER_MAX_MB = COVER_IMAGE_MAX_SIZE_BYTES / 1024 / 1024;

/**
 * Map API error string from cover image upload to a user-friendly message.
 */
export function getCoverUploadErrorMessage(apiError: string): string {
  const lower = apiError.toLowerCase();
  if (lower.includes("too large") || (lower.includes("max") && lower.includes("mb"))) {
    return `Cover image too large. Max ${COVER_MAX_MB}MB.`;
  }
  if (lower.includes("invalid file type") || lower.includes("invalid type")) {
    return `Invalid file type. Allowed: ${COVER_IMAGE_EXTENSIONS.join(", ")}.`;
  }
  if (lower.includes("invalid mime") || lower.includes("mime type")) {
    return "Invalid image format. Use a supported image type (e.g. JPEG, PNG, WebP, GIF, SVG).";
  }
  if (lower.includes("unauthorized") || lower.includes("missing propertyid")) {
    return "Session expired or invalid. Please save the property first, then add cover image.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network error. Check your connection and try again.";
  }
  return apiError || "Cover image upload failed. Please try again.";
}
