import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  min-height: 22rem;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  img {
    object-fit: cover;
    z-index: 0;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
  z-index: 1;
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  padding: 1.5rem 2rem;
  color: white;
`;

export const Location = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 0.25rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

export const Stars = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.1rem;
  margin: 0.25rem 0 0;
`;
