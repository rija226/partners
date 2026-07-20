import type { Document } from "@contentful/rich-text-types";
import RichText from "@components/RichText/RichText";
import type { InfoCardBlock } from "@/src/types/blocks.types";
import * as S from "./InfoCard.style";

export default function InfoCard({ additionalInfo1, additionalInfo2, additionalInfo3 }: InfoCardBlock) {
  const boxes = [additionalInfo1, additionalInfo2, additionalInfo3].filter((doc): doc is Document => Boolean(doc));
  if (boxes.length === 0) return null;

  return (
    <S.Grid>
      {boxes.map((doc, index) => (
        <S.Box key={index}>
          <RichText adaptiveContent={doc} />
        </S.Box>
      ))}
    </S.Grid>
  );
}
