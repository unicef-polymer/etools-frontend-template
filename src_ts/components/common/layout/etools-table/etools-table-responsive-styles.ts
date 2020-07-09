import {css} from 'lit-element';

// language=CSS
export const etoolsTableResponsiveStyles = css`
  /*
    Max width before this PARTICULAR table gets nasty
    This query will take effect for any screen smaller than 760px
    and also iPads specifically.
  */
  @media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px) {
    table {
      border: 0;
    }

    table caption {
      font-size: 1.3em;
    }

    table thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    table tr {
      border-top: 2px solid #ddd;
      display: block;
    }

    table tr td:first-child,
    table tr td:last-child {
      padding: 0.75rem;
    }

    table td {
      border-top: 1px solid var(--etools-table-rows-border-color, #dee2e6);
      display: block;
      font-size: 0.8em;
      text-align: right;
    }

    table td::before {
      content: attr(data-label);
      float: left;
      color: var(--etools-table-secondary-text-color, rgba(0, 0, 0, 0.54));
    }

    table td:first-child {
      border-top: 0;
    }

    table td:last-child {
      border-bottom: 0;
    }

    .row-actions .actions {
      visibility: visible;
    }
  }
`;
