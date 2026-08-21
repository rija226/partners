import styled from "styled-components";

export const Button = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 60;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  font-size: 1.125rem;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
