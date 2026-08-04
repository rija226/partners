import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.15rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Menu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.75rem;
  width: 9rem;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 0.5rem 0;
`;

export const MenuItem = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 0.65rem 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  background: ${({ $active }) => ($active ? "#f8fafc" : "transparent")};
  text-decoration: none;

  &:hover {
    background: #f8fafc;
  }
`;
