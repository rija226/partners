import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { GalleryBlockType } from "@/src/types/blocks.types";
import { contentfulImageUrl } from "@helpers/contentful-image";
import * as S from "./GalleryBlock.style";

// The `download` attribute is ignored by browsers for cross-origin URLs (images.ctfassets.net
// isn't this site's origin) — it just navigates there instead of downloading. Fetching the
// asset as a blob and downloading that object URL works regardless of origin.
async function downloadFile(url: string, fileName: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(blobUrl);
}

export default function GalleryBlock({ description, images }: GalleryBlockType) {
  const { t } = useTranslation("common");
  const [index, setIndex] = useState(-1);

  if (!images?.length) return null;

  // Lightbox view uses a resized WebP (plenty for full-screen viewing) — the full-resolution
  // original is only fetched when the user actually clicks Download, not just to look at it.
  const slides = images.map((image) => ({
    src: image.url ? contentfulImageUrl(image.url, 1600) : "",
    alt: image.title ?? "",
    download: image.url ? { url: image.url, filename: image.fileName ?? "image" } : undefined,
  }));

  return (
    <S.Wrapper>
      <S.Heading>{t("common.gallery")}</S.Heading>
      {description && <S.Description>{description}</S.Description>}
      <S.Grid>
        {images.map((image, i) => {
          const caption = image.title || image.description || image.fileName || "";
          return (
            <S.Item key={image.url ?? i}>
              <S.ImageBox as="button" type="button" onClick={() => setIndex(i)}>
                {image.url && (
                  <Image
                    src={contentfulImageUrl(image.url, 600)}
                    alt={caption || `${i + 1}`}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                )}
              </S.ImageBox>
              {caption && <S.Caption>{caption}</S.Caption>}
              {image.url && (
                <S.DownloadLink
                  href={image.url}
                  onClick={(e) => {
                    e.preventDefault();
                    downloadFile(image.url as string, image.fileName ?? "image");
                  }}
                >
                  {t("common.download")}
                </S.DownloadLink>
              )}
            </S.Item>
          );
        })}
      </S.Grid>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Counter, Download, Zoom]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
      />
    </S.Wrapper>
  );
}
