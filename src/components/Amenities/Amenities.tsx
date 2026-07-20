import { useTranslation } from "next-i18next/pages";
import type { AmenitiesBlock } from "@/src/types/blocks.types";
import * as S from "./Amenities.style";

export default function Amenities({ amenities }: AmenitiesBlock) {
  const { t } = useTranslation("common");
  if (!amenities?.length) return null;

  return (
    <S.Wrapper>
      <S.Heading>{t("detail.amenities")}</S.Heading>
      <S.Row>
        {amenities.map((item) => (
          <S.Badge key={item}>{item}</S.Badge>
        ))}
      </S.Row>
    </S.Wrapper>
  );
}
