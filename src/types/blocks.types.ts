import type { Document } from "@contentful/rich-text-types";
import type { Entry, FlattenedAsset } from "../adapters/contentful-response.adapter";

// "card" content type — a dark-header block with 1-3 columns, `show` controls how many
// of the 3 column slots actually render (e.g. "2" for a two-column card).
export type CardBlock = {
  displayName: string;
  title: string;
  show: string;
  column1Title?: string;
  column1Text?: Document;
  column2Title?: string;
  column2Text?: Document;
  column3Title?: string;
  column3Text?: Document;
};

// "infoCard" content type — up to 3 short boxes (e.g. Pets / Check-in-out / Contact).
// Each box's own heading lives inside its RichText content (as a heading node), not as
// a separate title field.
export type InfoCardBlock = {
  additionalInfo1?: Document;
  additionalInfo2?: Document;
  additionalInfo3?: Document;
};

// "quickFactsBadges" content type — the highlight badge row under the hero.
export type QuickFactsBadgesBlock = {
  displayName: string;
  highlights: string[];
};

// "amenities" content type — the bottom amenities badge row.
export type AmenitiesBlock = {
  displayName: string;
  amenities: string[];
};

// "galleryBlock" content type.
export type GalleryBlockType = {
  displayName: string;
  images: FlattenedAsset[];
};

// "recognitionSlide" content type — one card in the awardsCertifications slider.
export type RecognitionSlideBlock = {
  displayName: string;
  image: FlattenedAsset;
  title: string;
  description?: string;
};

// "awardsCertifications" content type — the horizontal slider itself.
export type AwardsCertificationsBlock = {
  displayName: string;
  title: string;
  slides: Entry<RecognitionSlideBlock>[];
};

// "banner" content type — full-bleed hero image, text is baked into the image itself
// (confirmed with the user), no separate title/subtitle fields.
export type BannerBlock = {
  displayName: string;
  image: FlattenedAsset;
};

// "introCard" content type — a prominent left-accent-bordered intro/tagline block (e.g. "THE
// NEW TRADITION"). `description` is a plain Text field, not RichText — split on newlines into
// paragraphs when rendering, don't run it through the RichText component.
export type IntroCardBlock = {
  displayName: string;
  title?: string;
  description?: string;
};

// "twoColumnBlock" content type — two unrelated files shown side by side (e.g. a Sport map
// for Poreč and one for Umag), as opposed to factSheetGroup's single file always shown as an
// EN/HR translation pair. No per-file label field exists — file1/file2 are plain Asset links,
// so each card's heading/description comes from the Asset's own title/description metadata.
export type TwoColumnBlockType = {
  displayName: string;
  title?: string;
  description?: Document;
  file1?: FlattenedAsset;
  file2?: FlattenedAsset;
};
