import {html} from "@polymer/polymer/polymer-element";

// language=HTML
export const etoolsTableStyles = html`
  <style>
    :host {
      display: block;
      width: 100%;
    }

    table {
      width: 100%;
      margin-bottom: 1rem;
      color: #212529;
      border-collapse: collapse;
      box-sizing: border-box;
      display: table;
      border-spacing: 2px;
      border-color: grey;
    }

    table td, table th {
      padding: .75rem;
      vertical-align: top;
      display: table-cell;
      text-align: left;
    }

    table td.right-align, table th.right-align {
      text-align: right;
    }

    table td {
      border-top: 1px solid var(--etools-table-rows-border-color, #dee2e6);
    }

    table th {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      color: var(--etools-table-secondary-text-color, rgba(0, 0, 0, .54));
    }

    table th.sort:hover {
      color: var(--etools-table-primary-text-color, rgba(0, 0, 0, .84));
      cursor: pointer;
    }

    table th.sort iron-icon {
      width: 16px;
      height: 16px;
    }

    caption {
      width: 100%;
      height: 64px;
      line-height: 64px;
      font-size: 20px;
      text-align: left;
      color: var(--etools-table-text-color, #2b2b2b);
    }
  </style>
`;
