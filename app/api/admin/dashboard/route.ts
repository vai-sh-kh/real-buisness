import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { toUserFriendlyMessage } from "@/lib/db-errors";

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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
