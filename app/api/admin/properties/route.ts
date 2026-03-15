import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getPropertiesForAdmin } from "@/lib/queries/properties";
import { createAdminClient } from "@/lib/supabase/admin";
import { propertySchema } from "@/lib/validations/property.schema";
import { slugify } from "@/lib/utils";
import { normalizeMapUrl } from "@/lib/map-url";
import { CONNECTION_UNAVAILABLE_MESSAGE, toUserFriendlyMessage, withConnectionRetry } from "@/lib/db-errors";

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const search = searchParams.get("search") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const category_id = searchParams.get("category_id") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const bedrooms = searchParams.get("bedrooms");
  const sort_by = searchParams.get("sort_by") ?? "created_at";
  const sort_order = (searchParams.get("sort_order") as "asc" | "desc") ?? "desc";

  try {
    const { data, total } = await withConnectionRetry(() =>
      getPropertiesForAdmin({
        page,
        limit,
        search,
        status,
        type,
        category_id,
        city,
        min_price: min_price ? Number(min_price) : undefined,
        max_price: max_price ? Number(max_price) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        sort_by,
        sort_order,
      }),
    );

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch properties";
    console.error("[GET /api/admin/properties]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body =
      status === 503
        ? { error: "Service temporarily unavailable. Please try again." }
        : { error: message };
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const slug =
    (parsed.data.slug && parsed.data.slug.trim()) ||
    slugify(parsed.data.title);

  const d = parsed.data;
  const mapEmbedUrl = d.map_embed_url?.trim()
    ? await normalizeMapUrl(d.map_embed_url).then((u) => u ?? d.map_embed_url?.trim() ?? null)
    : null;

  const insertPayload = {
    title: d.title,
    slug,
    description: d.description ?? null,
    short_description: d.short_description ?? null,
    type: d.type,
    status: d.status,
    category_id: d.category_id ?? null,
    price: d.price,
    price_type: d.price_type ?? "total",
    price_label: d.price_label ?? null,
    area_sqft: d.area_sqft ?? null,
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    floors: d.floors ?? null,
    facing: d.facing ?? null,
    age_years: d.age_years ?? null,
    furnished: d.furnished ?? null,
    address: d.address,
    city: d.city,
    state: d.state,
    zip_code: d.zip_code ?? null,
    country: d.country ?? "India",
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
    map_embed_url: mapEmbedUrl,
    cover_image_url:
      d.cover_image_url?.trim() ||
      "https://placehold.co/800x450?text=Cover+Image",
    gallery_images: Array.isArray(d.gallery_images) ? d.gallery_images : null,
    amenities: d.amenities ?? null,
    highlights: d.highlights ?? null,
    plot_number: d.plot_number ?? null,
    plot_dimensions: d.plot_dimensions ?? null,
    meta_title: d.meta_title ?? null,
    meta_description: d.meta_description ?? null,
    meta_keywords: d.meta_keywords ?? null,
    og_image_url: d.og_image_url?.trim() || null,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(insertPayload as never)
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/properties]", error);
    const status = (error as { code?: string }).code === "23505" ? 409 : 500;
    return NextResponse.json(
      { error: toUserFriendlyMessage(error) },
      { status }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
