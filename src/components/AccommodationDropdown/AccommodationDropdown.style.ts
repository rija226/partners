import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const MegaMenu = styled.div`
  position: absolute;
  left: 0;
  margin-top: 0.75rem;
  display: flex;
  width: max-content;
  max-width: min(90vw, 62rem);
  max-height: 32rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

export const LeftPanel = styled.div`
  width: 14rem;
  flex-shrink: 0;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  overflow-y: auto;
`;

export const LeftHeading = styled.div`
  padding: 0 1.5rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ $active, theme }) => ($active ? "white" : theme.colors.primary)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : "#e2e8f0")};
  }
`;

export const AllAccommodationLink = styled(Link)`
  display: block;
  margin-top: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  min-width: 0;
  padding: 1.75rem 2rem;
  overflow-y: auto;
`;

export const RightHeading = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const LocationBlock = styled.div`
  & + & {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #f1f5f9;
  }
`;

export const StarColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(11rem, 1fr));
  gap: 2rem;
`;

export const StarColumn = styled.div``;

export const StarHeading = styled.h4`
  margin: 0 0 0.85rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ItemLink = styled(Link)`
  font-size: 0.85rem;
  color: #475569;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
  }
`;

export const ViewAllLink = styled(Link)`
  display: inline-block;
  margin-top: 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const EmptyState = styled.div`
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: #94a3b8;
`;
