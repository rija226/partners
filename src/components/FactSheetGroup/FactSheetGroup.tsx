import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import type { FactSheetGroup as FactSheetGroupType, FactSheetFile } from "@/src/types/factSheet.types";
import * as S from "./FactSheetGroup.style";

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

function DownloadCard({ language, file, title, description, updatedLabel }: {
  language: "EN" | "HR";
  file: FactSheetFile;
  title: string;
  description?: string;
  updatedLabel: string;
}) {
  const { t } = useTranslation("common");

  return (
    <S.Card>
      <S.CardMeta>
        <S.CardMetaLeft>
          <S.LanguageBadge>{language}</S.LanguageBadge>
          <span>
            {formatFileType(file.contentType)} · {formatFileSize(file.size)}
          </span>
        </S.CardMetaLeft>
        {updatedLabel && <span>{t("factSheets.updated")} {updatedLabel}</span>}
      </S.CardMeta>
      <S.CardTitle>{title}</S.CardTitle>
      {description && <S.CardDescription>{description}</S.CardDescription>}
      <S.DownloadButton href={file.url ?? "#"} target="_blank" rel="noopener noreferrer">
        {t("factSheets.download")}
      </S.DownloadButton>
    </S.Card>
  );
}

export default function FactSheetGroup(props: FactSheetGroupType) {
  const { t } = useTranslation("common");
  const { title, subtitle, description, image, updated, fileDescription, files } = props;
  const updatedLabel = formatDate(updated);

  return (
    <S.Wrapper>
      <S.Hero $hasImage={Boolean(image?.url)}>
        {image?.url && (
          <>
            <Image src={image.url} alt={title} fill priority />
            <S.HeroOverlay />
          </>
        )}
        <S.HeroContent>
          <S.BadgeRow>
            <S.Badge>{t("factSheets.partnersBadge")}</S.Badge>
            <S.Badge>{t("factSheets.title")}</S.Badge>
          </S.BadgeRow>
          <S.TitleRow>
            <S.Title>{title}</S.Title>
            {updatedLabel && <S.UpdatedBadge>{t("factSheets.updated")} {updatedLabel}</S.UpdatedBadge>}
          </S.TitleRow>
          {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
        </S.HeroContent>
      </S.Hero>
      <S.DownloadsSection>
        <S.DownloadsHeader>
          <S.DownloadsLabel>{t("factSheets.download")}</S.DownloadsLabel>
          <S.DownloadsBadge>{t("factSheets.forPartners")}</S.DownloadsBadge>
        </S.DownloadsHeader>
        {description && <S.DownloadsDescription>{description}</S.DownloadsDescription>}
        <S.CardsGrid>
          <DownloadCard
            language="EN"
            file={files.en}
            title={`${t("factSheets.title")} – ${title} (EN)`}
            description={fileDescription}
            updatedLabel={updatedLabel}
          />
          <DownloadCard
            language="HR"
            file={files.hr}
            title={`${t("factSheets.title")} – ${title} (HR)`}
            description={fileDescription}
            updatedLabel={updatedLabel}
          />
        </S.CardsGrid>
      </S.DownloadsSection>
    </S.Wrapper>
  );
}
