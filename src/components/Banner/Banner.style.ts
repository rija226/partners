import styled from "styled-components";

// Breaks out of CmsPage.Wrapper's max-width:1200px container to span the full viewport
// width, since this is a full-bleed hero image (text is baked into the image itself).
// margin-top cancels that same Wrapper's `padding: 3rem 1rem` (CmsPage.style.ts) — the
// horizontal breakout alone still left the vertical padding above it as a visible gap under
// the header. If that padding value ever changes, this needs to match it.
export const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: -3rem;
  aspect-ratio: 3 / 1;
  min-height: 16rem;
  max-height: 32rem;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;
