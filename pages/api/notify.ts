import type { NextApiRequest, NextApiResponse } from "next";
import { getNotificationEmails } from "@third-party/services/contentful-service";
import { ADMIN_COOKIE_NAME } from "@helpers/auth-cookie-name";

type Data = { sent: number } | { error: string };

// Manually triggered from /admin (not a Contentful webhook) — the admin page's own dropdown
// is the source of truth for these, kept here just as the human-readable label per type.
const NOTIFY_LABELS: Record<string, string> = {
  factSheetGroup: "New fact sheet published",
  galleryBlock: "New images added",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.cookies[ADMIN_COOKIE_NAME] !== "authenticated") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { type, title } = req.body ?? {};
  const label = typeof type === "string" ? NOTIFY_LABELS[type] : undefined;
  if (!label || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Missing or invalid type/title" });
  }

  const emails = await getNotificationEmails();
  if (emails.length === 0) return res.status(200).json({ sent: 0 });

  const siteUrl = process.env.SITE_URL ?? "";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
      to: emails,
      subject: `${label}: ${title}`,
      html: `<p>${label}: <strong>${title}</strong></p>${siteUrl ? `<p><a href="${siteUrl}">${siteUrl}</a></p>` : ""}`,
    }),
  });

  if (!response.ok) {
    console.error("Resend request failed:", await response.text());
    return res.status(502).json({ error: "Failed to send notification email" });
  }

  return res.status(200).json({ sent: emails.length });
}
