import {css} from 'lit-element';
// language=HTML
export const pageLayoutStyles = css`
  .page-content {
    margin: 24px;
  }

  section.page-content:not(.filters) {
    padding: 18px 24px;
  }

  section.page-content.filters {
    padding: 8px 24px;
  }

  section.page-content.no-padding {
    padding: 0;
  }
`;
