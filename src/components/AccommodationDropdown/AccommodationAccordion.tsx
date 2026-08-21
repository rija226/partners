import { useState } from "react";
import { useTranslation } from "next-i18next/pages";
import type { AccommodationCategory } from "@/src/types/accommodation.types";
import { useAccommodationGroups, toHref, categoryHref, locationHref } from "./useAccommodationGroups";
import * as S from "./AccommodationAccordion.style";

// Mobile counterpart to AccommodationDropdown — same data (useAccommodationGroups), but tap-to-
// expand accordion stacked vertically instead of hover-driven flyouts opening sideways, since
// there's no hover on touch and no room for a flyout on a narrow screen. Lives inside the
// Header's mobile menu overlay, always visible there (no separate trigger of its own).
export default function AccommodationAccordion() {
  const { t } = useTranslation("common");
  const { accommodations, locationGroups } = useAccommodationGroups();
  const [openLocation, setOpenLocation] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<AccommodationCategory | "MICE" | null>(null);

  const toggleLocation = (location: string) => {
    setOpenCategory(null);
    setOpenLocation((current) => (current === location ? null : location));
  };

  const toggleCategory = (category: AccommodationCategory | "MICE") => {
    setOpenCategory((current) => (current === category ? null : category));
  };

  return (
    <S.Wrapper>
      {accommodations === null && <S.EmptyState>…</S.EmptyState>}
      {accommodations !== null && locationGroups.length === 0 && (
        <S.EmptyState>{t("accommodation.label")}</S.EmptyState>
      )}
      {locationGroups.map((group) => (
        <div key={group.location || "other"}>
          <S.DestinationButton
            type="button"
            $active={openLocation === group.location}
            onClick={() => toggleLocation(group.location)}
            aria-expanded={openLocation === group.location}
          >
            {group.location || t("accommodation.otherLocations")} <span>›</span>
          </S.DestinationButton>
          {openLocation === group.location && (
            <S.CategoryList>
              {group.categories.map((cat) => (
                <div key={cat.category}>
                  <S.CategoryButton
                    type="button"
                    $active={openCategory === cat.category}
                    onClick={() => toggleCategory(cat.category)}
                    aria-expanded={openCategory === cat.category}
                  >
                    {t(`accommodation.${cat.labelKey}`)} <span>›</span>
                  </S.CategoryButton>
                  {openCategory === cat.category && (
                    <S.ItemList>
                      {cat.items.map((item) => (
                        <li key={item.sys.id}>
                          <S.ItemLink href={toHref(item.seoMetaData.url)}>{item.name}</S.ItemLink>
                        </li>
                      ))}
                      <li>
                        <S.ViewAllLink href={categoryHref(cat.category, group.location || undefined)}>
                          {t("accommodation.all")} {t(`accommodation.${cat.labelKey}`)}
                          {group.location && ` ${t("accommodation.in")} ${group.location}`} →
                        </S.ViewAllLink>
                      </li>
                    </S.ItemList>
                  )}
                </div>
              ))}
              <S.ViewAllLink href={locationHref(group.location || undefined)}>
                {t("accommodation.allAccommodation")}
                {group.location && ` ${t("accommodation.in")} ${group.location}`} →
              </S.ViewAllLink>
            </S.CategoryList>
          )}
        </div>
      ))}
      <S.AllAccommodationLink href="/accommodation">{t("accommodation.allAccommodation")}</S.AllAccommodationLink>
    </S.Wrapper>
  );
}
