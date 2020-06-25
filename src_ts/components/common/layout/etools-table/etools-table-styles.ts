import {css} from 'lit-element';
import {layoutHorizontal, layoutCenter, layoutEndJustified} from '../../../styles/lit-styles/flex-layout-styles';

// language=HTML
export const etoolsTableStyles = css`
  :host {
    display: block;
    width: 100%;
    overflow-x: hidden;
  }

  a:focus {
    border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));
  }

  table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;
    box-sizing: border-box;
    display: table;
    border-spacing: 2px;
    border-color: var(--dark-divider-color, gray);
  }

  table td, table th {
    padding: .75rem;
    vertical-align: top;
    display: table-cell;
    text-align: left;
  }

  table th {
    font-size: var(--etools-table-col-header-font-size, 12px);
  }

  table td.right-align, table th.right-align {
    text-align: right;
  }

  table td {
    border-top: 1px solid var(--etools-table-rows-border-color, #dee2e6);
    font-size: var(--etools-table-col-font-size, 13px);
  }

  table td a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    outline: none;
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
    padding: 0 var(--etools-table-side-padding, 24px);
    box-sizing: border-box;
  }

  table tr th:first-child,
  table tr td:first-child {
    padding-left: var(--etools-table-side-padding, 24px);
  }

  table tr th:last-of-type,
  table tr td:last-of-type {
    padding-right: var(--etools-table-side-padding, 24px);
  }

  table tr td.pagination {
    padding-right: 16px;
  }

  /* action styles */
  .row-actions {
    position: relative;
    min-width: 100px;
  }

  .row-actions .actions {
    visibility: hidden;
    position: absolute;
    right: var(--etools-table-side-padding, 16px);
    top: 0;
    bottom: 0;
    ${layoutHorizontal}
    ${layoutCenter}
    ${layoutEndJustified}
    background: transparent;
  }

  tr:hover .row-actions .actions {
    visibility: visible;
  }

  .row-actions paper-icon-button {
    color: var(--dark-icon-color, #6f6f70);
  }

  .capitalize {
    text-transform: capitalize;
  }

  paper-checkbox[readonly] {
    pointer-events: none;
  }
`;
