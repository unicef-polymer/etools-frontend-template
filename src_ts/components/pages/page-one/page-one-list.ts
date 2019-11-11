import '@polymer/paper-button/paper-button';
import {customElement, html, LitElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';

import '../../common/layout/page-content-header/page-content-header';
import {pageContentHeaderSlottedStyles} from
  '../../common/layout/page-content-header/page-content-header-slotted-styles';

import {GenericObject} from '../../../types/globals';
import '../../common/layout/filters/etools-filters';
import {
  defaultFilters,
  defaultSelectedFilters,
  updateFilterSelectionOptions,
  updateFiltersSelectedValues,
  FilterKeysAndTheirSelectedValues
} from './list/filters';
import {ROOT_PATH} from '../../../config/config';
import {EtoolsFilter} from '../../common/layout/filters/etools-filters';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {buttonsStyles} from '../../styles/button-styles';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import '../../common/layout/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '../../common/layout/etools-table/etools-table';
import {defaultPaginator, EtoolsPaginator, getPaginator} from '../../common/layout/etools-table/pagination/paginator';
import {
  buildUrlQueryString,
  EtoolsTableSortItem,
  getSelectedFiltersFromUrlParams,
  getSortFields,
  getSortFieldsFromUrlSortParams,
  getUrlQueryStringSort
} from '../../common/layout/etools-table/etools-table-utility';
import {RouteDetails, RouteQueryParams} from '../../../routing/router';
import {updateAppLocation, replaceAppLocation} from '../../../routing/routes';
import {SharedStylesLit} from '../../styles/shared-styles-lit';
import '../../common/layout/export-data';
import '@unicef-polymer/etools-loading';
import {getListDummydata} from '../page-one/list/list-dummy-data';
import get from 'lodash-es/get';
import {fireEvent} from '../../utils/fire-custom-event';
let lastSelectedFilters: FilterKeysAndTheirSelectedValues = {...defaultSelectedFilters};

/**
 * @LitElement
 * @customElement
 */
@customElement('page-one-list')
export class PageOneList extends connect(store)(LitElement) {

  static get styles() {
    return [elevationStyles, buttonsStyles, pageLayoutStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStylesLit} ${pageContentHeaderSlottedStyles}
      <style>
        etools-table {
          padding-top: 12px;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">Page One list</h1>
        <div slot="title-row-actions" class="content-header-actions">
          <paper-button class="default left-icon" raised @tap="${this.exportRecord}">
            <iron-icon icon="file-download"></iron-icon>Export
          </paper-button>

          <paper-button class="primary left-icon" raised @tap="${this.goToAddnewPage}">
            <iron-icon icon="add"></iron-icon>Add new record
          </paper-button>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}"
                        @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>
        <etools-table caption="Page One list - optional table title"
                      .columns="${this.listColumns}"
                      .items="${this.listData}"
                      .paginator="${this.paginator}"
                      @paginator-change="${this.paginatorChange}"
                      @sort-change="${this.sortChange}"></etools-table>
      </section>
    `;
  }

  @property({type: Object})
  routeDetails!: RouteDetails;

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Object})
  paginator: EtoolsPaginator = {...defaultPaginator};

  @property({type: Array})
  sort: EtoolsTableSortItem[] = [{name: 'assessment_date', sort: EtoolsTableColumnSort.Desc},
  {name: 'partner_name', sort: EtoolsTableColumnSort.Asc}];

  @property({type: Array})
  filters!: EtoolsFilter[];

  @property({type: Object})
  selectedFilters!: FilterKeysAndTheirSelectedValues;

  @property({type: Boolean})
  canAdd: boolean = false;

  @property({type: Boolean})
  canExport: boolean = false;

  @property({type: String})
  queryParams: string = '';

  @property({type: Boolean})
  showLoading: boolean = false;

  @property({type: Array})
  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'ref_number',
      link_tmpl: `${ROOT_PATH}page-one/:id/details`,
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
  listData: GenericObject[] = [];

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
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

      const availableFilters = [...defaultFilters]
      this.populateDropdownFilterOptionsFromCommonData(state.commonData, availableFilters);

      // update filter selection and assign the result to etools-filters(trigger render)
      this.filters = updateFiltersSelectedValues(this.selectedFilters, availableFilters);
      lastSelectedFilters = {...this.selectedFilters};
    }
  }

  private dataRequiredByFiltersHasBeenLoaded(state: RootState) {
    if (state.commonData && (get(state, 'commonData.unicefUsers.length')) && get(state, 'commonData.partners.length') &&
      this.routeDetails.queryParams && Object.keys(this.routeDetails.queryParams).length > 0) {
      return true;
    }
    return false;
  }

  populateDropdownFilterOptionsFromCommonData(commonData: any, currentFilters: EtoolsFilter[]) {
    updateFilterSelectionOptions(currentFilters, 'unicef_focal_point', commonData.unicefUsers);
    updateFilterSelectionOptions(currentFilters, 'partner', commonData.partners);
  }

  updateUrlListQueryParams() {
    const qs = this.getParamsForQuery();
    this.queryParams = qs;
    replaceAppLocation(`${this.routeDetails.path}?${qs}`, true);
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

  updateListParamsFromRouteDetails(queryParams: RouteQueryParams) {
    // update sort fields
    if (queryParams.sort) {
      this.sort = getSortFieldsFromUrlSortParams(queryParams.sort);
    }

    // update paginator fields
    const paginatorParams: GenericObject = {};
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
    getListDummydata(this.paginator).then((response: any) => {
      // update paginator (total_pages, visible_range, count...)
      this.paginator = getPaginator(this.paginator, response);
      this.listData = [...response.results];
    }).catch((err: any) => {
      // TODO: handle req errors
      console.error(err);
    });
  }

  exportRecord() {
    fireEvent(this, 'toast', {text: 'Export not implemented...'});
  }

  goToAddnewPage() {
    updateAppLocation('/page-one/new/details', true);
  }
}
