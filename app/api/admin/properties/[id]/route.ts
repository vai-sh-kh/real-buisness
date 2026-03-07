import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getPropertyById } from "@/lib/queries/properties";
import { createAdminClient } from "@/lib/supabase/admin";
import { propertySchema } from "@/lib/validations/property.schema";
import { slugify } from "@/lib/utils";
import { toUserFriendlyMessage } from "@/lib/db-errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await getPropertyById(id);

  if (!data) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = propertySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const slug =
    parsed.data.slug?.trim() ||
    (parsed.data.title ? slugify(parsed.data.title) : undefined);

  const updatePayload = Object.fromEntries(
    Object.entries({ ...parsed.data, slug, updated_at: new Date().toISOString() }).filter(
      ([, v]) => v !== undefined
    )
  );

  const { data, error } = await supabase
    .from("properties")
    .update(updatePayload as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[PUT /api/admin/properties/:id]", error);
    const status = (error as { code?: string }).code === "23505" ? 409 : 500;
    return NextResponse.json(
      { error: toUserFriendlyMessage(error) },
      { status }
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    console.error("[DELETE /api/admin/properties/:id]", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete property" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
