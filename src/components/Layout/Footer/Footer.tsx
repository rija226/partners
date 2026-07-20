import Image from "next/image";
import { useTranslation } from "next-i18next/pages";
import * as S from "./Footer.style";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <S.Wrapper>
      <S.Inner>
        <S.Brand>
          <Image
            src="/plava-laguna-partners-logo.png"
            alt="Plava Laguna Partners"
            width={120}
            height={40}
            style={{ height: "2rem", width: "auto", objectFit: "contain", opacity: 0.8 }}
          />
          <S.BrandLabel>Partner Portal</S.BrandLabel>
        </S.Brand>
        <S.Columns>
          <S.Links>
            <S.ExternalLink href="https://plavalaguna.com" target="_blank" rel="noopener noreferrer">
              plavalaguna.com
            </S.ExternalLink>
            <S.ExternalLink href="https://istracamping.com" target="_blank" rel="noopener noreferrer">
              istracamping.com
            </S.ExternalLink>
          </S.Links>
          <S.Notice>
            <S.NoticeTitle>{t("footer.importantNote")}</S.NoticeTitle>
            <p>{t("footer.copyright")}</p>
            <p>
              {t("footer.termsPrefix")}{" "}
              <S.TermsLink href="/terms-of-use">{t("footer.termsOfUse")}</S.TermsLink>
              {t("footer.termsSuffix")}
            </p>
            <p>{t("footer.forbiddenUse")}</p>
          </S.Notice>
        </S.Columns>
      </S.Inner>
    </S.Wrapper>
  );
}
