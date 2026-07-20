import { useTranslation } from "next-i18next/pages";
import type { TwoColumnBlockType } from "@/src/types/blocks.types";
import type { FlattenedAsset } from "@/src/adapters/contentful-response.adapter";
import RichText from "@components/RichText/RichText";
import * as S from "@components/FactSheetGroup/FactSheetGroup.style";
import * as Own from "./TwoColumnBlock.style";

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatFileType(contentType: string | null): string {
  if (!contentType) return "";
  return (contentType.split("/")[1] ?? contentType).toUpperCase();
}

function DownloadCard({ file }: { file: FlattenedAsset }) {
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
      </S.CardMeta>
      {heading && <S.CardTitle>{heading}</S.CardTitle>}
      {file.description && <S.CardDescription>{file.description}</S.CardDescription>}
      <S.DownloadButton href={file.url ?? "#"} target="_blank" rel="noopener noreferrer">
        {t("factSheets.download")}
      </S.DownloadButton>
    </S.Card>
  );
}

export default function TwoColumnBlock({ title, description, file1, file2 }: TwoColumnBlockType) {
  const { t } = useTranslation("common");
  const files = [file1, file2].filter((file): file is FlattenedAsset => Boolean(file?.url));

  return (
    <S.Wrapper>
      <S.Hero $hasImage={false}>
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
            <DownloadCard key={file.url ?? i} file={file} />
          ))}
        </S.CardsGrid>
      </S.DownloadsSection>
    </S.Wrapper>
  );
}
