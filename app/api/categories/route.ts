import { NextRequest, NextResponse } from "next/server";
import { getAllActiveCategories } from "@/lib/queries/categories";
import {
  CONNECTION_UNAVAILABLE_MESSAGE,
  toUserFriendlyMessage,
  withConnectionRetry,
} from "@/lib/db-errors";

export async function GET(_req: NextRequest) {
  try {
    const data = await withConnectionRetry(() => getAllActiveCategories());
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/categories]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
