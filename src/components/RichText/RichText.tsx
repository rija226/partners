import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import * as S from "./RichText.style";

type RichTextProps = {
  adaptiveContent: Document;
};

export default function RichText({ adaptiveContent }: RichTextProps) {
  if (!adaptiveContent) return null;
  return <S.Wrapper>{documentToReactComponents(adaptiveContent)}</S.Wrapper>;
}
