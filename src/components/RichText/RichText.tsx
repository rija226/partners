import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

type RichTextProps = {
  adaptiveContent: Document;
};

export default function RichText({ adaptiveContent }: RichTextProps) {
  if (!adaptiveContent) return null;
  return <>{documentToReactComponents(adaptiveContent)}</>;
}
