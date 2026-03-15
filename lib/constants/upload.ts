/** Supported MIME types for property images (cover: all image types; gallery: subset) */
export const PROPERTY_IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/svg+xml": [".svg"],
  "image/bmp": [".bmp"],
  "image/avif": [".avif"],
  "image/tiff": [".tiff", ".tif"],
  "image/x-icon": [".ico"],
  "image/vnd.microsoft.icon": [".ico"],
  "image/heic": [".heic"],
} as const;

/** Accepted file extensions for cover image (all image types), max 25MB, one image only */
export const COVER_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".bmp",
  ".avif",
  ".tiff",
  ".tif",
  ".ico",
  ".heic",
] as const;

/** Accepted file extensions for gallery images (5MB each, max 10) */
export const PROPERTY_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

/** Max file size for cover image (25MB), single image only */
export const COVER_IMAGE_MAX_SIZE_BYTES = 25 * 1024 * 1024;

/** Max file size for gallery images (5MB each) */
export const GALLERY_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Max number of gallery images */
export const GALLERY_IMAGE_MAX_COUNT = 10;

/** Allowed MIME types for cover image (all image types) */
export const COVER_IMAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/avif",
  "image/tiff",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/heic",
] as const;

/** Supabase storage bucket for property assets */
export const PROPERTIES_BUCKET = "properties";
