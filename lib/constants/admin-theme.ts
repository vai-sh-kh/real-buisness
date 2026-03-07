export const ADMIN_THEME_KEY = "admin_theme";
export const ADMIN_THEME_COOKIE = "admin_theme";
export const ADMIN_THEME_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export function setAdminThemeStorage(preference: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_THEME_KEY, preference);
    document.cookie = `${ADMIN_THEME_COOKIE}=${preference};path=/;max-age=${ADMIN_THEME_COOKIE_MAX_AGE};SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function getAdminThemeFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${ADMIN_THEME_COOKIE}=`));
    if (fromCookie) return fromCookie.split("=")[1] ?? null;
    return localStorage.getItem(ADMIN_THEME_KEY);
  } catch {
    return null;
  }
}
