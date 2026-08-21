import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    padding: 3rem 1rem;
    gap: 2rem;
  }
`;

// minmax(0, 1fr), not bare 1fr — a plain "1fr" track's minimum size defaults to the max of its
// items' min-content width (CSS Grid spec), so any unwrapped-text child anywhere inside forces
// the whole track (and the page) wider than the viewport instead of letting that text wrap.
// This was the real cause of FactSheetGroup's download cards overflowing on mobile — no amount
// of flex-wrap inside them mattered while the grid track itself refused to shrink below their
// content's natural width.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// $visible drives the scroll-reveal fade-in (useInView, wired up in ComponentMapper) — starts
// slightly faded/offset and settles into place once the block scrolls into view. The
// prefers-reduced-motion override is CSS-only (not a JS check in the hook) specifically to
// avoid a server/client hydration mismatch — see useInView.ts.
export const GridItem = styled.div<{ $fullWidth: boolean; $visible: boolean }>`
  ${({ $fullWidth }) => $fullWidth && "grid-column: 1 / -1;"}
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "20px")});
  transition: opacity 0.6s ease, transform 0.6s ease;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;
