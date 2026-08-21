import styled from "styled-components";

// Same palette/treatment as AccommodationDropdown.style.ts and LanguageSwitcher.style.ts, for
// visual consistency across all three nav-bar dropdowns/panels.
const NAVY = "#12303d";
const BORDER = "#ececec";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  color: ${NAVY};
  opacity: ${({ $active }) => ($active ? 0.6 : 1)};
  cursor: pointer;
`;

export const Panel = styled.form`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.75rem;
  display: flex;
  width: 18rem;
  max-width: 80vw;
  background: #fff;
  border: 1px solid ${BORDER};
  border-radius: 0;
  box-shadow: 0 18px 44px -16px rgba(0, 0, 0, 0.32);
  z-index: 50;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border: none;
  border-radius: 0;
  outline: none;
  font-size: 15px;
  color: ${NAVY};

  &::placeholder {
    color: #9ba3a8;
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  border: none;
  border-radius: 0;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  cursor: pointer;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    opacity: 0.9;
  }
`;
