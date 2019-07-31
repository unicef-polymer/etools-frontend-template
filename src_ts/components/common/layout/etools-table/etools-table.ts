import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-icons/iron-icons';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/polymer/lib/elements/dom-repeat';
import {property} from '@polymer/decorators/lib/decorators';

import {etoolsTableStyles} from './etools-table-styles';
import {GenericObject} from '../../../../types/globals';

export enum EtoolsTableColumnType {
  Text,
  Date,
  Link,
  Number
}

export enum EtoolsTableColumnSort {
  Asc,
  Desc
}

export interface EtoolsTableColumn {
  label: string; // column header label
  name: string; // property name from item object
  type: EtoolsTableColumnType;
  sort?: EtoolsTableColumnSort;
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

      <template is="dom-if" if="[[tableTitle]]">
        <div></div>
      </template>
      
      <table>
        <caption hidden$="[[showCaption(caption)]]">[[caption]]</caption>
        <thead>
          <tr>
            <template is="dom-repeat" items="[[columns]]" as="column">
              <th class$="[[getColumnClassList(column)]]">
                [[column.label]]
                <template is="dom-if" if="[[columnHasSort(column.sort)]]">
                  <iron-icon icon="[[getSortIcon(column.sort)]]"></iron-icon>
                </template>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[tableData]]">
            <tr>
              <template is="dom-repeat" items="[[items]]">
                <td>getItemValue(item, index)</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }

  @property({type: String})
  caption: string = '';

  @property({type: Array})
  columns: EtoolsTableColumn[] = [];

  @property({type: Array})
  items: GenericObject[] = [];

  showCaption(caption: string): boolean {
    return !caption;
  }


  // Columns
  getColumnClassList(column: EtoolsTableColumn): string {
    const classList: string[] = [];

    if (column.type === EtoolsTableColumnType.Number) {
      classList.push('right-align');
    }

    if (this.columnHasSort(column.sort)) {
      classList.push('sort');
    }

    return classList.join(' ');
  }

  columnHasSort(sort: EtoolsTableColumnSort | undefined): boolean {
    return sort === EtoolsTableColumnSort.Asc || sort === EtoolsTableColumnSort.Desc;
  }

  getSortIcon(sort: EtoolsTableColumnSort): string {
    return sort === EtoolsTableColumnSort.Asc ? 'arrow-upward' : 'arrow-downward';
  }

  // Rows
  getItemValue(item: any, itemIndex: number) {

  }

}

window.customElements.define('etools-table', EtoolsTable);
