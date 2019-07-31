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
      border-top: 1px solid var(--etools-table-rows-border-color, #dee2e6);
      display: table-cell;
      text-align: left;
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
