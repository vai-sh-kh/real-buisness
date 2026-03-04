import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getPropertiesForAdmin } from "@/lib/queries/properties";
import { createAdminClient } from "@/lib/supabase/admin";
import { propertySchema } from "@/lib/validations/property.schema";
import { slugify } from "@/lib/utils";

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
  const is_featured = searchParams.get("is_featured");
  const sort_by = searchParams.get("sort_by") ?? "created_at";
  const sort_order = (searchParams.get("sort_order") as "asc" | "desc") ?? "desc";

  try {
    const { data, total } = await getPropertiesForAdmin({
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
      is_featured: is_featured ? is_featured === "true" : undefined,
      sort_by,
      sort_order,
    });

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/properties]", err);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
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

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...parsed.data, slug } as never)
    .select()
    .single();

  if (error) {
    console.error("[POST /api/admin/properties]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create property" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
