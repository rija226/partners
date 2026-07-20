export type Entry<T> = T & {
  sys: { id: string; contentType: { sys: { id: string } } };
};

// Shape produced by flattenAsset below — same for images and other file types (PDFs
// just won't have width/height). Absent values are `null`, never `undefined` — Next's
// getStaticProps prop serialization rejects `undefined` but accepts `null`.
export type FlattenedAsset = {
  url: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  contentType: string | null;
  fileName: string | null;
  title: string | null;
  description: string | null;
};

type RawContentfulEntry = {
  sys: { id: string; type: string; contentType: { sys: { id: string } } };
  fields: Record<string, unknown>;
};

type RawContentfulAsset = {
  sys: { type: string };
  fields: {
    title?: string;
    description?: string;
    file?: {
      url?: string;
      contentType?: string;
      fileName?: string;
      details?: { size?: number; image?: { width?: number; height?: number } };
    };
  };
};

function isEntry(value: unknown): value is RawContentfulEntry {
  return Boolean(value && typeof value === "object" && (value as RawContentfulEntry).sys?.type === "Entry");
}

function isAsset(value: unknown): value is RawContentfulAsset {
  return Boolean(value && typeof value === "object" && (value as RawContentfulAsset).sys?.type === "Asset");
}

function flattenAsset(asset: RawContentfulAsset): FlattenedAsset {
  const file = asset.fields?.file;
  return {
    url: file?.url ? `https:${file.url}` : null,
    width: file?.details?.image?.width ?? null,
    height: file?.details?.image?.height ?? null,
    size: file?.details?.size ?? null,
    contentType: file?.contentType ?? null,
    fileName: file?.fileName ?? null,
    title: asset.fields?.title ?? null,
    description: asset.fields?.description ?? null,
  };
}

function flattenValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(flattenValue);
  }
  if (isAsset(value)) {
    return flattenAsset(value);
  }
  if (isEntry(value)) {
    return keepFieldsOnly(value);
  }
  return value;
}

// Generic Contentful entry -> flat object. No per-type parsers yet (picture/internalLink
// don't exist in the content model yet) — add a parsers map here if/when a content type
// needs custom shaping instead of plain field flattening.
export function keepFieldsOnly<T = Record<string, unknown>>(entry: RawContentfulEntry): Entry<T> {
  const flatFields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(entry.fields ?? {})) {
    flatFields[key] = flattenValue(value);
  }

  return {
    ...flatFields,
    sys: {
      id: entry.sys.id,
      contentType: { sys: { id: entry.sys.contentType.sys.id } },
    },
  } as Entry<T>;
}
