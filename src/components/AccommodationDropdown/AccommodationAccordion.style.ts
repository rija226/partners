import styled from "styled-components";
import Link from "next/link";

// Same palette as MobileMenu.style.ts (this accordion only ever renders inside that overlay).
const NAVY = "#12303d";
const DIVIDER_ROW = "#f0efec";
const HOVER_BG = "#f7f6f3";
const CHEVRON = "#c3bfb8";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DestinationButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 58px;
  padding: 0 22px;
  border: none;
  border-bottom: 1px solid ${DIVIDER_ROW};
  border-radius: 0;
  background: none;
  appearance: none;
  font-size: 19px;
  font-weight: 600;
  color: ${NAVY};
  cursor: pointer;

  &:hover {
    background: ${HOVER_BG};
  }

  span {
    color: ${CHEVRON};
    font-size: 20px;
    transform: ${({ $active }) => ($active ? "rotate(90deg)" : "none")};
    transition: transform 0.15s ease;
  }
`;

export const CategoryList = styled.div`
  padding-left: 14px;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 52px;
  padding: 0 22px 0 8px;
  border: none;
  border-bottom: 1px solid ${DIVIDER_ROW};
  border-radius: 0;
  background: none;
  appearance: none;
  font-size: 16px;
  font-weight: 600;
  color: ${NAVY};
  cursor: pointer;

  &:hover {
    background: ${HOVER_BG};
  }

  span {
    color: ${CHEVRON};
    font-size: 18px;
    transform: ${({ $active }) => ($active ? "rotate(90deg)" : "none")};
    transition: transform 0.15s ease;
  }
`;

export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 4px 8px;
  display: flex;
  flex-direction: column;
`;

export const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 0 22px;
  border-radius: 0;
  font-size: 15px;
  color: ${NAVY};
  text-decoration: none;

  &:hover {
    background: ${HOVER_BG};
  }
`;

export const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 0 22px;
  border-radius: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${NAVY};
  text-decoration: none;

  &:hover {
    background: ${HOVER_BG};
  }
`;

export const AllAccommodationLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 58px;
  padding: 0 22px;
  border-bottom: 1px solid ${DIVIDER_ROW};
  border-radius: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${NAVY};
  text-decoration: none;

  &:hover {
    background: ${HOVER_BG};
  }
`;

export const EmptyState = styled.div`
  padding: 18px 22px;
  font-size: 15px;
  color: #94a3b8;
`;
