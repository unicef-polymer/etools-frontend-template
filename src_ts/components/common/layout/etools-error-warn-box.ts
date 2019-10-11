import {LitElement, html, customElement, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import '@polymer/paper-button/paper-button.js';
import {buttonsStyles} from '../../styles/button-styles';

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-error-warn-box')
export class EtoolsErrorWarnBox extends LitElement {

  public render() {
    // language=HTML

    if (this.messages.length === 0) {
      this.setAttribute('hidden', '');
    } else {
      this.removeAttribute('hidden');
    }

    return html`
      ${buttonsStyles}
      <style>
        :host {
          width: 100%;
        }
        :host([hidden]) {
          display: none;
        }

        .warning-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 24px;
          background-color: var(--warning-background-color);
          color: var(--warning-color);
          border:1px solid var(--warning-border-color);
        }
        .warning-item {
          @apply --layout-horizontal;
        }
        etools-content-panel {
          width: 100%;
        }
        .errors-box {
          margin-bottom: 25px;
        }

        .errors-box {
          --epc-header: {
            background-color: var(--error-box-heading-color);
          }
          --epc-header-color: var(---primary-background-color);
          --ecp-header-title: {
            text-align: center;
          }
          --ecp-content: {
            color: var(--error-box-text-color);
            background-color: var(--error-box-bg-color);
            border: 1px solid var(--error-box-border-color);
          };
        }
        ul {
          padding: 0 0 0 20px;
          margin: 0;
          padding-inline-start: 0px;
        }
        .errors-box-actions {
          margin-top: 20px;
          @apply --layout-horizontal;
          @apply --layout-end-justified;
        }
        paper-button {
          margin: 0;
        }
        .cancel-li-display {
          display: block;
        }
      </style>

      ${this.getHTML()}
    `;
  }

  @property({type: String})
  alertType: string = 'warning';

  @property({type: String})
  title: string = 'Error messages';

  @property({type: Array})
  messages: string[] = [];

  getHTML() {
    if (this.alertType === 'error') {
      return html`
      <etools-content-panel class="errors-box" panel-title="${this.title}">
          <ul>
            ${this.messages.map(msg => this.getErrorHTML(msg))}
          </ul>
          <div class="errors-box-actions">
            <paper-button raised class="error"
                          @tap="${this.resetErrors}">
              Dismiss
            </paper-button>
          </div>
      </etools-content-panel>
      `;
    } else {
      return html`
       <div class="warning-container">
          ${this.messages.map(msg => this.getWarningHTML(msg))}
       </div>
      `;
    }
  }

  getWarningHTML(msg: string) {
    return html`
    <div class="warning-item">
      ${msg}
    </div>
    `;
  }

  getErrorHTML(msg: string) {
    return html`<li class="cancel-li-display">${msg}</li>`;
  }

  resetErrors() {
    this.messages = [];
  }

}
