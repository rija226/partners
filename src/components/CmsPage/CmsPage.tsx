import Head from "next/head";
import Layout from "@components/Layout/Layout";
import { mapComponents } from "@components/Layout/ComponentMapper/ComponentMapper";
import AccommodationHero from "@components/AccommodationHero/AccommodationHero";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Page } from "@/src/types/contentful.types";
import type { Accommodation } from "@/src/types/accommodation.types";
import * as S from "./CmsPage.style";

type CmsPageProps = {
  page: Entry<Page>;
  accommodation?: Entry<Accommodation> | null;
};

export default function CmsPage({ page, accommodation }: CmsPageProps) {
  return (
    <Layout>
      <Head>
        <title>{page.seoMetaData.seoTitle}</title>
        {page.seoMetaData.seoDescription && (
          <meta name="description" content={page.seoMetaData.seoDescription} />
        )}
      </Head>
      <S.Wrapper>
        {accommodation && <AccommodationHero accommodation={accommodation} />}
        <S.Grid>{mapComponents(page.content)}</S.Grid>
      </S.Wrapper>
    </Layout>
  );
}
