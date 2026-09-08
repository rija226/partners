import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { COOKIE_NAME } from "./auth-cookie-name";

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// envVar defaults to the partner login for backward compatibility — the admin login
// (pages/api/admin-login.ts) passes "ADMIN_PASSWORD" instead of duplicating this function.
export async function verifyPassword(password: string, envVar = "PARTNER_PASSWORD"): Promise<boolean> {
  const hash = process.env[envVar];
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

// maxAge omitted (undefined) makes this a session cookie — the browser drops it when the
// browser itself closes, not persisted across restarts. The partner login (pages/api/login.ts)
// explicitly passes COOKIE_MAX_AGE to keep its existing 30-day behavior; the admin login
// (pages/api/admin-login.ts) omits it on purpose so every new browser session re-prompts.
export function serializeAuthCookie(cookieName: string = COOKIE_NAME, maxAge?: number): string {
  return serialize(cookieName, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...(maxAge !== undefined ? { maxAge } : {}),
    path: "/",
  });
}

// maxAge: 0 tells the browser to drop the cookie immediately — same attributes as
// serializeAuthCookie (path/httpOnly/etc. must match for the browser to recognize this as
// clearing the same cookie rather than setting an unrelated one).
export function clearAuthCookie(cookieName: string = COOKIE_NAME): string {
  return serialize(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
