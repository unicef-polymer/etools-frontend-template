import {html} from 'lit';

// language=HTML
export const countriesDropdownStyles = html`
  <style>
    *[hidden] {
      display: none !important;
    }

    :host {
      display: block;
      --sl-spacing-small: 0;
    }

    :host(:hover) {
      cursor: pointer;
    }

    etools-dropdown {
      --auto-size-available-height: 600px;
    }

    #languageSelector {
      width: 120px;
    }

    .w100 {
      width: 100%;
    }

    organizations-dropdown {
      width: 180px;
    }

    countries-dropdown {
      width: 160px;
    }

    etools-dropdown::part(display-input) {
      text-align: end;
    }

    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
      padding: 4px;
    }
    etools-dropdown::part(display-input)::placeholder {
      color: var(--sl-input-color);
      opacity: 1;
    }

    etools-dropdown::part(display-input)::-ms-input-placeholder {
      /* Edge 12-18 */
      color: var(--sl-input-color);
    }

    @media (max-width: 768px) {
      etools-dropdown {
        min-width: 130px;
        width: 130px;
      }
    }
  </style>
`;
