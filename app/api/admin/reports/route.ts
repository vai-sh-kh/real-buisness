import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getReportsData } from "@/lib/queries/reports";
import { CONNECTION_UNAVAILABLE_MESSAGE, toUserFriendlyMessage } from "@/lib/db-errors";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date_from = searchParams.get("date_from") ?? undefined;
    const date_to = searchParams.get("date_to") ?? undefined;
    const sort_activity = (searchParams.get("sort_activity") === "asc" ? "asc" : "desc") as "asc" | "desc";
    const data = await getReportsData({ date_from, date_to, sort_activity });
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/admin/reports]", err);
    const status = message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body = status === 503 ? { error: "Service temporarily unavailable. Please try again." } : { error: message };
    return NextResponse.json(body, { status });
  }
}
