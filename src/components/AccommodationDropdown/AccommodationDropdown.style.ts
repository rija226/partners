import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.div`
  position: relative;
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export const Trigger = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const OuterPanel = styled.div`
  position: absolute;
  left: 0;
  margin-top: 0.75rem;
  width: 17rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0.5rem 0;
`;

// Each level (destination -> category -> items) is `position: relative` and its flyout child
// is `position: absolute; left: 100%` — the flyout is nested inside the same DOM element as
// its trigger, so moving the mouse from trigger to flyout never fires a `mouseleave` on the
// parent, no per-level hover-intent timer needed (only the outermost Wrapper needs one, to
// survive the trigger-to-panel gap).
export const DestinationItem = styled.div`
  position: relative;

  &:hover > div:first-child {
    background: #f8fafc;
  }
`;

export const DestinationLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: default;
`;

export const CategoryFlyout = styled.div`
  position: absolute;
  left: 100%;
  top: -0.5rem;
  width: 16rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
`;

export const CategoryItem = styled.div`
  position: relative;

  &:hover > div:first-child {
    background: #f8fafc;
  }
`;

export const CategoryLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
  cursor: default;
`;

export const ItemsFlyout = styled.ul`
  position: absolute;
  left: 100%;
  top: -0.5rem;
  width: 18rem;
  max-height: 22rem;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
`;

export const ItemLink = styled(Link)`
  display: block;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  color: #475569;
  text-decoration: none;

  &:hover {
    background: #f8fafc;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ViewAllLink = styled(Link)`
  display: block;
  margin-top: 0.25rem;
  padding: 0.65rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const AllAccommodationLink = styled(Link)`
  display: block;
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const EmptyState = styled.div`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
`;
