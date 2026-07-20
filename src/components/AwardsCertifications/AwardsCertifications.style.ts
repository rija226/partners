import styled from "styled-components";

export const Wrapper = styled.section`
  background: white;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  padding: 2.5rem 0;
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const Arrows = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ArrowButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const Track = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Card = styled.div`
  flex: 0 0 auto;
  width: 16rem;
  scroll-snap-align: start;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 5rem;
`;

export const CardTitle = styled.p`
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;
