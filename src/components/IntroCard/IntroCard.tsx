import type { IntroCardBlock } from "@/src/types/blocks.types";
import * as S from "./IntroCard.style";

export default function IntroCard({ title, description }: IntroCardBlock) {
  const paragraphs = description?.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];

  return (
    <S.Wrapper>
      {title && <S.Title>{title}</S.Title>}
      {paragraphs.map((paragraph, index) => (
        <S.Paragraph key={index}>{paragraph}</S.Paragraph>
      ))}
    </S.Wrapper>
  );
}
