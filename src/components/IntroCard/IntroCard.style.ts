import styled from "styled-components";

export const Wrapper = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem 2.5rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0f172a;
  margin: 0 0 1rem;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #334155;
  margin: 0 0 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;
