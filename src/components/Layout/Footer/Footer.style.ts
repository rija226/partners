import styled from "styled-components";
import Link from "next/link";

export const Wrapper = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  margin-top: 3rem;
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
`;

export const BrandLabel = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
`;

export const Columns = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Notice = styled.div`
  flex: 1;

  @media (min-width: 1024px) {
    max-width: 42rem;
  }

  p {
    margin: 0.25rem 0;
  }
`;

export const NoticeTitle = styled.p`
  font-weight: 600;
`;

export const TermsLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
