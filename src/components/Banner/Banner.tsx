import Image from "next/image";
import type { BannerBlock } from "@/src/types/blocks.types";
import { contentfulImageUrl } from "@helpers/contentful-image";
import * as S from "./Banner.style";

export default function Banner({ displayName, image }: BannerBlock) {
  if (!image?.url) return null;

  return (
    <S.Wrapper>
      <Image src={contentfulImageUrl(image.url, 1920)} alt={displayName} fill priority unoptimized sizes="100vw" />
    </S.Wrapper>
  );
}
