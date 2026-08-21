import { useRef, useState } from "react";
import { useTranslation } from "next-i18next/pages";
import type { AccommodationCategory } from "@/src/types/accommodation.types";
import { useAccommodationGroups, toHref, categoryHref, locationHref } from "./useAccommodationGroups";
import * as S from "./AccommodationDropdown.style";

// Desktop-only: hover-driven 3-level flyout (destination -> category -> items). Below the
// 1024px breakpoint this whole component is hidden (S.Wrapper) in favor of AccommodationAccordion
// in the mobile menu, since hover doesn't exist on touch and side-flyouts have nowhere to open
// into on a narrow screen.
export default function AccommodationDropdown() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const { accommodations, locationGroups } = useAccommodationGroups();
  const [openLocation, setOpenLocation] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<AccommodationCategory | "MICE" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setOpenLocation(null);
      setOpenCategory(null);
    }, 150);
  };

  return (
    <S.Wrapper onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <S.Trigger onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        {t("accommodation.label")} <span>▾</span>
      </S.Trigger>
      {open && (
        <S.OuterPanel role="menu">
          {accommodations === null && <S.EmptyState>…</S.EmptyState>}
          {accommodations !== null && locationGroups.length === 0 && (
            <S.EmptyState>{t("accommodation.label")}</S.EmptyState>
          )}
          {locationGroups.map((group) => (
            <S.DestinationItem key={group.location || "other"} onMouseEnter={() => setOpenLocation(group.location)}>
              <S.DestinationLabel>
                {group.location || t("accommodation.otherLocations")} <span>›</span>
              </S.DestinationLabel>
              {openLocation === group.location && (
                <S.CategoryFlyout>
                  {group.categories.map((cat) => (
                    <S.CategoryItem key={cat.category} onMouseEnter={() => setOpenCategory(cat.category)}>
                      <S.CategoryLabel>
                        {t(`accommodation.${cat.labelKey}`)} <span>›</span>
                      </S.CategoryLabel>
                      {openCategory === cat.category && (
                        <S.ItemsFlyout>
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
                        </S.ItemsFlyout>
                      )}
                    </S.CategoryItem>
                  ))}
                  <S.ViewAllLink href={locationHref(group.location || undefined)}>
                    {t("accommodation.allAccommodation")}
                    {group.location && ` ${t("accommodation.in")} ${group.location}`} →
                  </S.ViewAllLink>
                </S.CategoryFlyout>
              )}
            </S.DestinationItem>
          ))}
          <S.AllAccommodationLink href="/accommodation">{t("accommodation.allAccommodation")}</S.AllAccommodationLink>
        </S.OuterPanel>
      )}
    </S.Wrapper>
  );
}
