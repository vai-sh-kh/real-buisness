import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { CONNECTION_UNAVAILABLE_MESSAGE, toUserFriendlyMessage } from "@/lib/db-errors";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const data = await getDashboardStats(supabase);
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/admin/dashboard]", err);
    const status = message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body = status === 503 ? { error: "Service temporarily unavailable. Please try again." } : { error: message };
    return NextResponse.json(body, { status });
  }
}
