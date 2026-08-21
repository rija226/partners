import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DestinationButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 0;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  background: none;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  span {
    transform: ${({ $active }) => ($active ? "rotate(90deg)" : "none")};
    transition: transform 0.15s ease;
  }
`;

export const CategoryList = styled.div`
  padding: 0.25rem 0 0.5rem 1rem;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.65rem 0;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  span {
    transform: ${({ $active }) => ($active ? "rotate(90deg)" : "none")};
    transition: transform 0.15s ease;
  }
`;

export const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ItemLink = styled(Link)`
  display: block;
  font-size: 0.875rem;
  color: #475569;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ViewAllLink = styled(Link)`
  display: block;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

export const AllAccommodationLink = styled(Link)`
  display: block;
  margin-top: 0.5rem;
  padding: 0.85rem 0;
  border-top: 1px solid #e2e8f0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

export const EmptyState = styled.div`
  padding: 0.85rem 0;
  font-size: 0.875rem;
  color: #94a3b8;
`;
