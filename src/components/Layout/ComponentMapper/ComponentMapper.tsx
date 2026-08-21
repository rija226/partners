import type { ComponentType } from "react";
import type { Entry } from "@adapters/contentful-response.adapter";
import RichText from "@components/RichText/RichText";
import FactSheetGroup from "@components/FactSheetGroup/FactSheetGroup";
import Card from "@components/Card/Card";
import InfoCard from "@components/InfoCard/InfoCard";
import QuickFactsBadges from "@components/QuickFactsBadges/QuickFactsBadges";
import Amenities from "@components/Amenities/Amenities";
import GalleryBlock from "@components/GalleryBlock/GalleryBlock";
import AwardsCertifications from "@components/AwardsCertifications/AwardsCertifications";
import Banner from "@components/Banner/Banner";
import IntroCard from "@components/IntroCard/IntroCard";
import TwoColumnBlock from "@components/TwoColumnBlock/TwoColumnBlock";
import RevealItem from "./RevealItem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous component registry, each entry has different props
const COMPONENT_MAP: Record<string, ComponentType<any>> = {
  RichText: RichText,
  FactSheetGroup: FactSheetGroup,
  Card: Card,
  InfoCard: InfoCard,
  QuickFactsBadges: QuickFactsBadges,
  Amenities: Amenities,
  GalleryBlock: GalleryBlock,
  AwardsCertifications: AwardsCertifications,
  Banner: Banner,
  IntroCard: IntroCard,
  TwoColumnBlock: TwoColumnBlock,
};

// Only "Card" (the 6 dark-header detail groups) renders at half width, two per row —
// everything else spans the full page width. Card's Wrapper stretches to match its row
// partner's height (Card.style.ts) so pairing two of uneven content-length doesn't look
// lopsided the way it did before that existed.
const HALF_WIDTH_TYPES = new Set(["Card"]);

function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

// Fail-fast on an unknown content type: a developer adds a row here as soon as a new
// content type is added in Contentful, so a silent skip would just hide a config bug.
export function mapComponents(componentsProps: Entry<Record<string, unknown>>[]) {
  return componentsProps.map((props, index) => {
    const contentTypeId = props.sys?.contentType?.sys?.id;
    if (!contentTypeId) throw new Error(`Component at index ${index} has no content type ID`);
    const componentName = capitalize(contentTypeId);
    const Component = COMPONENT_MAP[componentName];
    if (!Component) throw new Error(`Component ${componentName} is missing.`);
    return (
      <RevealItem key={props.sys?.id ?? index} fullWidth={!HALF_WIDTH_TYPES.has(componentName)}>
        <Component {...props} />
      </RevealItem>
    );
  });
}
