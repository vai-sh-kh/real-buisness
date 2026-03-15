import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PROPERTIES_BUCKET,
  COVER_IMAGE_MAX_SIZE_BYTES,
  COVER_IMAGE_EXTENSIONS,
  COVER_IMAGE_ALLOWED_MIME_TYPES,
  GALLERY_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_COUNT,
  PROPERTY_IMAGE_EXTENSIONS,
} from "@/lib/constants/upload";

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i).toLowerCase() : "";
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const propertyId = formData.get("propertyId") as string | null;
  const type = formData.get("type") as "cover" | "gallery" | "cover-draft" | null;

  if (!type || !["cover", "gallery", "cover-draft"].includes(type)) {
    return NextResponse.json(
      { error: "Missing or invalid type" },
      { status: 400 }
    );
  }

  // Cover-draft: no propertyId; cover/gallery require propertyId
  const isDraftCover = type === "cover-draft";
  if (!isDraftCover && !propertyId) {
    return NextResponse.json(
      { error: "Missing or invalid propertyId" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  if (type === "cover" || type === "cover-draft") {
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Cover: max 25MB, one image only, all image types
    if (file.size > COVER_IMAGE_MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Cover image too large. Max ${COVER_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }
    const ext = getExtension(file.name);
    if (!COVER_IMAGE_EXTENSIONS.includes(ext as (typeof COVER_IMAGE_EXTENSIONS)[number])) {
      return NextResponse.json(
        {
          error: `Invalid cover image type. Allowed: ${COVER_IMAGE_EXTENSIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }
    if (!COVER_IMAGE_ALLOWED_MIME_TYPES.includes(file.type as (typeof COVER_IMAGE_ALLOWED_MIME_TYPES)[number])) {
      return NextResponse.json(
        { error: "Invalid MIME type. Cover must be an image (e.g. JPEG, PNG, WebP, GIF, SVG, AVIF)." },
        { status: 400 }
      );
    }

    const path = isDraftCover
      ? `draft/${crypto.randomUUID()}${ext}`
      : `${propertyId}/cover${ext}`;
    const { data, error } = await supabase.storage
      .from(PROPERTIES_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      console.error("[upload cover]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(PROPERTIES_BUCKET)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  }

  // type === "gallery"
  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof Blob && f.size > 0);
  if (validFiles.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }
  if (validFiles.length > GALLERY_IMAGE_MAX_COUNT) {
    return NextResponse.json(
      { error: `Max ${GALLERY_IMAGE_MAX_COUNT} images allowed` },
      { status: 400 }
    );
  }

  const GALLERY_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const prefix = `${Date.now()}`;

  // Validate all files first
  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    if (file.size > GALLERY_IMAGE_MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File ${file.name} too large. Max ${GALLERY_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB each`,
        },
        { status: 400 }
      );
    }
    const ext = getExtension(file.name);
    if (!PROPERTY_IMAGE_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.name}` },
        { status: 400 }
      );
    }
    if (!GALLERY_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid MIME: ${file.name}. Gallery allows JPEG, PNG, WebP, GIF.` },
        { status: 400 }
      );
    }
  }

  // Upload all gallery images in parallel; preserve order for response
  try {
    const uploadResults = await Promise.all(
      validFiles.map(async (file, i) => {
        const ext = getExtension(file.name);
        const path = `${propertyId}/gallery/${prefix}-${i}${ext}`;
        const { data, error } = await supabase.storage
          .from(PROPERTIES_BUCKET)
          .upload(path, file, { upsert: true, contentType: file.type });
        if (error) {
          console.error("[upload gallery]", error);
          throw new Error(error.message);
        }
        const { data: urlData } = supabase.storage
          .from(PROPERTIES_BUCKET)
          .getPublicUrl(data.path);
        return urlData.publicUrl;
      })
    );
    return NextResponse.json({ urls: uploadResults });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gallery upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
