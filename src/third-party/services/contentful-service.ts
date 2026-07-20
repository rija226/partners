import { createClient } from "contentful";
import { keepFieldsOnly, type Entry, type FlattenedAsset } from "@adapters/contentful-response.adapter";
import type { Page, SeoMetaData } from "@/src/types/contentful.types";
import type { Accommodation } from "@/src/types/accommodation.types";
import type { FactSheetGroup } from "@/src/types/factSheet.types";

const config = {
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN as string,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
};

const hasContentfulCreds = Boolean(config.space && config.accessToken);
const contentfulClient = hasContentfulCreds ? createClient(config) : null;

export const PAGE_REVALIDATE = 300;

// Generic fetch — every other function is a thin wrapper over this.
async function getEntries<T>(
  contentType: string,
  filter: Record<string, unknown> = {},
): Promise<Entry<T>[]> {
  if (!contentfulClient) return [];
  try {
    const response = await contentfulClient.getEntries({ content_type: contentType, include: 5, ...filter });
    return response.items.map((item) => keepFieldsOnly<T>(item));
  } catch (error) {
    console.error(`Error fetching ${contentType} from Contentful:`, error);
    return [];
  }
}

export type PageWithAccommodation = {
  page: Entry<Page>;
  // The accommodationObject that shares this page's seoMetaData entry, if any — lets a hotel's
  // own page render a hero (name/location/starRating/featuredImage) without duplicating that
  // data into yet another CMS block. Not every page has one (e.g. the homepage).
  accommodation: Entry<Accommodation> | null;
};

// Two-step lookup, same reason as the production reference: Contentful can't filter
// `page` entries by a nested reference field's own fields in one query, only by the
// linked entry's ID. So: find the seoMetaData entry for this URL, then find the page
// entry that links to it.
export async function getPageByUrl(url: string, locale: string): Promise<PageWithAccommodation | null> {
  const seoEntries = await getEntries<SeoMetaData>("seoMetaData", { "fields.url": url });
  const seo = seoEntries[0];
  if (!seo) return null;

  const [pages, accommodations] = await Promise.all([
    getEntries<Page>("page", { "fields.seoMetaData.sys.id": seo.sys.id }),
    getEntries<Accommodation>("accommodationObject", { "fields.seoMetaData.sys.id": seo.sys.id }),
  ]);
  const page = pages[0];
  if (!page) return null;

  // `factSheetGroup` entries embedded in a page's `content` array arrive flattened by the
  // generic single-locale fetch above (only whichever locale is default), which loses the
  // "both EN and HR file, always shown together" shape getFactSheetGroups builds. Swap those
  // entries for the properly locale-merged version.
  const hasFactSheetGroup = page.content.some((item) => item.sys.contentType.sys.id === "factSheetGroup");
  if (hasFactSheetGroup) {
    const factSheetGroups = await getFactSheetGroups(locale);
    const factSheetGroupById = new Map(factSheetGroups.map((f) => [f.sys.id, f]));
    page.content = page.content.map((item) =>
      item.sys.contentType.sys.id === "factSheetGroup" ? (factSheetGroupById.get(item.sys.id) ?? item) : item,
    );
  }

  return { page, accommodation: accommodations[0] ?? null };
}

export async function getAccommodations(): Promise<Entry<Accommodation>[]> {
  return getEntries<Accommodation>("accommodationObject");
}

// Contentful locale codes for this space (verified via `client.getLocales()`) vs. this
// site's next-i18next locale codes — "en" here, "en-US" there.
const CF_LOCALE: Record<string, string> = { en: "en-US", hr: "hr" };

type RawFactSheetGroup = Omit<FactSheetGroup, "files"> & { file: FlattenedAsset };

// `file` is a Contentful-localized field (native locale system, not a fileEn/fileHr field
// pair), but both language downloads must render together regardless of the site's current
// locale — so fetch each locale once and merge the `file` from the non-current locale in.
// Everything else (title/subtitle/description) comes from the current-locale fetch, which
// already has Contentful's own fallback-to-en-US applied server-side.
export async function getFactSheetGroups(siteLocale: string): Promise<Entry<FactSheetGroup>[]> {
  const isHr = siteLocale === "hr";
  const primaryLocale = isHr ? CF_LOCALE.hr : CF_LOCALE.en;
  const secondaryLocale = isHr ? CF_LOCALE.en : CF_LOCALE.hr;

  const [primaryEntries, secondaryEntries] = await Promise.all([
    getEntries<RawFactSheetGroup>("factSheetGroup", { locale: primaryLocale, order: "fields.order" }),
    getEntries<RawFactSheetGroup>("factSheetGroup", { locale: secondaryLocale }),
  ]);

  const secondaryFileById = new Map(secondaryEntries.map((e) => [e.sys.id, e.file]));

  return primaryEntries.map(({ file, ...entry }) => ({
    ...entry,
    files: isHr
      ? { hr: file, en: secondaryFileById.get(entry.sys.id) ?? file }
      : { en: file, hr: secondaryFileById.get(entry.sys.id) ?? file },
  })) as Entry<FactSheetGroup>[];
}
