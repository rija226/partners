import styled from "styled-components";
import Link from "next/link";

// Colors specific to this off-canvas menu redesign — deliberately not the site theme tokens
// (theme.colors.primary etc.), per the exact palette given for this component.
const NAVY = "#12303d";
const BLACK = "#111";
const GRAY_LABEL = "#a6a29b";
const DIVIDER_HEADER = "#ececec";
const INPUT_BORDER = "#d8d5cf";

// Positioned independently of Header.Bar's flex row (not a sibling flex item in it) — Bar's
// original flex + justify-content layout only ever accounted for 3 children (nav, logo,
// RightGroup); adding this as a 4th item there is what broke the logo's centering and sizing on
// desktop previously. Wrapper (Header.style.ts) is position:fixed, so this absolute positioning
// is relative to it regardless of where in the DOM this button sits.
export const ToggleButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  appearance: none;
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }

  span {
    display: block;
    height: 2px;
    background: ${NAVY};
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 0;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const OverlayHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid ${DIVIDER_HEADER};
`;

export const MenuTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${NAVY};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-right: -16px;
  border: none;
  border-radius: 0;
  background: none;
  appearance: none;
  font-size: 20px;
  line-height: 1;
  color: ${BLACK};
  cursor: pointer;
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Section = styled.div``;

export const SectionTitle = styled.div`
  padding: 24px 22px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${GRAY_LABEL};
`;

export const SearchForm = styled.form`
  display: flex;
  padding: 0 22px;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 52px;
  padding: 0 14px;
  border: 1px solid ${INPUT_BORDER};
  border-right: none;
  border-radius: 0;
  appearance: none;
  outline: none;
  font-size: 15px;
  color: ${NAVY};

  &::placeholder {
    color: #9c9890;
  }
`;

export const SearchSubmit = styled.button`
  height: 52px;
  padding: 0 22px;
  border: none;
  border-radius: 0;
  background: ${BLACK};
  appearance: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const LanguageToggle = styled.div`
  display: flex;
  margin: 0 22px;
  border: 1px solid ${BLACK};
  border-radius: 0;
`;

// display:flex + min-height (not just padding:13px 0 alone) so that if the 52px tap-target
// minimum ever pushes this taller than 13px padding + text would naturally be, the text stays
// vertically centered instead of sitting top-anchored with lopsided space below it.
export const LanguageOption = styled(Link)<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 0;
  min-height: 52px;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: ${({ $active }) => ($active ? BLACK : "white")};
  color: ${({ $active }) => ($active ? "white" : NAVY)};

  & + & {
    border-left: 1px solid ${BLACK};
  }
`;
