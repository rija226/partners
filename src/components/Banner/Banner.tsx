import Image from "next/image";
import type { BannerBlock } from "@/src/types/blocks.types";
import * as S from "./Banner.style";

export default function Banner({ displayName, image }: BannerBlock) {
  if (!image?.url) return null;

  return (
    <S.Wrapper>
      <Image src={image.url} alt={displayName} fill priority sizes="100vw" />
    </S.Wrapper>
  );
}
