import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Heading = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: -0.5rem 0 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Item = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  background: white;
  overflow: hidden;
`;

export const ImageBox = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #e2e8f0;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  cursor: pointer;
`;

export const Caption = styled.span`
  padding: 0.5rem 0.75rem 0.75rem;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
`;

export const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  /* margin-top: auto pushes this to the bottom of Item's flex column regardless of how many
     lines Caption wraps to, so Download buttons line up across a row even when captions
     (image titles) are different lengths. */
  margin: auto 0.75rem 0.75rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.buttonBg};
  color: ${({ theme }) => theme.colors.buttonBg};
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.buttonBg};
    color: white;
  }
`;
