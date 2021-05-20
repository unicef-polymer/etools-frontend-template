import {css} from 'lit-element';

// language=CSS
export const etoolsFiltersStyles = css`
  :host {
    display: flex;
    flex-direction: row;
    align-items: center;

    box-sizing: border-box;
    min-height: 62px;
    height: auto;
  }

  #filters {
    display: flex;
    flex-direction: row;
    align-items: center;

    flex-wrap: wrap;
    flex: 1;
    margin-right: auto;
  }

  #filters .filter {
    min-width: 160px;
    width: auto;
    min-height: 62px;
    height: auto;
  }

  #filters etools-dropdown.filter {
    /* TODO: 160px as requested makes etools-dropdown a little bit too small, no resize here...
    we might need to change this in the future (used only on reports filters) */
    width: 160px;
  }

  #filters .search {
    min-width: 280px;
  }

  iron-icon[icon='search'] {
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }

  #filters .filter.date {
    --paper-input-container: {
      width: 182px;
    }
    min-width: 180px;
  }

  #filters > *:not(:last-child) {
    margin-right: 16px;
  }

  #filters .filter.toggle {
    display: flex;
    flex-direction: row;
    align-items: center;

    cursor: pointer;
    font-weight: normal;
    font-size: 16px;
  }

  #filters .filter.toggle paper-toggle-button {
    margin-left: 10px;
  }

  #filters-selector {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    padding-inline-end: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    margin-inline-start: 24px;
    border-inline-start: 2px solid var(--light-divider-color, rgba(0, 0, 0, 0.12));
  }

  #filterMenu {
    max-width: 126px;
    padding: 0;
    --paper-menu-button-content: {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  #filterMenu .button {
    color: var(--primary-color, rgba(0, 0, 0, 0.87));
    font-weight: 500;
    margin: 0;
  }

  #filterMenu .button iron-icon {
    margin-right: 5px;
  }

  #filterMenu paper-listbox {
    min-width: 250px;
  }

  #filterMenu paper-icon-item {
    --paper-item-icon-width: auto;
    font-weight: normal;
  }

  #filterMenu paper-icon-item iron-icon {
    margin-right: 8px;
  }

  #filterMenu paper-icon-item[selected] {
    font-weight: normal;
    background: var(--etools-filters-menu-selected-bg, #dcdcdc);
  }

  paper-icon-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    min-height: 48px;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
  }

  .clear-all-filters {
    min-height: 48px;
    display: flex;

    flex-direction: row;

    align-items: center;
    color: var(--primary-color, rgba(0, 0, 0, 0.87));
    padding-right: 16px;
    border-bottom: 1px solid var(--light-divider-color, rgba(0, 0, 0, 0.12));
  }

  @media (max-width: 576px) {
    :host {
      flex-direction: column;
    }
    #filters .filter,
    #filters .search {
      width: 100%;
    }
    #filters .filter.date {
      --paper-input-container_-_width: 100%;
    }
    #filters-selector {
      border-inline-start: none;
      padding-inline-end: 8px;
      margin-top: 0;
      margin-bottom: 0;
      margin-inline-start: 0;
      margin: 0 auto;
      padding: 0px;
    }
  }
`;
