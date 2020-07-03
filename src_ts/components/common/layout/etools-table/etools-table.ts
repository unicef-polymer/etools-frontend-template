import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-checkbox/paper-checkbox';
import {customElement, LitElement, html, property} from 'lit-element';

import {etoolsTableStyles} from './etools-table-styles';
import {AnyObject} from '../../../../types/globals';
import {fireEvent} from '../../../utils/fire-custom-event';
import {prettyDate} from '../../../utils/date-utility';
import {EtoolsPaginator} from './pagination/paginator';
import './pagination/etools-pagination';
import get from 'lodash-es/get';
import {etoolsTableResponsiveStyles} from './etools-table-responsive-styles';

export enum EtoolsTableColumnType {
  Text,
  Date,
  Link,
  Number,
  Checkbox,
  Custom
}

export enum EtoolsTableColumnSort {
  Asc = 'asc',
  Desc = 'desc'
}

export interface EtoolsTableColumn {
  label: string; // column header label
  name: string; // property name from item object
  type: EtoolsTableColumnType;
  sort?: EtoolsTableColumnSort;
  /**
   * used only for EtoolsTableColumnType.Link to specify url template (route with a single param)
   * ex: `${ROOT_PATH}page-one/:id/details`
   *    - id will be replaced with item object id property
   */
  link_tmpl?: string;
  isExternalLink?: boolean;
  capitalize?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  customMethod?: Function;
}

export enum EtoolsTableActionType {
  Edit,
  Delete,
  Copy
}

/**
 * @customElement
 * @LitElement
 */
