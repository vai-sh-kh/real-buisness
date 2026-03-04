import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/queries/reports";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getDashboardStats();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[GET /api/admin/dashboard]", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
