import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

const COOKIE_NAME = "admin_session";

export async function POST() {
  const session = await getAdminSession();
  session.destroy();

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
