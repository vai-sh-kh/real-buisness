import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getCategories, createCategory } from "@/lib/queries/categories";
import { CONNECTION_UNAVAILABLE_MESSAGE, withConnectionRetry } from "@/lib/db-errors";
import type { Category, CategoryFilters } from "@/types";

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
  const is_active = searchParams.get("is_active");
  const sortByParam = searchParams.get("sort_by") ?? "name";
  const sort_by: CategoryFilters["sort_by"] =
    sortByParam === "created_at" ? "created_at" : "name";
  const sort_order: "asc" | "desc" =
    searchParams.get("sort_order") === "desc" ? "desc" : "asc";

  try {
    const { data, total } = await withConnectionRetry(() =>
      getCategories({
        page,
        limit,
        search,
        is_active: is_active !== null ? is_active === "true" : undefined,
        sort_by,
        sort_order,
      }),
    );

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch categories";
    console.error("[GET /api/admin/categories]", err);
    const status = message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body =
      status === 503
        ? { error: "Service temporarily unavailable. Please try again." }
        : { error: message };
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

  const { name, description, icon, is_active } = body as Partial<Category>;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      { error: "Please enter the category name" },
      { status: 400 }
    );
  }

  try {
    const data = await createCategory({
      name: name.trim(),
      description: description ?? null,
      icon: icon ?? null,
      is_active: is_active ?? true,
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    console.error("[POST /api/admin/categories]", err);
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
