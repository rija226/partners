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
  min-height: ${({ $hasImage }) => ($hasImage ? "18rem" : "6rem")};
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
  background: linear-gradient(to top, rgba(15, 61, 62, 0.85), rgba(15, 61, 62, 0.15));
  z-index: 1;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 1.5rem 2rem;
  color: white;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
`;

export const UpdatedBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
`;

export const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.9);
`;

export const DownloadsSection = styled.div`
  padding: 1.5rem 2rem 2rem;
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
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 1.25rem;
  background: #f8fafc;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
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
  font-size: 0.7rem;
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
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    opacity: 0.92;
  }
`;
