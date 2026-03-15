import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getLeads, createLead } from "@/lib/queries/leads";
import { CONNECTION_UNAVAILABLE_MESSAGE, withConnectionRetry } from "@/lib/db-errors";
import type { Lead } from "@/types";

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
  const source = searchParams.get("source") ?? undefined;
  const sort_by = searchParams.get("sort_by") ?? "created_at";
  const sort_order = (searchParams.get("sort_order") as "asc" | "desc") ?? "desc";

  try {
    const { data, total } = await withConnectionRetry(() =>
      getLeads({
        page,
        limit,
        search,
        status: status as Lead["status"] | "all" | undefined,
        source: source as Lead["source"] | "all" | undefined,
        sort_by,
        sort_order,
      }),
    );

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch leads";
    console.error("[GET /api/admin/leads]", err);
    const status = message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body = status === 503 ? { error: "Service temporarily unavailable. Please try again." } : { error: message };
    return NextResponse.json(body, { status });
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

  try {
    const data = await createLead(
      body as Omit<Lead, "id" | "created_at" | "updated_at">
    );
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create lead";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
