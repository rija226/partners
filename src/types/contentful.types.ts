import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "../adapters/contentful-response.adapter";

export type SeoMetaData = {
  displayName: string;
  url: string;
  seoTitle: string;
  seoDescription: string;
};

export type RichTextEntry = {
  displayName: string;
  adaptiveContent: Document;
};

export type Page = {
  displayName: string;
  seoMetaData: Entry<SeoMetaData>;
  // Page-builder array: heterogeneous content types, narrowed per-component in ComponentMapper.
  content: Entry<Record<string, unknown>>[];
};
