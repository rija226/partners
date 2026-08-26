import styled from "styled-components";
import Link from "next/link";

// Same palette/treatment as AccommodationDropdown.style.ts, for visual consistency between the
// two nav-bar dropdowns.
const NAVY = "#12303d";
const HOVER_BG = "#f5f8f9";
const BORDER = "#ececec";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  font-size: 17px;
  font-weight: 400;
  color: ${NAVY};
  cursor: pointer;
`;

export const Menu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.75rem;
  width: 9rem;
  background: #fff;
  border: 1px solid ${BORDER};
  border-radius: 0;
  box-shadow: 0 18px 44px -16px rgba(0, 0, 0, 0.32);
  z-index: 50;
`;

// Same active/inactive padding-compensation trick as AccommodationDropdown's rows: active
// reserves 3px via its own border-left, inactive skips the border and pads 3px further right
// instead, so the text lines up either way.
export const MenuItem = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: ${({ $active }) => ($active ? "12px 20px" : "12px 20px 12px 23px")};
  border-left: ${({ $active }) => ($active ? `3px solid ${NAVY}` : "none")};
  border-radius: 0;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${NAVY};
  text-decoration: none;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${HOVER_BG};
  }
`;
