import {customElement, html, LitElement, property} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-listbox/paper-listbox';
import {GenericObject} from '../../../types/globals';

/**
 * @customElement
 * @LitElement
 */
@customElement('export-data')
export class ExportData extends LitElement {

  public render() {
    return html`
      <style>
        paper-menu-button{
          padding: 0px 24px;
        }
        paper-button{
          padding: 0px;
          margin-left: 10px;
          font-weight: bold;
          color: var(--secondary-text-color);
        }
        paper-button iron-icon {
          margin-right: 10px;
          color: var(--secondary-text-color);
        }
      </style>
      <paper-menu-button id="pdExportMenuBtn" close-on-activate horizontal-align="right">
          <paper-button slot="dropdown-trigger" class="dropdown-trigger">
            <iron-icon icon="file-download"></iron-icon>
            Export
          </paper-button>
          <paper-listbox slot="dropdown-content">
            ${this.exportLinks.map(item => html`
            <paper-item @tap="${() => this.export(item.type)}">${item.name}</paper-item>`)}
          </paper-listbox>
        </paper-menu-button>
    `;
  }

  @property({type: Array})
  exportLinks: GenericObject[] = [{
    name: 'Export Excel',
    type: 'xlsx'
  }, {
    name: 'Export CSV',
    type: 'csv'
  }];

  @property({type: String})
  params: string = '';

  @property({type: String})
  endpoint: string = '';

  export(type: string) {
    const url = this.endpoint + `export/${type}/` + (this.params ? `?${this.params}` : '');
    window.open(url, '_blank');
  }

}
