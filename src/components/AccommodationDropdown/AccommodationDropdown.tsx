import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next/pages";
import type { AccommodationCategory } from "@/src/types/accommodation.types";
import { useAccommodationGroups, toHref, categoryHref, locationHref } from "./useAccommodationGroups";
import * as S from "./AccommodationDropdown.style";

// Desktop-only 3-column cascading mega-menu (destination -> type -> hotels), joined edge-to-edge.
// Columns reveal progressively, not all at once: opening the menu shows only the destination
// column; column 2 appears once a destination is hovered/focused, column 3 once a type is.
// Below 1024px this whole component is hidden in favor of AccommodationAccordion in the mobile
// menu, since there's no hover on touch and no room for three side-by-side columns on a narrow
// screen.
export default function AccommodationDropdown() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const { accommodations, locationGroups } = useAccommodationGroups();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<AccommodationCategory | "MICE" | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  // Reset the revealed columns on every close, not just on open — otherwise a location/type
  // hovered before closing was still "remembered" on the next open, skipping straight back to
  // showing all 3 columns instead of starting over at just the destination column.
  const resetAndClose = () => {
    setOpen(false);
    setHoveredLocation(null);
    setHoveredCategory(null);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(resetAndClose, 150);
  };

  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    resetAndClose();
  };

  // Click-outside and Escape close the menu regardless of hover state — the 150ms hover-leave
  // delay above is what stops it closing while the pointer crosses the gap between columns.
  // Clearing the timer + resetting state inline here (not via closeNow/resetAndClose) since
  // those are recreated every render and would otherwise need to be effect dependencies.
  useEffect(() => {
    if (!open) return;
    function close() {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOpen(false);
      setHoveredLocation(null);
      setHoveredCategory(null);
    }
    function handlePointerDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // No default-active group/category — column 2 only appears once a destination is actually
  // hovered/focused, and column 3 only once a type is. Opening the menu reveals just the
  // destination column first, not everything at once.
  const activeGroup = locationGroups.find((g) => g.location === hoveredLocation);
  const activeCategory = activeGroup?.categories.find((c) => c.category === hoveredCategory);

  const selectLocation = (location: string) => {
    setHoveredLocation(location);
    setHoveredCategory(null);
  };

  return (
    <S.Wrapper ref={wrapperRef} onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <S.Trigger
        type="button"
        onClick={() => (open ? closeNow() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t("accommodation.label")} <span>▾</span>
      </S.Trigger>
      {open && (locationGroups.length === 0 ? (
        <S.EmptyPanel>{accommodations === null ? "…" : t("accommodation.label")}</S.EmptyPanel>
      ) : (
        <S.Panel role="menu">
          <S.Column1>
            <S.ColumnHeader>{t("accommodation.destination")}</S.ColumnHeader>
            {locationGroups.map((group) => {
              const isActive = group.location === activeGroup?.location;
              return (
                <S.DestinationRow
                  key={group.location || "other"}
                  type="button"
                  $active={isActive}
                  onMouseEnter={() => selectLocation(group.location)}
                  onFocus={() => selectLocation(group.location)}
                  onClick={() => selectLocation(group.location)}
                >
                  <span>{group.location || t("accommodation.otherLocations")}</span>
                  <S.Chevron $active={isActive}>›</S.Chevron>
                </S.DestinationRow>
              );
            })}
            <S.Divider />
            <S.ViewAllRow href="/accommodation">{t("accommodation.allAccommodation")} →</S.ViewAllRow>
          </S.Column1>

          {activeGroup && (
            <S.Column2>
              <S.ColumnHeader>{t("accommodation.byType")}</S.ColumnHeader>
              {activeGroup.categories.map((cat) => {
                const isActive = activeCategory?.category === cat.category;
                return (
                  <S.TypeRow
                    key={cat.category}
                    type="button"
                    $active={isActive}
                    onMouseEnter={() => setHoveredCategory(cat.category)}
                    onFocus={() => setHoveredCategory(cat.category)}
                    onClick={() => setHoveredCategory(cat.category)}
                  >
                    <span>{t(`accommodation.${cat.labelKey}`)}</span>
                    <S.Chevron $active={isActive}>›</S.Chevron>
                  </S.TypeRow>
                );
              })}
              <S.Divider />
              <S.ViewAllRow href={locationHref(activeGroup.location || undefined)}>
                {t("accommodation.allAccommodation")}
                {activeGroup.location && ` ${t("accommodation.in")} ${activeGroup.location}`} →
              </S.ViewAllRow>
            </S.Column2>
          )}

          {activeGroup && activeCategory && (
            <S.Column3>
              <S.ColumnHeader>
                {t(`accommodation.${activeCategory.labelKey}`)}
                {activeGroup.location && ` · ${activeGroup.location}`}
              </S.ColumnHeader>
              {activeCategory.items.map((item) => (
                <S.HotelRow key={item.sys.id} href={toHref(item.seoMetaData.url)}>
                  {item.name}
                </S.HotelRow>
              ))}
              <S.Divider />
              <S.ViewAllRow href={categoryHref(activeCategory.category, activeGroup.location || undefined)}>
                {t("accommodation.all")} {t(`accommodation.${activeCategory.labelKey}`)}
                {activeGroup.location && ` ${t("accommodation.in")} ${activeGroup.location}`} →
              </S.ViewAllRow>
            </S.Column3>
          )}
        </S.Panel>
      ))}
    </S.Wrapper>
  );
}
