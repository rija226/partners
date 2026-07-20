import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next/pages";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation, AccommodationCategory } from "@/src/types/accommodation.types";
import * as S from "./AccommodationDropdown.style";

// Contentful URLs are stored with a trailing slash (e.g. "/accommodation/hotel-parentium/"),
// but Next's default routing redirects trailing-slash URLs to their canonical no-slash form —
// strip it here so links go straight there instead of via an extra redirect.
function toHref(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

// All categories route to the single filterable listing page (pages/accommodation/index.tsx)
// via query params, not separate per-category pages.
const CATEGORY_ORDER: { category: AccommodationCategory; labelKey: string }[] = [
  { category: "Hotel", labelKey: "hotels" },
  { category: "Apartment", labelKey: "apartments" },
  { category: "Villa", labelKey: "villas" },
  { category: "Classic Camping", labelKey: "classicCamping" },
  { category: "Mobile Home", labelKey: "mobileHomes" },
  { category: "Glamping", labelKey: "glamping" },
  { category: "Naturist", labelKey: "naturist" },
];

function categoryHref(category: AccommodationCategory, location?: string): string {
  const params = new URLSearchParams({ type: category });
  if (location) params.set("location", location);
  return `/accommodation?${params.toString()}`;
}

type StarGroup = { rating: number; items: Entry<Accommodation>[] };
type LocationGroup = { location: string; starGroups: StarGroup[] };

function groupByLocationAndRating(items: Entry<Accommodation>[]): LocationGroup[] {
  const byLocation = new Map<string, Entry<Accommodation>[]>();
  for (const item of items) {
    const location = item.location ?? "";
    byLocation.set(location, [...(byLocation.get(location) ?? []), item]);
  }

  const groups = Array.from(byLocation.entries()).map(([location, locationItems]) => {
    const byRating = new Map<number, Entry<Accommodation>[]>();
    for (const item of locationItems) {
      const rating = item.starRating ?? 0;
      byRating.set(rating, [...(byRating.get(rating) ?? []), item]);
    }
    const starGroups = Array.from(byRating.entries())
      .sort(([a], [b]) => b - a)
      .map(([rating, ratingItems]) => ({ rating, items: ratingItems }));
    return { location, starGroups };
  });

  // Highest star rating first, across locations too — not just within one location block.
  return groups.sort((a, b) => (b.starGroups[0]?.rating ?? 0) - (a.starGroups[0]?.rating ?? 0));
}

export default function AccommodationDropdown() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [accommodations, setAccommodations] = useState<Entry<Accommodation>[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory>("Hotel");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/accommodations")
      .then((res) => res.json())
      .then((data: Entry<Accommodation>[]) => {
        if (!cancelled) setAccommodations(data);
      })
      .catch(() => {
        if (!cancelled) setAccommodations([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const categoriesWithItems = CATEGORY_ORDER.map((entry) => ({
    ...entry,
    items: (accommodations ?? []).filter((a) => a.type === entry.category),
  })).filter((entry) => entry.items.length > 0);

  const selected = categoriesWithItems.find((entry) => entry.category === selectedCategory) ?? categoriesWithItems[0];
  const locationGroups = selected ? groupByLocationAndRating(selected.items) : [];

  return (
    <S.Wrapper onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <S.Trigger onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        {t("accommodation.label")} <span>▾</span>
      </S.Trigger>
      {open && (
        <S.MegaMenu role="menu" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
          {accommodations === null && <S.EmptyState>…</S.EmptyState>}
          {accommodations !== null && categoriesWithItems.length === 0 && (
            <S.EmptyState>{t("accommodation.label")}</S.EmptyState>
          )}
          {categoriesWithItems.length > 0 && (
            <>
              <S.LeftPanel>
                <S.LeftHeading>{t("accommodation.byType")}</S.LeftHeading>
                {categoriesWithItems.map((entry) => (
                  <S.CategoryButton
                    key={entry.category}
                    type="button"
                    $active={entry.category === selected?.category}
                    onClick={() => setSelectedCategory(entry.category)}
                  >
                    {t(`accommodation.${entry.labelKey}`)}
                    {entry.category === selected?.category && <span>→</span>}
                  </S.CategoryButton>
                ))}
                <S.AllAccommodationLink href="/accommodation">{t("accommodation.allAccommodation")}</S.AllAccommodationLink>
              </S.LeftPanel>
              {selected && (
                <S.RightPanel>
                  <S.RightHeading href={categoryHref(selected.category)}>
                    {t("accommodation.all")} {t(`accommodation.${selected.labelKey}`)} →
                  </S.RightHeading>
                  {locationGroups.map((group) => (
                    <S.LocationBlock key={group.location || "unspecified"}>
                      <S.StarColumns>
                        {group.starGroups.map((starGroup) => (
                          <S.StarColumn key={starGroup.rating}>
                            <S.StarHeading>
                              {t(`accommodation.${selected.labelKey}`)} {group.location}{" "}
                              {starGroup.rating > 0 ? "★".repeat(starGroup.rating) : ""}
                            </S.StarHeading>
                            <S.ItemList>
                              {starGroup.items.map((item) => (
                                <li key={item.sys.id}>
                                  <S.ItemLink href={toHref(item.seoMetaData.url)}>{item.name}</S.ItemLink>
                                </li>
                              ))}
                            </S.ItemList>
                          </S.StarColumn>
                        ))}
                      </S.StarColumns>
                      {group.location && (
                        <S.ViewAllLink href={categoryHref(selected.category, group.location)}>
                          {t("accommodation.all")} {t(`accommodation.${selected.labelKey}`)} {t("accommodation.in")} {group.location} →
                        </S.ViewAllLink>
                      )}
                    </S.LocationBlock>
                  ))}
                </S.RightPanel>
              )}
            </>
          )}
        </S.MegaMenu>
      )}
    </S.Wrapper>
  );
}
