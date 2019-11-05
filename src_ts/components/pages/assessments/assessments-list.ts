import '@polymer/paper-button/paper-button';
import {customElement, html, LitElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';

import '../../common/layout/page-content-header/page-content-header';
import {pageContentHeaderSlottedStyles} from
  '../../common/layout/page-content-header/page-content-header-slotted-styles';

import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import {Assessment} from '../../../types/assessment';
import '../../common/layout/filters/etools-filters';
import {
  assessmentsFilters,
  defaultSelectedFilters,
  updateFilterSelectionOptions,
  updateFiltersSelectedValues,
  onlyForUnicefFilters,
  FilterKeysAndTheirSelectedValues
} from './list/filters';
import {EtoolsFilter} from '../../common/layout/filters/etools-filters';
import {ROOT_PATH} from '../../../config/config';
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
import {buttonsStyles} from '../../styles/button-styles';
import {SharedStylesLit} from '../../styles/shared-styles-lit';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {makeRequest} from '../../utils/request-helper';
import '../../common/layout/export-data';
import '@unicef-polymer/etools-loading';
import get from 'lodash-es/get';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';

let lastSelectedFilters: FilterKeysAndTheirSelectedValues = {...defaultSelectedFilters};

/**
 * @LitElement
 * @customElement
 */
@customElement('assessments-list')
export class AssessmentsList extends connect(store)(LitElement) {

  static get styles() {
    return [elevationStyles, buttonsStyles, pageLayoutStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStylesLit}${pageContentHeaderSlottedStyles}
      <style>
        etools-table {
          padding-top: 12px;
        }
      </style>
      <page-content-header>

        <h1 slot="page-title">Assessments list</h1>

        <div slot="title-row-actions" class="content-header-actions">
            <div class="action" ?hidden="${!this.canExport}" >
              <export-data .endpoint="${etoolsEndpoints.assessment.url!}" .params="${this.queryParams}"></export-data>
            </div>
            <div class="action" ?hidden="${!this.canAdd}" >
              <paper-button class="primary left-icon" raised @tap="${this.goToAddNewPage}">
                <iron-icon icon="add"></iron-icon>Add new assessment
              </paper-button>
            </div>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}"
                        @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-loading loading-text="Loading..." .active="${this.showLoading}"></etools-loading>
        <etools-table .columns="${this.listColumns}"
                      .items="${this.listData}"
                      .paginator="${this.paginator}"
                      @paginator-change="${this.paginatorChange}"
                      @sort-change="${this.sortChange}"></etools-table>
      </section>
    `;
  }

  /**
   * TODO:
   *  1. init filters and sort params: default values or values from routeDetails object
   *  2. make engagements data request using filters and sorting params
   *  3. on engagements req success init paginator, list page data and update url params if needed
   *  4. on filters-change, parinator-change, sort-change trigger a new request for engagements data (repeat 2 and 3)
   *  5. add loading...
   *  6. hide etools-pagination if there are fewer results then first page_size option
   *  7. when navigating from details page to list all list req params are preserved and we need to avoid
   *  a duplicated request to get data. This can be done by adding a new list queryParams state in redux
   *  and use it in app-menu component to update menu option url
   *  8. test filters menu and prevend request triggered by filter select only action
   */

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

  @property({type: Boolean})
  isUnicefUser: boolean = false;

  @property({type: String})
  queryParams: string = '';

  @property({type: Boolean})
  showLoading: boolean = false;

  @property({type: Array})
  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'reference_number',
      link_tmpl: `${ROOT_PATH}assessments/:id/details`,
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
      type: EtoolsTableColumnType.Text,
      capitalize: true
    },
    {
      label: 'Assessor',
      name: 'assessor',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'SEA Risk Rating',
      name: 'overall_rating.display',
      type: EtoolsTableColumnType.Text
    }
  ];

  @property({type: Array})
  listData: GenericObject[] = [];

  stateChanged(state: RootState) {
    const routeDetails = get(state, 'app.routeDetails');
    if (!(routeDetails.routeName === 'assessments' && routeDetails.subRouteName === 'list')) {
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
        // get assessments based on filters, sort and pagination
        this.getFilteredAssessments();
      }
    }

    if (state.user) {
      if (state.user.data) {
        this.isUnicefUser = state.user.data.is_unicef_user;
      }
      if (state.user.permissions) {
        this.canAdd = state.user.permissions.canAddAssessment;
        this.canExport = state.user.permissions.canExportAssessment;
      }
    }

    this.initFiltersForDisplay(state);
  }

  initFiltersForDisplay(state: RootState) {
    if (this.dataRequiredByFiltersHasBeenLoaded(state)) {

      const availableFilters = this.isUnicefUser ?
        [...assessmentsFilters] : [...assessmentsFilters.filter(x => onlyForUnicefFilters.indexOf(x.filterKey) < 0)];

      this.populateDropdownFilterOptionsFromCommonData(state.commonData, availableFilters);

      // update filter selection and assign the result to etools-filters(trigger render)
      this.filters = updateFiltersSelectedValues(this.selectedFilters, availableFilters);
      lastSelectedFilters = {...this.selectedFilters};
    }
  }

  /**
    * TODO
    * We might avoid the issues of waiting and also reduce multiple stateChanged execution by updating
    * redux state only after all endpoint requests (currentUser, partners, unicefUsers, externals) have finished
    */
  private dataRequiredByFiltersHasBeenLoaded(state: RootState) {
    if (get(state, 'user.data') && state.commonData &&
      // Avoid selectedValue being set before the dropdown is populated with options
      // And take into account that for non unicef users, the users endpoint returns 403
      (!this.isUnicefUser || get(state, 'commonData.unicefUsers.length')) &&
      get(state, 'commonData.partners.length') &&
      this.routeDetails.queryParams &&
      Object.keys(this.routeDetails.queryParams).length > 0) {
      return true;
    }
    return false;
  }

  populateDropdownFilterOptionsFromCommonData(commonData: any, currentFilters: EtoolsFilter[]) {
    if (this.isUnicefUser) {
      updateFilterSelectionOptions(currentFilters, 'assessor_staff', commonData.unicefUsers);
      updateFilterSelectionOptions(currentFilters, 'assessor_external', commonData.externalIndividuals);
      updateFilterSelectionOptions(currentFilters, 'assessor_firm', commonData.assessingFirms);
    }
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

  /**
   * This method runs each time new data is received from routeDetails state
   * (sort, filters, paginator init/change)
   */
  getFilteredAssessments() {
    this.showLoading = true;
    const endpoint = {url: etoolsEndpoints.assessment.url + `?${this.getParamsForQuery()}`};
    return makeRequest(endpoint).then((response: GenericObject) => {
      this.paginator = getPaginator(this.paginator, response);
      const assessments = response.results;
      assessments.forEach((assessment: Assessment) => {
        if (assessment.status === 'in_progress') {
          assessment.status = 'in progress';
        }
      });
      this.listData = [...assessments];
    }).catch((err: any) => logError('Assessments list req error', 'AssessmentsList', err))
      .then(() => this.showLoading = false);
  }

  goToAddNewPage() {
    updateAppLocation('/assessments/new/details', true);
  }

}
