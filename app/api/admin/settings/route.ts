import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { CONNECTION_UNAVAILABLE_MESSAGE } from "@/lib/db-errors";
import {
  getOrCreateAdminSettings,
  updateAdminSettings,
} from "@/lib/queries/settings";
import { adminSettingsSchema } from "@/lib/validations/settings.schema";

export async function GET() {
  try {
    const session = await requireAdminSession();
    const email = session.email;
    if (!email) {
      return NextResponse.json({ error: "Session invalid" }, { status: 401 });
    }
    let data;
    try {
      data = await getOrCreateAdminSettings(email);
    } catch (firstErr) {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
      if (msg === CONNECTION_UNAVAILABLE_MESSAGE) {
        try {
          data = await getOrCreateAdminSettings(email);
        } catch (retryErr) {
          console.error("[GET /api/admin/settings] retry failed", retryErr);
          return NextResponse.json(
            { error: "Service temporarily unavailable. Please try again." },
            { status: 503 }
          );
        }
      } else {
        throw firstErr;
      }
    }
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/admin/settings]", err);
    const message =
      err instanceof Error && err.message === CONNECTION_UNAVAILABLE_MESSAGE
        ? "Service temporarily unavailable. Please try again."
        : "Failed to fetch settings";
    const status =
      err instanceof Error && err.message === CONNECTION_UNAVAILABLE_MESSAGE
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdminSession();
    const email = session.email;
    if (!email) {
      return NextResponse.json({ error: "Session invalid" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = adminSettingsSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const message = firstError?.message ?? "Invalid request";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const data = await updateAdminSettings(email, parsed.data);
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : "Failed to update settings";
    console.error("[PATCH /api/admin/settings]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
