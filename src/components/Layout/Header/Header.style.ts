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

// Grid, not flex space-between — AccommodationDropdown (desktop nav) and MobileMenu's hamburger
// toggle share the left column and are shown/hidden by their own breakpoint CSS, so exactly one
// is visible at a time. A flex space-between would keep reserving a gap for whichever one is
// empty, throwing off the logo's centering; a fixed grid track doesn't have that problem.
export const Bar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 6.5rem;
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-self: center;
  height: 100%;
`;

export const RightGroup = styled.div`
  display: none;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;

  @media (min-width: 1024px) {
    display: flex;
  }
`;
