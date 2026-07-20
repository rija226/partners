import type { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import CmsPage from "@components/CmsPage/CmsPage";
import { getPageByUrl, PAGE_REVALIDATE } from "@third-party/services/contentful-service";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Page } from "@/src/types/contentful.types";
import type { Accommodation } from "@/src/types/accommodation.types";

type CatchAllProps = {
  page: Entry<Page>;
  accommodation: Entry<Accommodation> | null;
};

export default function CatchAllPage({ page, accommodation }: CatchAllProps) {
  return <CmsPage page={page} accommodation={accommodation} />;
}

// No paths known at build time — every URL resolves (and gets cached) on first
// request instead, so newly published Contentful pages show up without a rebuild.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<CatchAllProps> = async ({ params, locale }) => {
  const slug = Array.isArray(params?.slug) ? params.slug : [];
  const url = `/${slug.join("/")}/`;

  const result = await getPageByUrl(url, locale ?? "en");
  if (!result) return { notFound: true };

  return {
    props: {
      page: result.page,
      accommodation: result.accommodation,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: PAGE_REVALIDATE,
  };
};
