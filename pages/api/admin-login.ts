import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, serializeAuthCookie } from "@helpers/auth";
import { ADMIN_COOKIE_NAME } from "@helpers/auth-cookie-name";

type Data = { success: true } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body ?? {};
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const isValid = await verifyPassword(password, "ADMIN_PASSWORD");
  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  res.setHeader("Set-Cookie", serializeAuthCookie(ADMIN_COOKIE_NAME));
  return res.status(200).json({ success: true });
}
