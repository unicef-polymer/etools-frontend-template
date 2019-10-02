import {LitElement, html, property, customElement} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './follow-up-dialog';
import {EtoolsTableColumn, EtoolsTableColumnType} from './etools-table'
import {GenericObject} from '../../../../types/globals';

@customElement('table-example')
export class TableExample extends (LitElement) {
  render() {
    return html`
      <style>
        :host {
          --ecp-content-padding: 0
        }
      </style>
      <etools-content-panel panel-title="Table Example">
        <etools-table .items="${this.dataItems}"
                      .columns="${this.columns}"
                      @edit-item="${this.editItem}"
                      @copy-item="${this.copyItem}"
                      showEdit
                      showCopy>
        </etools-table>
      </etools-content-panel>
    `;
  }

  @property({type: Array})
  dataItems: object[] = [];

  @property({type: Array})
  columns: EtoolsTableColumn[] = [
    {
      label: 'Has Access',
      name: 'hasAccess',
      type: EtoolsTableColumnType.Checkbox
    },
    {
      label: 'Reference #',
      name: 'reference_number',
      type: EtoolsTableColumnType.Link,
      link_tmpl: `/apd/action-points/detail/:id`
    }, {
      label: 'Action Point Category',
      name: 'url',
      type: EtoolsTableColumnType.Custom,
      customMethod: this.displayAPCategory,
    }, {
      label: 'Assignee (Section / Office)',
      name: 'assigned_to.name',
      type: EtoolsTableColumnType.Text
    }, {
      label: 'Due Date',
      name: 'due_date',
      type: EtoolsTableColumnType.Date
    }, {
      label: 'Priority',
      name: 'high_priority',
      type: EtoolsTableColumnType.Custom,
      customMethod: this.displayPriority,
    }
  ];

  editItem(event: GenericObject) {
    const data = event.detail;
  }

  copyItem(event: GenericObject) {
    const data = event.detail;
  }

  displayPriority(item: any) {
    return item.high_priority ? 'High' : '';
  }

  displayAPCategory(item: any) {
    return html`
     <a class="" href="${item.url}">Link text</a>
   `;
  }
}
