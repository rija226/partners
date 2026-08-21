import { useEffect, useState } from "react";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation, AccommodationCategory } from "@/src/types/accommodation.types";

// Contentful URLs are stored with a trailing slash (e.g. "/accommodation/hotel-parentium/"),
// but Next's default routing redirects trailing-slash URLs to their canonical no-slash form —
// strip it here so links go straight there instead of via an extra redirect.
export function toHref(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

export const CATEGORY_ORDER: { category: AccommodationCategory; labelKey: string }[] = [
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

export function categoryHref(category: AccommodationCategory | "MICE", location?: string): string {
  const params = new URLSearchParams(category === "MICE" ? { mice: "1" } : { type: category });
  if (location) params.set("location", location);
  return `/accommodation?${params.toString()}`;
}

export function locationHref(location?: string): string {
  return location ? `/accommodation?location=${encodeURIComponent(location)}` : "/accommodation";
}

export type CategoryGroup = { category: AccommodationCategory | "MICE"; labelKey: string; items: Entry<Accommodation>[] };
export type LocationGroup = { location: string; categories: CategoryGroup[] };

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

// Shared between the desktop hover-flyout (AccommodationDropdown) and the mobile tap-accordion
// (AccommodationAccordion) — same data/fetch/grouping, only the presentation differs per device.
export function useAccommodationGroups() {
  const [accommodations, setAccommodations] = useState<Entry<Accommodation>[] | null>(null);

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

  return { accommodations, locationGroups: groupByLocationThenType(accommodations ?? []) };
}
