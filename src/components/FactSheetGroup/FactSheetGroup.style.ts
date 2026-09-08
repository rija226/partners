import styled from "styled-components";

export const Wrapper = styled.section`
  border-radius: 0;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white;
`;

export const Hero = styled.div<{ $hasImage: boolean }>`
  position: relative;
  min-height: ${({ $hasImage }) => ($hasImage ? "23rem" : "6rem")};
  display: flex;
  align-items: flex-end;
  background: ${({ $hasImage, theme }) => ($hasImage ? "transparent" : theme.colors.primary)};

  img {
    object-fit: cover;
    z-index: 0;
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 61, 62, 0.55), rgba(15, 61, 62, 0.08));
  z-index: 1;
`;

// Pushed to the right edge of the flex row and right-aligned — matches FactSheetGroup's
// LogoBox-on-the-left layout even on TwoColumnBlock, which has no logo, for visual consistency
// across every Hero variant.
export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 1.5rem 2rem;
  color: white;
  margin-left: auto;
  text-align: right;
`;

// Both logo files are the same 2:1 (1418x709) aspect ratio — a fixed size here (not
// object-fit:contain within an arbitrary box) is what guarantees they render at identical
// dimensions regardless of which one is showing.
export const LogoBox = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5.5rem;
  height: 2.75rem;

  @media (min-width: 640px) {
    width: 11rem;
    height: 5.5rem;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.9);
`;

export const DownloadsSection = styled.div`
  padding: 1.25rem 1rem 1.5rem;

  @media (min-width: 640px) {
    padding: 1.5rem 2rem 2rem;
  }
`;

export const DownloadsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const DownloadsLabel = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const DownloadsBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 0;
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
`;

export const DownloadsDescription = styled.p`
  margin: 0 0 1.25rem;
  color: #475569;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

export const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 1rem;
  background: #f8fafc;

  @media (min-width: 640px) {
    padding: 1.25rem;
  }
`;

// flex-wrap so a long "Updated DD.MM.YYYY" on the right doesn't force this whole row (and the
// card, and the section) wider than the viewport on a narrow phone — it just drops to its own
// line instead when it doesn't fit next to the left-side badge/filesize text.
export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
`;

export const CardMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LanguageBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 0;
  font-weight: 700;
  font-size: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardTitle = styled.p`
  font-weight: 700;
  margin: 0 0 0.375rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem;
`;

export const DownloadButton = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 0;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  font-weight: 700;
  text-decoration: none;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    opacity: 0.92;
  }
`;
