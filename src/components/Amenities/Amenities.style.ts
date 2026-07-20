import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Heading = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0f172a;
  margin: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #334155;
  font-size: 0.8rem;
`;
