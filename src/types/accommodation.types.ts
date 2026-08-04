import type { Entry, FlattenedAsset } from "../adapters/contentful-response.adapter";
import type { SeoMetaData } from "./contentful.types";

// Values match the real Contentful data exactly (verified via API, not the blueprint's
// assumption) — this field has no enum validation in Contentful, so it's freeform text and
// worth re-checking against real entries if a new category type shows up unmatched.
export type AccommodationCategory =
  | "Hotel"
  | "Apartment"
  | "Villa"
  | "Campsites"
  | "Mobile Home"
  | "Glamping"
  | "Naturist";

export type AccommodationImage = FlattenedAsset;

export type Accommodation = {
  displayName: string;
  // This property's own detail-page SEO entry — `seoMetaData.url` is the route to link to.
  seoMetaData: Entry<SeoMetaData>;
  name: string;
  description?: string;
  type: AccommodationCategory;
  featuredImage: AccommodationImage;
  starRating?: number;
  location?: "Poreč" | "Umag";
  vacationType?: "All inclusive" | "Family" | "City";
  overallRating?: number;
  address?: string;
  mice?: boolean;
};
