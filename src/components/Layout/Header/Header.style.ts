import styled from "styled-components";
import Link from "next/link";

// position: fixed instead of sticky — sticky depends on every ancestor up to the scrolling
// container having overflow: visible on both axes, which is fragile (a single overflow
// declaration anywhere in that chain silently breaks it). Fixed is relative to the viewport
// unconditionally, nothing else can undo it. Layout.style.ts's Main adds padding-top equal to
// this header's height so content doesn't render underneath it.
export const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: white;
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

// position:relative so LogoLink (absolutely positioned, see below) anchors against this
// 1200px-max-width bar specifically, not the full-viewport-width Wrapper.
export const Bar = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6.5rem;

  @media (min-width: 1024px) {
    justify-content: space-between;
  }
`;

export const NavWrapper = styled.nav`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

// Deliberately NOT a flex child of Bar — with justify-content:space-between, the logo's
// position depends on the actual widths of NavWrapper and RightGroup on either side of it,
// which differ between "Accommodation"/"Smještaj" (different text lengths per locale), visibly
// shifting the logo left/right when the language switches. Centering it via absolute
// positioning instead makes it independent of whatever is on either side, in any language.
export const LogoLink = styled(Link)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  height: 100%;
`;

export const RightGroup = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 1024px) {
    display: flex;
  }
`;
