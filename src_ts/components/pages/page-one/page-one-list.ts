import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';

import '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header-slotted-styles';

import {AnyObject} from '@unicef-polymer/etools-types';
import '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {
  defaultFilters,
  defaultSelectedFilters,
  updateFilterSelectionOptions,
  updateFiltersSelectedValues,
  FilterKeysAndTheirSelectedValues,
  FilterKeys
} from './list/filters';
import {ROOT_PATH} from '../../../config/config';
import {EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {sharedStyles} from '../../styles/shared-styles';
import '@unicef-polymer/etools-unicef/src/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '@unicef-polymer/etools-unicef/src/etools-table/etools-table';
import {
  EtoolsPaginator,
  defaultPaginator,
  getPaginatorWithBackend
} from '@unicef-polymer/etools-unicef/src/etools-table/pagination/etools-pagination';
import {
  buildUrlQueryString,
  EtoolsTableUtilitySortItem,
  getSortFields,
  getSortFieldsFromUrlSortParams,
  getUrlQueryStringSort
} from '@unicef-polymer/etools-modules-common/dist/layout/etools-table/etools-table-utility';
import {getSelectedFiltersFromUrlParams} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import {getListDummydata} from '../page-one/list/list-dummy-data';
import get from 'lodash-es/get';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '../../common/layout/export-data';
import {
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
let lastSelectedFilters: FilterKeysAndTheirSelectedValues = {...defaultSelectedFilters};

/**
 * @LitElement
 * @customElement
 */
@customElement('page-one-list')
export class PageOneList extends connect(store)(LitElement) {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, pageContentHeaderSlottedStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        etools-table {
          padding-top: 12px;
        }
        .shortAddText {
          display: none;
        }
        .action {
          text-align: right;
        }
        @media (max-width: 576px) {
          .action {
            text-align: right;
          }
          #addBtn {
            padding-right: 16px;
            margin-right: 32px;
          }
          .shortAddText {
            display: block;
          }
          .longAddText {
            display: none;
          }
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">Page One list</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <div class="action">
            <export-data .params="${this.queryParams}"></export-data>
          </div>
          <div class="action">
            <etools-button id="addBtn" variant="primary" @tap="${this.goToAddnewPage}">
              <etools-icon name="add" slot="prefix"></etools-icon>
              Add new record
            </etools-button>
          </div>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}" @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>
        <etools-table
          caption="Page One"
          .columns="${this.listColumns}"
          .items="${this.listData}"
          .paginator="${this.paginator}"
          @paginator-change="${this.paginatorChange}"
          @sort-change="${this.sortChange}"
        ></etools-table>
      </section>
    `;
  }

  @property({type: Object})
  routeDetails!: EtoolsRouteDetails;

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Object})
  paginator: EtoolsPaginator = {...defaultPaginator};

  @property({type: Array})
  sort: EtoolsTableUtilitySortItem[] = [
    {name: 'assessment_date', sort: EtoolsTableColumnSort.Desc},
    {name: 'partner_name', sort: EtoolsTableColumnSort.Asc}
  ];

  @property({type: Array})
  filters!: EtoolsFilter[];

  @property({type: Object})
  selectedFilters!: FilterKeysAndTheirSelectedValues;

  @property({type: Boolean})
  canAdd = false;

  @property({type: Boolean})
  canExport = false;

  @property({type: String})
  queryParams = '';

  @property({type: Boolean})
  showLoading = false;

  @property({type: Array})
  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'ref_number',
      link_tmpl: `page-one/:id/details`,
      type: EtoolsTableColumnType.Link
    },
    {
      label: 'Assessment Date',
      name: 'assessment_date',
      type: EtoolsTableColumnType.Date,
      sort: EtoolsTableColumnSort.Desc
    },
    {
      label: 'Partner Org',
      name: 'partner_name',
      type: EtoolsTableColumnType.Text,
      sort: EtoolsTableColumnSort.Asc
    },
    {
      label: 'Status',
      name: 'status',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Assessor',
      name: 'assessor',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Rating',
      name: 'rating',
      type: EtoolsTableColumnType.Text
    }
  ];

  @property({type: Array})
  listData: AnyObject[] = [];

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails')!;
    if (!(routeDetails.routeName === 'page-one' && routeDetails.subRouteName === 'list')) {
      return; // Avoid code execution while on a different page
    }

    const stateRouteDetails = {...state.app!.routeDetails};

    if (JSON.stringify(stateRouteDetails) !== JSON.stringify(this.routeDetails)) {
      this.routeDetails = stateRouteDetails;

      if (!this.routeDetails.queryParams || Object.keys(this.routeDetails.queryParams).length === 0) {
        this.selectedFilters = {...lastSelectedFilters};
        // update url with params
        this.updateUrlListQueryParams();

        return;
      } else {
        // init selectedFilters, sort, page, page_size from url params
        this.updateListParamsFromRouteDetails(this.routeDetails.queryParams);
        // get list data based on filters, sort and pagination
        this.getListData();
      }
    }

    if (state.user && state.user.permissions) {
      this.canAdd = state.user.permissions.canAdd;
      this.canExport = state.user.permissions.canExport;
    }

    this.initFiltersForDisplay(state);
  }

  initFiltersForDisplay(state: RootState) {
    if (this.dataRequiredByFiltersHasBeenLoaded(state)) {
      const availableFilters = [...defaultFilters];
      this.populateDropdownFilterOptionsFromCommonData(state.commonData, availableFilters);

      // update filter selection and assign the result to etools-filters(trigger render)
      this.filters = updateFiltersSelectedValues(this.selectedFilters, availableFilters);
      lastSelectedFilters = {...this.selectedFilters};
    }
  }

  private dataRequiredByFiltersHasBeenLoaded(state: RootState) {
    if (
      state.commonData &&
      state.commonData?.unicefUsers?.length &&
      state.commonData?.partners?.length &&
      this.routeDetails.queryParams &&
      Object.keys(this.routeDetails.queryParams).length > 0
    ) {
      return true;
    }
    return false;
  }

  populateDropdownFilterOptionsFromCommonData(commonData: any, currentFilters: EtoolsFilter[]) {
    updateFilterSelectionOptions(currentFilters, FilterKeys.unicef_focal_point, commonData.unicefUsers);
    updateFilterSelectionOptions(currentFilters, FilterKeys.partner, commonData.partners);
  }

  updateUrlListQueryParams() {
    const qs = this.getParamsForQuery();
    this.queryParams = qs;
    EtoolsRouter.replaceAppLocation(this.routeDetails.path, qs);
  }

  getParamsForQuery() {
    const params = {
      ...this.selectedFilters,
      page: this.paginator.page,
      page_size: this.paginator.page_size,
      sort: getUrlQueryStringSort(this.sort)
    };
    return buildUrlQueryString(params);
  }

  updateListParamsFromRouteDetails(queryParams: EtoolsRouteQueryParams) {
    // update sort fields
    if (queryParams.sort) {
      this.sort = getSortFieldsFromUrlSortParams(queryParams.sort);
    }

    // update paginator fields
    const paginatorParams: AnyObject = {};
    if (queryParams.page) {
      paginatorParams.page = Number(queryParams.page);
    }
    if (queryParams.page_size) {
      paginatorParams.page_size = Number(queryParams.page_size);
    }
    this.paginator = {...this.paginator, ...paginatorParams};

    // update selectedFilters
    this.selectedFilters = getSelectedFiltersFromUrlParams(queryParams);
  }

  filtersChange(e: CustomEvent) {
    this.selectedFilters = {...e.detail};
    this.paginator.page = 1;
    this.updateUrlListQueryParams();
  }

  paginatorChange(e: CustomEvent) {
    const newPaginator = {...e.detail};
    this.paginator = newPaginator;
    this.updateUrlListQueryParams();
  }

  sortChange(e: CustomEvent) {
    this.sort = getSortFields(e.detail);
    this.updateUrlListQueryParams();
  }

  getListData() {
    getListDummydata(this.paginator)
      .then((response: any) => {
        // update paginator (total_pages, visible_range, count...)
        this.paginator = getPaginatorWithBackend(this.paginator, response);
        this.listData = [...response.results];
      })
      .catch((err: any) => {
        // TODO: handle req errors
        console.error(err);
      });
  }

  exportRecord() {
    fireEvent(this, 'toast', {text: 'Export not implemented...'});
  }

  goToAddnewPage() {
    EtoolsRouter.updateAppLocation('/page-one/new/details');
  }
}
