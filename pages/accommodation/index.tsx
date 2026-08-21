import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticProps } from "next";
import Layout from "@components/Layout/Layout";
import { getAccommodations, PAGE_REVALIDATE } from "@third-party/services/contentful-service";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation, AccommodationCategory } from "@/src/types/accommodation.types";

const CATEGORIES: { value: AccommodationCategory; labelKey: string }[] = [
  { value: "Hotel", labelKey: "hotels" },
  { value: "Apartment", labelKey: "apartments" },
  { value: "Villa", labelKey: "villas" },
  { value: "Campsites", labelKey: "campsites" },
];

const STAR_OPTIONS = [4, 3, 2];

const LOCATIONS: NonNullable<Accommodation["location"]>[] = ["Poreč", "Umag"];

// Contentful URLs have a trailing slash; Next's routing redirects those to the canonical
// no-slash form — strip it so links go straight there (same fix as AccommodationDropdown).
function toHref(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1.5rem;
`;

const SearchRow = styled.form`
  display: flex;
  max-width: 28rem;
  margin: 0 auto 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-right: none;
  outline: none;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SearchSubmit = styled.button`
  padding: 0 1.25rem;
  border: none;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
`;

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Pill = styled.button<{ $active: boolean }>`
  padding: 0.4rem 0.9rem;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.buttonBg : "#e2e8f0")};
  background: ${({ $active, theme }) => ($active ? theme.colors.buttonBg : "white")};
  color: ${({ $active, theme }) => ($active ? "white" : theme.colors.buttonBg)};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.buttonBg};
  }
`;

const EmptyState = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  background: white;
  text-decoration: none;
  overflow: hidden;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardImageBox = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  background: #e2e8f0;
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const CardName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
`;

type AccommodationListProps = {
  accommodations: Entry<Accommodation>[];
};

export default function AccommodationListPage({ accommodations }: AccommodationListProps) {
  const router = useRouter();
  const { t } = useTranslation("common");

  const typeParam = typeof router.query.type === "string" ? router.query.type : null;
  const starsParam = typeof router.query.stars === "string" ? Number(router.query.stars) : null;
  const locationParam = typeof router.query.location === "string" ? router.query.location : null;
  const miceParam = router.query.mice === "1";
  const searchParam = typeof router.query.search === "string" ? router.query.search : null;
  const [searchValue, setSearchValue] = useState(searchParam ?? "");
  // Adjusting state during render (React's documented pattern for "derive from a prop but
  // allow local edits") — keeps the input in sync if the query changes via a source other
  // than this form itself (e.g. the header SearchBox, navigating to this same already-mounted
  // page with a new query), without the cascading-render effect that `useEffect` would cause.
  const [syncedSearchParam, setSyncedSearchParam] = useState(searchParam);
  if (searchParam !== syncedSearchParam) {
    setSyncedSearchParam(searchParam);
    setSearchValue(searchParam ?? "");
  }

  const setFilter = (key: "type" | "stars" | "location", value: string | null) => {
    const query = { ...router.query };
    if (value) query[key] = value;
    else delete query[key];
    router.push({ pathname: "/accommodation", query }, undefined, { shallow: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    router.push({ pathname: "/accommodation", query: { search: query } });
  };

  const filtered = accommodations.filter((item) => {
    if (typeParam && item.type !== typeParam) return false;
    if (starsParam && item.starRating !== starsParam) return false;
    if (locationParam && item.location !== locationParam) return false;
    if (miceParam && !item.mice) return false;
    if (searchParam) {
      const needle = searchParam.toLowerCase();
      const haystack = `${item.name} ${item.location ?? ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  return (
    <Layout>
      <Wrapper>
        <Title>{searchParam ? t("search.resultsFor", { query: searchParam }) : t("accommodation.allAccommodation")}</Title>

        {searchParam && (
          <SearchRow onSubmit={handleSearchSubmit}>
            <SearchInput
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("search.placeholder")}
            />
            <SearchSubmit type="submit">{t("search.label")}</SearchSubmit>
          </SearchRow>
        )}

        {!searchParam && (
          <FilterRow>
            <FilterGroup>
              <FilterLabel>{t("accommodation.byType")}</FilterLabel>
              <PillRow>
                <Pill type="button" $active={!typeParam} onClick={() => setFilter("type", null)}>
                  {t("accommodation.all")}
                </Pill>
                {CATEGORIES.map((category) => (
                  <Pill
                    key={category.value}
                    type="button"
                    $active={typeParam === category.value}
                    onClick={() => setFilter("type", category.value)}
                  >
                    {t(`accommodation.${category.labelKey}`)}
                  </Pill>
                ))}
              </PillRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>{t("accommodation.stars")}</FilterLabel>
              <PillRow>
                <Pill type="button" $active={!starsParam} onClick={() => setFilter("stars", null)}>
                  {t("accommodation.all")}
                </Pill>
                {STAR_OPTIONS.map((stars) => (
                  <Pill
                    key={stars}
                    type="button"
                    $active={starsParam === stars}
                    onClick={() => setFilter("stars", String(stars))}
                  >
                    {"★".repeat(stars)}
                  </Pill>
                ))}
              </PillRow>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>{t("accommodation.city")}</FilterLabel>
              <PillRow>
                <Pill type="button" $active={!locationParam} onClick={() => setFilter("location", null)}>
                  {t("accommodation.all")}
                </Pill>
                {LOCATIONS.map((location) => (
                  <Pill
                    key={location}
                    type="button"
                    $active={locationParam === location}
                    onClick={() => setFilter("location", location)}
                  >
                    {location}
                  </Pill>
                ))}
              </PillRow>
            </FilterGroup>
          </FilterRow>
        )}

        {filtered.length === 0 ? (
          <EmptyState>{t("accommodation.noResults")}</EmptyState>
        ) : (
          <Grid>
            {filtered.map((item) => (
              <Card key={item.sys.id} href={toHref(item.seoMetaData.url)}>
                <CardImageBox>
                  {item.featuredImage.url && (
                    <Image
                      src={item.featuredImage.url}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                </CardImageBox>
                <CardBody>
                  <CardName>{item.name}</CardName>
                  <CardMeta>
                    <span>{item.location}</span>
                    {item.starRating ? <span>{"★".repeat(item.starRating)}</span> : null}
                  </CardMeta>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Wrapper>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<AccommodationListProps> = async ({ locale }) => {
  const accommodations = await getAccommodations();

  return {
    props: {
      accommodations,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: PAGE_REVALIDATE,
  };
};
