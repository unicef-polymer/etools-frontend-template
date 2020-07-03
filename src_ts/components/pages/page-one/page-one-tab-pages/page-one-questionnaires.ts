import {LitElement, html} from 'lit-element';

/**
 * @customElement
 * @polymer
 */
class PageOneQuestionnaires extends LitElement {
  render() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Page One Questionnaires tab content...
    `;
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}

window.customElements.define('page-one-questionnaires', PageOneQuestionnaires);
