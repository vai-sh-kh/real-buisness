import { NextRequest, NextResponse } from "next/server";
import { getAllActiveCategories } from "@/lib/queries/categories";
import { toUserFriendlyMessage } from "@/lib/db-errors";

export async function GET(_req: NextRequest) {
  try {
    const data = await getAllActiveCategories();
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
