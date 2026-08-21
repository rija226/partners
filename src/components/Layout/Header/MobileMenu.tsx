import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import AccommodationAccordion from "@components/AccommodationDropdown/AccommodationAccordion";
import * as S from "./MobileMenu.style";

const LOCALE_LABELS: Record<string, string> = { en: "EN", hr: "HR" };

export default function MobileMenu() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentLocale = router.locale ?? "en";
  const locales = router.locales ?? ["en", "hr"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    setOpen(false);
    router.push({ pathname: "/accommodation", query: { search: query } });
  };

  return (
    <>
      <S.ToggleButton type="button" onClick={() => setOpen(true)} aria-label={t("accommodation.label")}>
        <span />
        <span />
        <span />
      </S.ToggleButton>
      {open && (
        <S.Overlay role="dialog" aria-modal="true">
          <S.OverlayHeader>
            <S.CloseButton type="button" onClick={() => setOpen(false)} aria-label="×">
              ×
            </S.CloseButton>
          </S.OverlayHeader>

          <S.Section>
            <S.SectionTitle>{t("accommodation.label")}</S.SectionTitle>
            <AccommodationAccordion />
          </S.Section>

          <S.Section>
            <S.SectionTitle>{t("search.label")}</S.SectionTitle>
            <S.SearchForm onSubmit={handleSearchSubmit}>
              <S.SearchInput
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t("search.placeholder")}
              />
              <S.SearchSubmit type="submit">{t("search.label")}</S.SearchSubmit>
            </S.SearchForm>
          </S.Section>

          <S.Section>
            <S.SectionTitle>{t("language.label")}</S.SectionTitle>
            <S.LanguageList>
              {locales.map((loc) => (
                <S.LanguageLink
                  key={loc}
                  href={{ pathname: router.pathname, query: router.query }}
                  locale={loc}
                  $active={loc === currentLocale}
                  onClick={() => setOpen(false)}
                >
                  {LOCALE_LABELS[loc] ?? loc}
                </S.LanguageLink>
              ))}
            </S.LanguageList>
          </S.Section>
        </S.Overlay>
      )}
    </>
  );
}
