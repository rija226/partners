import Image from "next/image";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation } from "@/src/types/accommodation.types";
import * as S from "./AccommodationHero.style";

export default function AccommodationHero({ accommodation }: { accommodation: Entry<Accommodation> }) {
  const { name, location, starRating, featuredImage } = accommodation;

  return (
    <S.Wrapper>
      {featuredImage.url && <Image src={featuredImage.url} alt={name} fill priority />}
      <S.Overlay />
      <S.Content>
        {location && <S.Location>{location}</S.Location>}
        <S.Title>{name}</S.Title>
        {starRating && <S.Stars>{"★".repeat(starRating)}</S.Stars>}
      </S.Content>
    </S.Wrapper>
  );
}
