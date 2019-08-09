import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import {customElement, LitElement, html, property} from 'lit-element';
import {etoolsPaginationStyles} from './etools-pagination-style';
import {EtoolsPaginator} from './paginator';
import {fireEvent} from '../../../utils/fire-custom-event';

/**
 * @customElement
 * @LitElement
 */
@customElement('etools-pagination')
export class EtoolsPagination extends LitElement {

  public render() {
    return html`
      ${etoolsPaginationStyles}
      <span class="pagination-item">
        <span id="rows">Rows per page:</span>
        <paper-dropdown-menu vertical-align="bottom" horizontal-align="left" noink no-label-float 
          @value-changed="${this.onPageChanged}">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" .selected="${this.paginator.page_size}">
            ${this.pageSizeOptions.map((sizeOption: number) => html`<paper-item name="${sizeOption}">
              ${sizeOption}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
        <span id="range">
          ${this.paginator.visible_range[0]}-${this.paginator.visible_range[1]} of ${this.paginator.count}
        </span>
      </span>

      <span class="pagination-item pagination-btns">
        <paper-icon-button icon="first-page" @tap="${this.goToFirstPage}"
                           ?disabled="${this.paginator.page === 1}"></paper-icon-button>

        <paper-icon-button icon="chevron-left" @tap="${this.pageLeft}"
                           ?disabled="${this.paginator.page === 1}"></paper-icon-button>

        <paper-icon-button icon="chevron-right" @tap="${this.pageRight}"
                           ?disabled="${this.paginator.page === this.paginator.total_pages}"></paper-icon-button>

        <paper-icon-button icon="last-page" @tap="${this.goToLastPage}"
                           ?disabled="${this.paginator.page === this.paginator.total_pages}"></paper-icon-button>
      </span>

    `;
  }

  @property({type: Object})
  paginator!: EtoolsPaginator;

  @property({type: Array})
  pageSizeOptions: number[] = [5, 10, 20, 50];

  goToFirstPage() {
    if (this.paginator.page > 1) {
      fireEvent(this, 'page-change', {page: 1});
    }
  }

  goToLastPage() {
    if (this.paginator.page < this.paginator.total_pages) {
      fireEvent(this, 'page-change', {page: this.paginator.total_pages});
    }
  }

  pageLeft() {
    if (this.paginator.page > 1) {
      fireEvent(this, 'page-change', {page: this.paginator.page - 1});
    }
  }

  pageRight() {
    if (this.paginator.page < this.paginator.total_pages) {
      fireEvent(this, 'page-change', {page: this.paginator.page + 1});
    }
  }
  onPageChanged(e: CustomEvent) {
    fireEvent(this, 'page-size-change', {size: Number(e.detail.value)});
  }


}
