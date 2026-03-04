import { NextRequest, NextResponse } from "next/server";
import { getAllActiveCategories } from "@/lib/queries/categories";

export async function GET(_req: NextRequest) {
  try {
    const data = await getAllActiveCategories();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
