import { NextRequest, NextResponse } from "next/server";
import { getProperties } from "@/lib/queries/properties";

// Public endpoint — serves the landing page featured properties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "sale" | "rent" | null;
  const category_id = searchParams.get("category_id") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const bedrooms = searchParams.get("bedrooms");
  const sort = (searchParams.get("sort") as "newest" | "price_asc" | "price_desc" | "views") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const search = searchParams.get("search") ?? undefined;
  const is_featured = searchParams.get("is_featured");

  try {
    const { data, total } = await getProperties({
      type: type ?? undefined,
      category_id,
      city,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      status: "active",
      search,
      sort,
      page,
      limit,
    });

    // Filter by featured if requested
    const filteredData = is_featured === "true"
      ? data.filter((p) => p.is_featured)
      : data;

    return NextResponse.json({ data: filteredData, total });
  } catch (err) {
    console.error("[GET /api/properties]", err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
