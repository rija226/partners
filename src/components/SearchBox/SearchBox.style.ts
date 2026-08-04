import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Panel = styled.form`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.75rem;
  display: flex;
  width: 18rem;
  max-width: 80vw;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.85rem;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  border: none;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
