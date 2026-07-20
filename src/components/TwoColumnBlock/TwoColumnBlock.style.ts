import styled from "styled-components";

// RichText renders block-level tags (p/ul/...), so this must be a div, not the <p>-based
// DownloadsDescription from FactSheetGroup.style.ts — same look otherwise.
export const Description = styled.div`
  margin: 0 0 1.25rem;
  color: #475569;

  p {
    margin: 0 0 0.75rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;
