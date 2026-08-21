import styled from "styled-components";

// Header is `position: fixed` (Header.style.ts) — this padding-top (matching Header.Bar's
// height, which itself steps up from 4.5rem to 6.5rem at the same 1024px breakpoint) keeps
// page content from starting underneath it.
export const Main = styled.main`
  padding-top: 4.5rem;

  @media (min-width: 1024px) {
    padding-top: 6.5rem;
  }
`;
