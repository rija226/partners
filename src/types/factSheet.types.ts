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
  // Both language files, always present regardless of the site's current locale —
  // the fact sheet section shows an EN and an HR download side by side.
  files: {
    en: FlattenedAsset;
    hr: FlattenedAsset;
  };
};
