import { NextRequest, NextResponse } from "next/server";
import { getProperties } from "@/lib/queries/properties";
import {
  CONNECTION_UNAVAILABLE_MESSAGE,
  toUserFriendlyMessage,
  withConnectionRetry,
} from "@/lib/db-errors";

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
  try {
    const { data, total } = await withConnectionRetry(() =>
      getProperties({
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
      }),
    );
    return NextResponse.json({ data, total });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/properties]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
