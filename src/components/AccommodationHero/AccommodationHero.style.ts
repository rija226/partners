import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
`;

export const Stars = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.125rem;
  margin: 0 0 0.5rem;
`;

export const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;

  /* Only forced onto one line from tablet width up, where there's room — on a narrow phone a
     long hotel name (e.g. "Hotel Materada Plava Laguna") would otherwise overflow the screen. */
  @media (min-width: 640px) {
    font-size: 2rem;
    white-space: nowrap;
  }
`;
