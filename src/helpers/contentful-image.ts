// Builds a resized/WebP variant of a Contentful asset URL via Contentful's own Images API,
// so resizing happens on Contentful's CDN instead of this app's server proxying/re-encoding
// every image through next/image's built-in optimizer (which would otherwise count as this
// app's own hosting bandwidth for every view, on top of the origin fetch).
export function contentfulImageUrl(url: string, width: number, quality = 75): string {
  return `${url}?w=${width}&fm=webp&q=${quality}`;
}
