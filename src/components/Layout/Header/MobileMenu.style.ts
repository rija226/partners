import styled from "styled-components";
import Link from "next/link";

export const ToggleButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }

  span {
    display: block;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: white;
  overflow-y: auto;
  padding: 1.5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const OverlayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

export const CloseButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  font-size: 1.75rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const Section = styled.div`
  padding: 1.5rem 0;
  border-top: 1px solid #e2e8f0;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

export const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.75rem;
`;

export const SearchForm = styled.form`
  display: flex;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-right: none;
  outline: none;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SearchSubmit = styled.button`
  padding: 0 1.25rem;
  border: none;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
`;

export const LanguageList = styled.div`
  display: flex;
  gap: 1rem;
`;

export const LanguageLink = styled(Link)<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.buttonBg : "#e2e8f0")};
  background: ${({ $active, theme }) => ($active ? theme.colors.buttonBg : "white")};
  color: ${({ $active }) => ($active ? "white" : "#334155")};
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
`;
