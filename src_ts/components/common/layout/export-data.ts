import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {getEndpoint} from '@unicef-polymer/etools-utils/dist/endpoint.util';
import {AnyObject, EtoolsEndpoint} from '@unicef-polymer/etools-types';
import {RequestEndpoint} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {translate} from 'lit-translate';

/**
 * @customElement
 * @LitElement
 */
@customElement('export-data')
export class ExportData extends LitElement {
  public render() {
    return html`
      <style>
        sl-menu-item::part(label) {
          text-align: left;
        }
        sl-dropdown sl-menu-item:focus-visible::part(base) {
          background-color: rgba(0, 0, 0, 0.1);
          color: var(--sl-color-neutral-1000);
        }
      </style>
      <sl-dropdown id="pdExportMenuBtn">
        <etools-button class="neutral" variant="text" slot="trigger">
          <etools-icon name="file-download"></etools-icon>
          ${translate('EXPORT')}
        </etools-button>
        <sl-menu>
          ${this.exportLinks.map(
            (item) => html` <sl-menu-item @click="${() => this.export(item.type)}">${item.name}</sl-menu-item>`
          )}
        </sl-menu>
      </sl-dropdown>
    `;
  }

  @property({type: Array})
  exportLinks: AnyObject[] = [
    {
      name: 'Export Excel',
      type: 'xlsx'
    },
    {
      name: 'Export CSV',
      type: 'csv'
    }
  ];

  @property({type: String})
  params = '';

  @property({type: String})
  endpoint = '';

  export(_type: string) {
    // Just an example

    if (_type == 'dummy') {
      const url = getEndpoint<EtoolsEndpoint, RequestEndpoint>((etoolsEndpoints as any).dummy).url;
      window.open(url, '_blank');
      return;
    }
    fireEvent(this, 'toast', {text: 'Export not implemented...'});
  }
}
