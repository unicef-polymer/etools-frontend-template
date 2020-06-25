import {css} from 'lit-element';
import {
  layoutHorizontal,
  layoutCenter,
  layoutEndJustified,
  layoutVertical,
  layoutStart
} from '../../../../styles/lit-styles/flex-layout-styles';

// language=CSS
export const etoolsPaginationStyles = css`
  :host {
    ${layoutHorizontal}
    ${layoutCenter}
    ${layoutEndJustified}
    font-size: 12px;
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }

  :host([do-not-show]) {
    display: none;
  }

  paper-item {
    cursor: pointer;
    height: 24px; /* for IE */
  }

  paper-icon-button {
    color: color: var(--dark-icon-color, #6f6f70);
  }

  paper-icon-button[disabled] {
    opacity: .33;
  }

  paper-icon-button:not([disabled]):hover {
    color: var(--primary-text-color);
  }

  #rows {
    margin-right: 24px;
  }

  #range {
    margin: 0 32px;
  }

  paper-dropdown-menu {
    width: 40px;
    bottom: 9px;
    bottom: -1px;
    --paper-input-container-input: {
      color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
      font-size: 12px;
      height: 24px;
      /* For IE below */
      ${layoutHorizontal}
      align-items: strech;
      max-width: 24px;
    };
    --paper-input-container-underline: {
      display: none;
    };
  }

  .pagination-item {
    ${layoutHorizontal}
    ${layoutCenter}
  }

  /* Mobile view CSS */
  :host([low-resolution-layout]) {
    padding: 8px 0;
    height: auto;
    ${layoutVertical}
    ${layoutStart}
  }

  :host([low-resolution-layout]) #range {
    margin: 0 0 0 24px;
  }

  :host([low-resolution-layout]) .pagination-btns {
    margin-left: -12px;
  }
`;
