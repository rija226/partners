import type { FlattenedAsset } from "../adapters/contentful-response.adapter";

export type FactSheetFile = FlattenedAsset;

export type FactSheetGroup = {
  displayName: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: FlattenedAsset;
  updated?: string;
  fileDescription?: string;
  order?: number;
  // Required in Contentful, but older entries published before this field existed still come
  // back with it absent from the Delivery API response — treat that the same as "Other" (no
  // brand logo shown) rather than assuming it's always present.
  type?: "Plava Laguna" | "Istra Camping" | "Other";
  // Both language files, always present regardless of the site's current locale —
  // the fact sheet section shows an EN and an HR download side by side.
  files: {
    en: FlattenedAsset;
    hr: FlattenedAsset;
  };
};
