import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { AwardsCertificationsBlock } from "@/src/types/blocks.types";
import * as S from "./AwardsCertifications.style";

export default function AwardsCertifications({ title, slides }: AwardsCertificationsBlock) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
  }, [slides?.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 256) + 24; // card width + Track's gap
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  if (!slides?.length) return null;

  return (
    <S.Wrapper>
      <S.Inner>
        <S.Header>
          <S.Title>{title}</S.Title>
          <S.Arrows>
            <S.ArrowButton type="button" onClick={() => scrollByCard(-1)} disabled={!canScrollLeft} aria-label="Previous">
              ←
            </S.ArrowButton>
            <S.ArrowButton type="button" onClick={() => scrollByCard(1)} disabled={!canScrollRight} aria-label="Next">
              →
            </S.ArrowButton>
          </S.Arrows>
        </S.Header>
        <S.Track ref={trackRef} onScroll={updateArrows}>
          {slides.map((slide) => (
            <S.Card key={slide.sys.id} data-card>
              {slide.image?.url && (
                <S.ImageBox>
                  <Image src={slide.image.url} alt={slide.title} fill style={{ objectFit: "contain", objectPosition: "left" }} sizes="256px" />
                </S.ImageBox>
              )}
              <S.CardTitle>{slide.title}</S.CardTitle>
              {slide.description && <S.CardDescription>{slide.description}</S.CardDescription>}
            </S.Card>
          ))}
        </S.Track>
      </S.Inner>
    </S.Wrapper>
  );
}
