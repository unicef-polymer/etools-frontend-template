import {css} from 'lit-element';
import {layoutHorizontal, layoutEnd} from '../../../styles/lit-styles/flex-layout-styles';

/**
 * Used to style page content header title row actions child elements
 * (styling slotted content, using ::slotted will not work on Edge)
 */

// language=CSS
export const pageContentHeaderSlottedStyles = css`
  .content-header-actions {
    ${layoutHorizontal}
    ${layoutEnd}
  }
  @media (max-width: 576px) {
    .content-header-actions {
      display: block;
    }
  }
`;
