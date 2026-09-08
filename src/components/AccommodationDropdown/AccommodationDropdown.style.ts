import styled, { css } from "styled-components";
import Link from "next/link";

// Circe is already loaded globally (src/styles/fonts.ts, applied via _app.tsx) and inherited
// here automatically — no font-family override needed. If that ever stops being true, add
// @font-face for Circe here rather than reaching for a Google Font as a permanent stand-in.
const NAVY = "#12303d";
const TEXT = "#3a464d";
const HOTEL_TEXT = "#6b7680";
const CHEVRON_INACTIVE = "#c3bfb8";
const HOVER_BG = "#f5f8f9";
const BORDER = "#ececec";

export const Wrapper = styled.div`
  position: relative;
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
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

export const Panel = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 0.75rem;
  display: flex;
  box-shadow: 0 18px 44px -16px rgba(0, 0, 0, 0.32);
  z-index: 50;
`;

// Capped so a long hotel list (Column3, mostly) can't push the panel below the viewport on a
// shorter screen — 100vh minus roughly the header height + the panel's own top offset/shadow
// margin, so the scrollable area always ends with some breathing room above the bottom edge.
const columnBase = css`
  background: #fff;
  border: 1px solid ${BORDER};
  border-radius: 0;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;

  /* Thin, brand-colored scrollbar instead of the chunky default OS one — sharp corners on the
     thumb too, per the no-border-radius rule (browsers round it by default otherwise). */
  scrollbar-width: thin;
  scrollbar-color: ${CHEVRON_INACTIVE} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${CHEVRON_INACTIVE};
    border-radius: 0;
  }
`;

// Inner columns (1 and 2) skip their own right border — the next column's left border would
// otherwise sit right next to it, doubling the line at that shared edge.
export const Column1 = styled.div`
  ${columnBase}
  width: 250px;
  border-right: none;
`;

export const Column2 = styled.div`
  ${columnBase}
  width: 240px;
  border-right: none;
`;

export const Column3 = styled.div`
  ${columnBase}
  width: 270px;
`;

// Sticky within its own column's scroll container (columnBase's overflow-y: auto) — stays
// pinned at the top while the hotel list scrolls underneath it. Needs an opaque background
// (already has one) so scrolled-past rows don't show through.
export const ColumnHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${NAVY};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 12px 20px;
`;

export const Chevron = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? NAVY : CHEVRON_INACTIVE)};
`;

// Active gets a 3px left accent border eating into its own box; inactive has no border at all
// and instead pads 3px further left (20px -> 23px) so both land on the same text start position
// regardless of whether the accent border is actually there.
// A button, not a Link — the city itself doesn't navigate anywhere, it's purely the trigger
// that reveals column 2 (hover/focus/click all do the same thing).
export const DestinationRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  padding: ${({ $active }) => ($active ? "16px 20px" : "16px 20px 16px 23px")};
  border-left: ${({ $active }) => ($active ? `3px solid ${NAVY}` : "none")};
  border-radius: 0;
  background: none;
  font-size: 18px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? NAVY : TEXT)};
  text-align: left;
  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${HOVER_BG};
  }
`;

// A button, not a Link — same reasoning as DestinationRow: this is a trigger that reveals
// column 3, not a navigation target.
export const TypeRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  padding: ${({ $active }) => ($active ? "15px 20px" : "15px 20px 15px 23px")};
  border-left: ${({ $active }) => ($active ? `3px solid ${NAVY}` : "none")};
  border-radius: 0;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? NAVY : TEXT)};
  text-align: left;
  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${HOVER_BG};
  }
`;

export const HotelRow = styled(Link)`
  display: block;
  padding: 15px 20px;
  border-radius: 0;
  font-size: 15px;
  font-weight: 400;
  color: ${HOTEL_TEXT};
  text-decoration: none;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${HOVER_BG};
    color: ${NAVY};
  }
`;

export const Divider = styled.div`
  border-top: 1px solid ${BORDER};
`;

export const ViewAllRow = styled(Link)`
  display: block;
  padding: 12px 20px;
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${NAVY};
  text-decoration: none;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${HOVER_BG};
  }
`;

export const EmptyPanel = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 0.75rem;
  background: #fff;
  border: 1px solid ${BORDER};
  border-radius: 0;
  box-shadow: 0 18px 44px -16px rgba(0, 0, 0, 0.32);
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #94a3b8;
`;
