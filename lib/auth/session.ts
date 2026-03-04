import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { AdminSession } from "@/types";

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const session = await getAdminSession();
    return session.isAdmin === true;
  } catch {
    return false;
  }
}
