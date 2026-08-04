import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation } from "@/src/types/accommodation.types";
import * as S from "./AccommodationHero.style";

export default function AccommodationHero({ accommodation }: { accommodation: Entry<Accommodation> }) {
  const { name, starRating } = accommodation;

  return (
    <S.Wrapper>
      {starRating && <S.Stars>{"★".repeat(starRating)}</S.Stars>}
      <S.Title>{name}</S.Title>
    </S.Wrapper>
  );
}
