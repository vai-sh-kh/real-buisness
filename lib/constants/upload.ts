/** Supported MIME types for property images */
export const PROPERTY_IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
} as const;

/** Accepted file extensions for property images */
export const PROPERTY_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/** Max file size for cover image (5MB) */
export const COVER_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Max file size for gallery images (5MB each) */
export const GALLERY_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Max number of gallery images */
export const GALLERY_IMAGE_MAX_COUNT = 10;

/** Supabase storage bucket for property assets */
export const PROPERTIES_BUCKET = "properties";
