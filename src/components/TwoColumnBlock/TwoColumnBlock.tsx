import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import type { TwoColumnBlockType } from "@/src/types/blocks.types";
import type { FlattenedAsset } from "@/src/adapters/contentful-response.adapter";
import RichText from "@components/RichText/RichText";
import * as S from "@components/FactSheetGroup/FactSheetGroup.style";
import * as Own from "./TwoColumnBlock.style";

function formatDate(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(contentType: string | null): string {
  if (!contentType) return "";
  return (contentType.split("/")[1] ?? contentType).toUpperCase();
}

function DownloadCard({ file, updatedLabel }: { file: FlattenedAsset; updatedLabel: string }) {
  const { t } = useTranslation("common");
  const heading = file.title || file.fileName || "";

  return (
    <S.Card>
      <S.CardMeta>
        <S.CardMetaLeft>
          <span>
            {formatFileType(file.contentType)} · {formatFileSize(file.size)}
          </span>
        </S.CardMetaLeft>
        {updatedLabel && <span>{t("factSheets.updated")} {updatedLabel}</span>}
      </S.CardMeta>
      {heading && <S.CardTitle>{heading}</S.CardTitle>}
      {file.description && <S.CardDescription>{file.description}</S.CardDescription>}
      <S.DownloadButton href={file.url ?? "#"} target="_blank" rel="noopener noreferrer">
        {t("factSheets.download")}
      </S.DownloadButton>
    </S.Card>
  );
}

export default function TwoColumnBlock({ title, description, file1, file2, image, updated }: TwoColumnBlockType) {
  const { t } = useTranslation("common");
  const files = [file1, file2].filter((file): file is FlattenedAsset => Boolean(file?.url));
  const updatedLabel = formatDate(updated);

  return (
    <S.Wrapper>
      <S.Hero $hasImage={Boolean(image?.url)}>
        {image?.url && (
          <>
            <Image src={image.url} alt={title ?? ""} fill priority />
            <S.HeroOverlay />
          </>
        )}
        <S.HeroContent>
          <S.BadgeRow>
            <S.Badge>{t("factSheets.partnersBadge")}</S.Badge>
          </S.BadgeRow>
          {title && (
            <S.TitleRow>
              <S.Title>{title}</S.Title>
            </S.TitleRow>
          )}
        </S.HeroContent>
      </S.Hero>
      <S.DownloadsSection>
        <S.DownloadsHeader>
          <S.DownloadsLabel>{t("factSheets.download")}</S.DownloadsLabel>
          <S.DownloadsBadge>{t("factSheets.forPartners")}</S.DownloadsBadge>
        </S.DownloadsHeader>
        {description && (
          <Own.Description>
            <RichText adaptiveContent={description} />
          </Own.Description>
        )}
        <S.CardsGrid>
          {files.map((file, i) => (
            <DownloadCard key={file.url ?? i} file={file} updatedLabel={updatedLabel} />
          ))}
        </S.CardsGrid>
      </S.DownloadsSection>
    </S.Wrapper>
  );
}
