import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/queries/leads";
import type { Lead } from "@/types";

// Public route — accepts lead submissions from the landing page CTA form
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    message,
    source = "website",
    property_id,
  } = body as Partial<Lead> & { property_id?: string };

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Either email or phone is required" },
      { status: 400 }
    );
  }

  try {
    const data = await createLead({
      name: name.trim(),
      email: email ?? null,
      phone: phone ?? null,
      message: message ?? null,
      source: source as Lead["source"],
      status: "new",
      property_id: property_id ?? null,
      property_title: null,
      notes: null,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit lead";
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
