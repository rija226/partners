import RichText from "@components/RichText/RichText";
import type { CardBlock } from "@/src/types/blocks.types";
import * as S from "./Card.style";

export default function Card({
  title,
  show,
  column1Title,
  column1Text,
  column2Title,
  column2Text,
  column3Title,
  column3Text,
}: CardBlock) {
  const columns = [
    { title: column1Title, text: column1Text },
    { title: column2Title, text: column2Text },
    { title: column3Title, text: column3Text },
  ];
  const visibleCount = Math.min(Number(show) || columns.length, 3);
  const visibleColumns = columns.slice(0, visibleCount).filter((col) => col.title && col.text);

  if (visibleColumns.length === 0) return null;

  return (
    <S.Wrapper>
      <S.Header>{title}</S.Header>
      <S.Body $columns={visibleColumns.length}>
        {visibleColumns.map((col) => (
          <S.Column key={col.title}>
            <S.ColumnTitle>{col.title}</S.ColumnTitle>
            <S.Accent />
            <S.ColumnContent>
              <RichText adaptiveContent={col.text!} />
            </S.ColumnContent>
          </S.Column>
        ))}
      </S.Body>
    </S.Wrapper>
  );
}
