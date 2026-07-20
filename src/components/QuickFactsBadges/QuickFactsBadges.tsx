import type { QuickFactsBadgesBlock } from "@/src/types/blocks.types";
import * as S from "./QuickFactsBadges.style";

export default function QuickFactsBadges({ highlights }: QuickFactsBadgesBlock) {
  if (!highlights?.length) return null;

  return (
    <S.Row>
      {highlights.map((highlight) => (
        <S.Badge key={highlight}>{highlight}</S.Badge>
      ))}
    </S.Row>
  );
}
