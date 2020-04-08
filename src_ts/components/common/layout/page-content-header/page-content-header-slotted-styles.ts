import {html} from 'lit-element';
import {layoutHorizontal, layoutEndJustified} from '../../../styles/lit-styles/flex-layout-styles';

/**
 * Used to style page content header title row actions child elements
 * (styling slotted content, using ::slotted will not work on Edge)
 */

// language=CSS
export const pageContentHeaderSlottedStyles = html`
  <style>
    .content-header-actions {
      ${layoutHorizontal}
      ${layoutEndJustified}
    }
  </style>
  `
;