@customElement('etools-table')
export class EtoolsTable extends LitElement {
  static get styles() {
    return [etoolsTableResponsiveStyles, etoolsTableStyles];
  }
  public render() {
    // language=HTML
    return html`
      <table>
        <caption ?hidden="${this.showCaption(this.caption)}">
          ${this.caption}
        </caption>
        <thead>
          <tr>
            ${this.columns.map((column: EtoolsTableColumn) => this.getColumnHtml(column))}
            ${this.showRowActions() ? html`<th></th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this.items.map((item: any) => this.getRowDataHtml(item, this.showEdit))}
          ${this.paginator ? this.paginationHtml : ''}
        </tbody>
      </table>
    `;
  }

  @property({type: String})
  dateFormat = 'D MMM YYYY';

  @property({type: Boolean, reflect: true})
  showEdit!: boolean;

  @property({type: Boolean, reflect: true})
  showDelete!: boolean;

  @property({type: Boolean, reflect: true})
  showCopy!: boolean;

  @property({type: String})
  caption = '';

  @property({type: String})
  actionsLabel = 'Actions';

  @property({type: Array})
  columns: EtoolsTableColumn[] = [];

  @property({type: Array})
  items: AnyObject[] = [];

  @property({type: Object})
  paginator!: EtoolsPaginator;

  private defaultPlaceholder = '—';

  getColumnHtml(column: EtoolsTableColumn) {
    if (!this.columnHasSort(column.sort)) {
      return html` <th class="${this.getColumnClassList(column)}">${column.label}</th> `;
    } else {
      return this.getColumnHtmlWithSort(column);
    }
  }

  getColumnHtmlWithSort(column: EtoolsTableColumn) {
    return html`
      <th class="${this.getColumnClassList(column)}" @tap="${() => this.toggleAndSortBy(column)}">
        ${column.label}
        ${this.columnHasSort(column.sort)
          ? html`<iron-icon .icon="${this.getSortIcon(column.sort as EtoolsTableColumnSort)}"> </iron-icon>`
          : ''}
      </th>
    `;
  }

  getLinkTmpl(pathTmpl: string | undefined, item: any, key: string, isExternalLink?: boolean) {
    if (!pathTmpl) {
      throw new Error(`[EtoolsTable.getLinkTmpl]: column "${item[key]}" has no link tmpl defined`);
    }
    const path = pathTmpl.split('/');
    path.forEach((p: string, index: number) => {
      if (p.slice(0, 1) === ':') {
        const param = p.slice(1);
        path[index] = item[param];
      }
    });
    const aHref = path.join('/');
    return isExternalLink
      ? html`<a class="" @click="${() => (window.location.href = aHref)}" href="#">${item[key]}</a>`
      : html`<a class="" href="${aHref}">${item[key]}</a>`;
  }

  getRowDataHtml(item: any, showEdit: boolean) {
    const columnsKeys = this.getColumnsKeys();
    return html`
      <tr>
        ${columnsKeys.map(
          (k: string) => html`<td
            data-label="${this.getColumnDetails(k).label}"
            class="${this.getRowDataColumnClassList(k)}"
          >
            ${this.getItemValue(item, k, showEdit)}
          </td>`
        )}
        ${this.showRowActions()
          ? html`<td data-label="${this.actionsLabel}" class="row-actions">&nbsp;${this.getRowActionsTmpl(item)}</td>`
          : ''}
      </tr>
    `;
  }

  getRowActionsTmpl(item: any) {
    return html`
      <div class="actions">
        <paper-icon-button
          ?hidden="${!this.showEdit}"
          icon="create"
          @tap="${() => this.triggerAction(EtoolsTableActionType.Edit, item)}"
        ></paper-icon-button>
        <paper-icon-button
          ?hidden="${!this.showDelete}"
          icon="delete"
          @tap="${() => this.triggerAction(EtoolsTableActionType.Delete, item)}"
        ></paper-icon-button>
        <paper-icon-button
          ?hidden="${!this.showCopy}"
          icon="content-copy"
          @tap="${() => this.triggerAction(EtoolsTableActionType.Copy, item)}"
        ></paper-icon-button>
      </div>
    `;
  }

  get paginationHtml() {
    return html` <tr>
      <td class="pagination" colspan="${this.columns.length + (this.showRowActions() ? 1 : 0)}">
        <etools-pagination .paginator="${this.paginator}"></etools-pagination>
      </td>
    </tr>`;
  }

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

  getColumnDetails(name: string) {
    const column: EtoolsTableColumn | undefined = this.columns.find((c: EtoolsTableColumn) => c.name === name);
    if (!column) {
      throw new Error(`[EtoolsTable.getColumnDetails]: column "${name}" not found`);
    }
    return column;
  }

  // Rows
  getRowDataColumnClassList(key: string) {
    const column: EtoolsTableColumn = this.getColumnDetails(key);
    const cssClass: string = column.capitalize ? 'capitalize ' : '';
    switch (column.type) {
      case EtoolsTableColumnType.Number:
        return `${cssClass}right-align`;
      default:
        return cssClass;
    }
  }

  getColumnsKeys() {
    return this.columns.map((c: EtoolsTableColumn) => c.name);
  }

  getItemValue(item: any, key: string, showEdit: boolean) {
    // get column object to determine how data should be displayed (date, string, link, number...)
    const column: EtoolsTableColumn = this.getColumnDetails(key);
    switch (column.type) {
      case EtoolsTableColumnType.Date:
        return item[key]
          ? prettyDate(item[key], this.dateFormat)
          : column.placeholder
          ? column.placeholder
          : this.defaultPlaceholder;
      case EtoolsTableColumnType.Link:
        return this.getLinkTmpl(column.link_tmpl, item, key, column.isExternalLink);
      case EtoolsTableColumnType.Number:
      case EtoolsTableColumnType.Checkbox:
        return this._getCheckbox(item, key, showEdit);
      case EtoolsTableColumnType.Custom:
        return column.customMethod
          ? column.customMethod(item, key)
          : this._getValueByKey(item, key, column.placeholder);
      default:
        return this._getValueByKey(item, key, column.placeholder);
    }
  }

  _getCheckbox(item: any, key: string, showEdit: boolean) {
    return html` <paper-checkbox
      ?checked="${this._getValueByKey(item, key, '', true)}"
      ?readonly="${!showEdit}"
      @change="${(e: CustomEvent) => this.triggerItemChanged(item, key, (e.currentTarget as any).checked)}"
    >
    </paper-checkbox>`;
  }

  _getValueByKey(item: any, key: string, placeholder?: string, ignorePlaceholder = false) {
    const value = get(item, key, '');

    if (!ignorePlaceholder && (!value || value === '')) {
      return placeholder ? placeholder : this.defaultPlaceholder;
    }
    return value;
  }

  // row actions
  showRowActions() {
    return this.showDelete || this.showEdit;
  }

  triggerAction(type: EtoolsTableActionType, item: any) {
    if (!this.showRowActions()) {
      return;
    }
    switch (type) {
      case EtoolsTableActionType.Edit:
        fireEvent(this, 'edit-item', item);
        break;
      case EtoolsTableActionType.Delete:
        fireEvent(this, 'delete-item', item);
        break;
      case EtoolsTableActionType.Copy:
        fireEvent(this, 'copy-item', item);
        break;
    }
  }

  toggleAndSortBy(column: EtoolsTableColumn) {
    if (column.sort === undefined) {
      return;
    }
    column.sort = this.toggleColumnSort(column.sort);
    fireEvent(this, 'sort-change', [...this.columns]);
  }

  toggleColumnSort(sort: EtoolsTableColumnSort): EtoolsTableColumnSort {
    return sort === EtoolsTableColumnSort.Asc ? EtoolsTableColumnSort.Desc : EtoolsTableColumnSort.Asc;
  }

  triggerItemChanged(item: any, field: string, filedValue: any) {
    const changedItem = {...item};
    changedItem[field] = filedValue;
    fireEvent(this, 'item-changed', changedItem);
  }
}
