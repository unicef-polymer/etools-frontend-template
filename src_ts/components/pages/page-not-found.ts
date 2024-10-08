import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

// These are the shared styles needed by this element.
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {sharedStyles} from '../styles/shared-styles';

/**
 * @customElement
 * @LitElement
 */
@customElement('page-not-found')
export class PageNotFound extends LitElement {
  static get styles() {
    return [elevationStyles, pageLayoutStyles];
  }

  render() {
    return html`
      ${sharedStyles}
      <section class="page-content elevation" elevation="1">
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back <a href="${Environment.basePath}">home</a> and
          try again?
        </p>
      </section>
    `;
  }
}
