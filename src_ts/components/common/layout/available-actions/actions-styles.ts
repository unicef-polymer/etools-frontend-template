import {css, CSSResult} from 'lit';

// language=css
export const ActionsStyles: CSSResult = css`
  :host {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0px 30px;
    --green-color: #009688;
    --light-green-color: #00b3a1;
    --back-color: #233944;
    --cancel-color: #828282;
  }

  :host > * {
    margin-top: 7px;
    margin-bottom: 7px;
  }

  .main-button {
    --sl-color-primary-600: var(--green-color);
    --sl-color-primary-500: var(--green-color);
  }

  .main-button sl-menu-item:focus-visible::part(base) {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--sl-color-neutral-1000);
  }

  .main-button::part(prefix) {
    width: 10px;
  }
  .main-button.with-additional::part(label) {
    padding-inline-end: 0;
  }

  .main-button.with-additional span {
    margin-inline-end: 12px;
  }

  .main-button span {
    margin-inline-end: 7px;
  }

  .back-button {
    --sl-color-primary-600: var(--back-color);
    --sl-color-primary-500: var(--back-color);
  }

  .back-button span {
    margin-inline-start: 10px;
  }

  :host-context([dir='rtl']) .main-button.back-button svg {
    transform: scaleX(-1);
  }

  .cancel-background {
    --sl-color-primary-600: var(--cancel-color);
    --sl-color-primary-500: var(--cancel-color);
  }

  .reject-button {
    --sl-color-primary-600: var(--reject-color);
    --sl-color-primary-500: var(--reject-color);
  }

  sl-menu-item {
    --sl-font-weight-normal: bold;
    text-align: left;
  }

  .option-button {
    border-inline-start: 2px solid rgba(255, 255, 255, 0.12);
  }

  etools-button[size='small'] > etools-icon {
    padding-bottom: 2px;
    padding-left: 2px;
  }

  etools-button[slot='trigger'] {
    min-width: 45px;
    width: 45px;
    border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
    --sl-spacing-medium: 0;
  }
`;
