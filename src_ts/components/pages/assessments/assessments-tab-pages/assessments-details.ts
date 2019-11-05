import {PolymerElement, html} from '@polymer/polymer/polymer-element';

/**
 * @customElement
 * @polymer
 */
class AssessmentDetails extends PolymerElement {

  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Assessment details here
    `;
  }

}

window.customElements.define('assessment-details', AssessmentDetails);
