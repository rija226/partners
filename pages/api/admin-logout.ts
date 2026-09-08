import type { NextApiRequest, NextApiResponse } from "next";
import { clearAuthCookie } from "@helpers/auth";
import { ADMIN_COOKIE_NAME } from "@helpers/auth-cookie-name";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ success: true }>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  res.setHeader("Set-Cookie", clearAuthCookie(ADMIN_COOKIE_NAME));
  return res.status(200).json({ success: true });
}
