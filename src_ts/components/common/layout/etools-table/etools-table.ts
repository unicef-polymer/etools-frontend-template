import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/polymer/lib/elements/dom-repeat';
import {property} from '@polymer/decorators/lib/decorators';

import {etoolsTableStyles} from './etools-table-styles';
import {GenericObject} from "../../../../types/globals";

export type TEtoolsTableItems = {
  columns: any[];
  data: any[];
}

/**
 * @customElement
 * @polymer
 */
class EtoolsTable extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      ${etoolsTableStyles}

      Etools table element
      <template is="dom-if" if="[[tableTitle]]">
        <div></div>
      </template>
      
      <table>
        <caption hidden$="[[showCaption(caption)]]">[[caption]]</caption>
        <thead>
          <tr>
            <th>#NO</th>
            <th>Name</th>
            <th>Position</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[tableData]]">
            <tr>
              <td>[[item.id]]</td>
              <td>[[item.name]]</td>
              <td>[[item.position]]</td>
              <td>[[item.address]]</td>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }

  @property({type: String})
  caption: string = '';

  @property({type: Array})
  items: GenericObject[] = [];

  showCaption(caption: string): boolean {
    return !caption;
  }

}

window.customElements.define('etools-table', EtoolsTable);
