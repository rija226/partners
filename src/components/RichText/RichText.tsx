import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import * as S from "./RichText.style";

type RichTextProps = {
  adaptiveContent: Document;
};

export default function RichText({ adaptiveContent }: RichTextProps) {
  // A RichText field left empty in Contentful doesn't always come back as `undefined` — it can
  // arrive as a document-shaped object with no `content` array, which crashes
  // documentToReactComponents (it maps over `.content` unconditionally). Guard on the array,
  // not just truthiness of the field itself.
  if (!adaptiveContent?.content?.length) return null;
  return <S.Wrapper>{documentToReactComponents(adaptiveContent)}</S.Wrapper>;
}
