import styled from "styled-components";

export const Bar = styled.div<{ $width: number; $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: ${({ $width }) => $width}%;
  background: ${({ theme }) => theme.colors.accent};
  z-index: 2000;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: width 0.2s ease, opacity 0.2s ease;
  pointer-events: none;
`;
