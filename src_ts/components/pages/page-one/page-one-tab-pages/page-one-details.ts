import {LitElement, html} from 'lit-element';

/**
 * @customElement
 * @polymer
 */
class PageOneDetails extends LitElement {
  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Page One Details tab content
    `;
  }
}

window.customElements.define('page-one-details', PageOneDetails);
