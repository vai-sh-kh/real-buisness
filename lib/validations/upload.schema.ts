import { z } from "zod";
import {
  PROPERTY_IMAGE_EXTENSIONS,
  COVER_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_COUNT,
} from "@/lib/constants/upload";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

/** Validate a single file for cover image upload */
export function validateCoverFile(file: File): z.ZodError | null {
  const ext = getExtension(file.name);
  if (!PROPERTY_IMAGE_EXTENSIONS.includes(ext)) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: `Invalid file type. Allowed: ${PROPERTY_IMAGE_EXTENSIONS.join(", ")}`,
      },
    ]);
  }
  if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: "Invalid MIME type. Use JPEG, PNG, WebP or GIF.",
      },
    ]);
  }
  if (file.size > COVER_IMAGE_MAX_SIZE_BYTES) {
    return new z.ZodError([
      {
        code: "custom",
        path: ["file"],
        message: `File too large. Max ${COVER_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB`,
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
    if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
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
