// Throwaway diagnostic — NOT a permanent test. Run after pointing .env.local at a (new)
// Contentful space, before trusting it against the content model the app code expects.
// Usage: npm run check-contentful-space
import { createClient } from "contentful";

async function main() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";

  if (!space || !accessToken) {
    console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_DELIVERY_TOKEN in the environment.");
    process.exit(1);
  }

  const client = createClient({ space, accessToken, environment });

  console.log(`Space: ${space}  Environment: ${environment}\n`);

  const locales = await client.getLocales();
  console.log("Locales:", locales.items.map((l) => `${l.code}${l.default ? " (default)" : ""}`).join(", "));

  const contentTypes = await client.getContentTypes();
  console.log(`\nContent types (${contentTypes.items.length}):`);
  for (const ct of contentTypes.items.sort((a, b) => a.sys.id.localeCompare(b.sys.id))) {
    console.log(`\n- ${ct.sys.id}  ("${ct.name}")`);
    for (const field of ct.fields) {
      console.log(`    ${field.id}: ${field.type}${field.localized ? " (localized)" : ""}`);
    }
  }

  console.log("\nEntry counts:");
  for (const ct of contentTypes.items) {
    const res = await client.getEntries({ content_type: ct.sys.id, limit: 0 });
    console.log(`  ${ct.sys.id}: ${res.total}`);
  }

  const subscribers = await client.getEntries({ content_type: "notificationSubscribers" });
  console.log("\nnotificationSubscribers entries:");
  for (const entry of subscribers.items) {
    console.log(`  ${entry.sys.id}:`, JSON.stringify(entry.fields.emails));
  }
}

main().catch((err) => {
  console.error("Failed to reach Contentful:", err.message ?? err);
  process.exit(1);
});
