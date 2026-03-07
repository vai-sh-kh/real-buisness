import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PROPERTIES_BUCKET,
  COVER_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_SIZE_BYTES,
  GALLERY_IMAGE_MAX_COUNT,
  PROPERTY_IMAGE_EXTENSIONS,
} from "@/lib/constants/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
  const type = formData.get("type") as "cover" | "gallery" | null;

  if (!propertyId || !type || !["cover", "gallery"].includes(type)) {
    return NextResponse.json(
      { error: "Missing or invalid propertyId or type" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  if (type === "cover") {
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > COVER_IMAGE_MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${COVER_IMAGE_MAX_SIZE_BYTES / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    const ext = getExtension(file.name);
    if (!PROPERTY_IMAGE_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${PROPERTY_IMAGE_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid MIME type" }, { status: 400 });
    }

    const path = `${propertyId}/cover${ext}`;
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

  const urls: string[] = [];
  const prefix = `${Date.now()}`;
  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    if (file.size > GALLERY_IMAGE_MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File ${file.name} too large. Max 5MB each` },
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
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Invalid MIME: ${file.name}` }, { status: 400 });
    }

    const path = `${propertyId}/gallery/${prefix}-${i}${ext}`;
    const { data, error } = await supabase.storage
      .from(PROPERTIES_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      console.error("[upload gallery]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(PROPERTIES_BUCKET)
      .getPublicUrl(data.path);
    urls.push(urlData.publicUrl);
  }

  return NextResponse.json({ urls });
}
