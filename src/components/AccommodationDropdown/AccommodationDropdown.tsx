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

const CATEGORY_ORDER: { category: AccommodationCategory; labelKey: string }[] = [
  { category: "Hotel", labelKey: "hotels" },
  { category: "Apartment", labelKey: "apartments" },
  { category: "Villa", labelKey: "villas" },
  { category: "Campsites", labelKey: "campsites" },
  { category: "Mobile Home", labelKey: "mobileHomes" },
  { category: "Glamping", labelKey: "glamping" },
  { category: "Naturist", labelKey: "naturist" },
];

// Known locations show first, in this order; anything else (or missing location) falls back
// to a single "Other" bucket at the end — e.g. Hotel Parentium currently has no location set.
const LOCATION_ORDER = ["Poreč", "Umag"];

function categoryHref(category: AccommodationCategory | "MICE", location?: string): string {
  const params = new URLSearchParams(category === "MICE" ? { mice: "1" } : { type: category });
  if (location) params.set("location", location);
  return `/accommodation?${params.toString()}`;
}

function locationHref(location?: string): string {
  return location ? `/accommodation?location=${encodeURIComponent(location)}` : "/accommodation";
}

type CategoryGroup = { category: AccommodationCategory | "MICE"; labelKey: string; items: Entry<Accommodation>[] };
type LocationGroup = { location: string; categories: CategoryGroup[] };

function groupByLocationThenType(items: Entry<Accommodation>[]): LocationGroup[] {
  const byLocation = new Map<string, Entry<Accommodation>[]>();
  for (const item of items) {
    const location = item.location ?? "";
    byLocation.set(location, [...(byLocation.get(location) ?? []), item]);
  }

  const groups = Array.from(byLocation.entries()).map(([location, locationItems]) => {
    const categories: CategoryGroup[] = CATEGORY_ORDER.map((entry) => ({
      ...entry,
      items: locationItems.filter((item) => item.type === entry.category),
    })).filter((entry) => entry.items.length > 0);

    // MICE isn't a `type` value — it's a cross-cutting flag an item can have alongside any
    // type (e.g. a Hotel can also be MICE), so it's appended as its own bucket rather than
    // going through the type-based filter above.
    const miceItems = locationItems.filter((item) => item.mice);
    if (miceItems.length > 0) {
      categories.push({ category: "MICE", labelKey: "mice", items: miceItems });
    }

    return { location, categories };
  });

  return groups.sort((a, b) => {
    const aIndex = LOCATION_ORDER.indexOf(a.location);
    const bIndex = LOCATION_ORDER.indexOf(b.location);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default function AccommodationDropdown() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [accommodations, setAccommodations] = useState<Entry<Accommodation>[] | null>(null);
  const [openLocation, setOpenLocation] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<AccommodationCategory | "MICE" | null>(null);
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
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setOpenLocation(null);
      setOpenCategory(null);
    }, 150);
  };

  const locationGroups = groupByLocationThenType(accommodations ?? []);

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
