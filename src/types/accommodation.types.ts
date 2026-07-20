import type { Entry, FlattenedAsset } from "../adapters/contentful-response.adapter";
import type { SeoMetaData } from "./contentful.types";

export type AccommodationCategory =
  | "Hotel"
  | "Apartment"
  | "Villa"
  | "Classic Camping"
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
};
