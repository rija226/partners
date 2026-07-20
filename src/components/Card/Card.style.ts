import styled from "styled-components";

// Wrapper is `display: flex; height: 100%` (not a fixed height) so it fills whatever height
// CSS Grid's row-stretch gives it (grid items stretch to the tallest item in the row by
// default) — a short Card paired with a long one ends up the same outer height, with its
// Body's background simply filling the extra space rather than leaving a blank gap below it.
// Empty space at the bottom of the shorter card is expected/fine; no scrolling.
export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Header = styled.div`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// A half-width Card is only ever wide enough for 2 real side-by-side columns. With 3
// columns, forcing a 2-column grid wraps the 3rd into a new implicit row — and since that
// row's height still matches whichever of the first row's two columns is tallest, the
// column sharing the 2nd row (usually much shorter) ends up stretched with a big empty gap
// before its own content. Stacking all 3 full-width (1 column) avoids that entirely — each
// column's height only ever depends on its own content.
export const Body = styled.div<{ $columns: number }>`
  flex: 1;
  background: #f8fafc;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem 2rem;
  align-content: start;

  @media (min-width: 640px) {
    grid-template-columns: repeat(${({ $columns }) => ($columns >= 3 ? 1 : $columns)}, 1fr);
  }
`;

export const Column = styled.div``;

export const ColumnTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0f172a;
  margin: 0 0 0.375rem;
`;

export const Accent = styled.div`
  width: 1.25rem;
  height: 3px;
  background: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.75rem;
`;

export const ColumnContent = styled.div`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #334155;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  li {
    padding-left: 1rem;
    position: relative;
  }

  li::before {
    content: "›";
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }

  p:empty {
    display: none;
  }
`;
