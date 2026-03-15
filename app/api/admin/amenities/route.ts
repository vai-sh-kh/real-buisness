import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getAmenities, createAmenity } from "@/lib/queries/amenities";
import { CONNECTION_UNAVAILABLE_MESSAGE } from "@/lib/db-errors";

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  try {
    const data = await getAmenities(!all);
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch amenities";
    console.error("[GET /api/admin/amenities]", err);
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

  const { name, icon } = body as { name?: string; icon?: string };
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Please enter the name" },
      { status: 400 }
    );
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    const data = await createAmenity({
      name: name.trim(),
      slug: slug || "amenity",
      icon: icon?.trim() || null,
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create amenity";
    console.error("[POST /api/admin/amenities]", err);
    const status = msg.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
