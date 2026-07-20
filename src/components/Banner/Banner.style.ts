import styled from "styled-components";

// Breaks out of CmsPage.Wrapper's max-width:1200px container to span the full viewport
// width, since this is a full-bleed hero image (text is baked into the image itself).
export const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  aspect-ratio: 3 / 1;
  min-height: 16rem;
  max-height: 32rem;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;
