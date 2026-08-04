import styled from "styled-components";

// documentToReactComponents renders plain h1-h6/p/ul/ol/a/etc tags with no styling of their
// own — this had zero CSS before, so it fell back to raw browser defaults (inconsistent
// spacing, tiny default line-height) which is what made it look "thrown together". Targeting
// bare element selectors here (not classes) since the renderer doesn't add any of its own.
export const Wrapper = styled.div`
  color: #334155;
  line-height: 1.7;

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    line-height: 1.3;
    margin: 2rem 0 0.75rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.375rem;
  }

  h4 {
    font-size: 1.125rem;
  }

  p {
    font-size: 1.125rem;
    margin: 0 0 1rem;
  }

  ul,
  ol {
    margin: 0 0 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin: 0 0 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }

  strong,
  b {
    font-weight: 700;
  }

  blockquote {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
    color: #64748b;
    font-style: italic;
  }

  hr {
    margin: 2rem 0;
    border: none;
    border-top: 1px solid #e2e8f0;
  }
`;
