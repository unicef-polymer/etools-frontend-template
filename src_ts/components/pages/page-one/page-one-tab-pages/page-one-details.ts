import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

/**
 * @customElement
 */
@customElement('page-one-details')
export class PageOneDetails extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Page One Details tab content
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    // Disable loading message for tab load, triggered by parent element on stamp or by tap event on tabs
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'demo-page'
    });
  }
}
