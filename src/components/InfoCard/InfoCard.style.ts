import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Box = styled.div`
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 1rem;
  font-size: 0.875rem;
  color: #334155;

  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0.25rem 0;
  }

  p:empty {
    display: none;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;
