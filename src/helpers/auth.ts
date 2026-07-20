import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { COOKIE_NAME } from "./auth-cookie-name";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.PARTNER_PASSWORD;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function serializeAuthCookie(): string {
  return serialize(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
