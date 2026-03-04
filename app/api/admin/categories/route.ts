import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getCategories, createCategory } from "@/lib/queries/categories";
import type { Category } from "@/types";

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
  const sort_by = searchParams.get("sort_by") ?? "name";
  const sort_order = (searchParams.get("sort_order") as "asc" | "desc") ?? "asc";

  try {
    const { data, total } = await getCategories({
      page,
      limit,
      search,
      is_active: is_active !== null ? is_active === "true" : undefined,
      sort_by,
      sort_order,
    });

    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/categories]", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
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
      { error: "Category name is required" },
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
