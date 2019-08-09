import '@polymer/paper-button/paper-button';
import {LitElement, html, property, customElement} from 'lit-element';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import {pageContentHeaderSlottedStyles} from
  '../../common/layout/page-content-header/page-content-header-slotted-styles';

import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import '../../common/layout/filters/etools-filters';
import {EtoolsFilter, EtoolsFilterTypes} from '../../common/layout/filters/etools-filters';
import {ROOT_PATH} from '../../../config/config';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import '../../common/layout/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from '../../common/layout/etools-table/etools-table';

/**
 * @LitElement
 * @customElement
 */
@customElement('engagements-list')
export class EngagementsList extends LitElement {

  static get styles() {
    return [elevationStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
      <page-content-header>
        <h1 slot="page-title">Engagements list</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Export</paper-button>
        </div>
      </page-content-header>
      
      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}"
                        @filter-change="${this.filtersChange}"></etools-filters>
      </section>
      
      <section class="elevation page-content" elevation="1">
        Engagements list will go here.... TODO<br>
        <a href="${this.rootPath}engagements/23/details">Go to engagement details pages :)</a>
      </section>
      
      <section class="elevation page-content">
        <etools-table .caption="Engagements list - optional table title" 
                      .columns="${this.listColumns}" 
                      .items="${this.listData}"></etools-table>
      </section>
    `;
  }

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Array})
  listColumns: EtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'ref_number',
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
    },
    {
      label: 'Rating Pts',
      name: 'rating_points',
      type: EtoolsTableColumnType.Number
    }
  ];

  @property({type: Array})
  listData: GenericObject[] = [
    {
      id: 1,
      ref_number: '2019/11',
      assessment_date: '2019-08-01',
      partner_name: 'Partner name 1',
      status: 'Assigned',
      assessor: 'John Doe',
      rating: 'Low',
      rating_points: 23
    },
    {
      id: 2,
      ref_number: '2019/12',
      assessment_date: '2019-08-02',
      partner_name: 'Partner name 2',
      status: 'Final',
      assessor: 'Jane Doe',
      rating: 'Medium',
      rating_points: 50
    },
    {
      id: 3,
      ref_number: '2019/13',
      assessment_date: '2019-08-03',
      partner_name: 'Partner name 3',
      status: 'Rejected',
      assessor: 'David Lham',
      rating: 'Low',
      rating_points: 100
    }
  ];

  @property({type: Array})
  partnerTypes: any[] = [
    {
      value: 'cso',
      label: 'CSO Partner'
    },
    {
      value: 'gov',
      label: 'Government Partner'
    },
    {
      value: 'cso_national',
      label: 'CSO/National Partner'
    }
  ];

  @property({type: Array})
  partnerSyncedOpts: any[] = [
    {
      value: 'no',
      label: 'No'
    },
    {
      value: 'yes',
      label: 'Yes'
    }
  ];

  @property({type: Array})
  selectedFilters: GenericObject = {
    q: '',
    partner_type: [],
    synced: null,
    show_hidden: true,
    created_after: null
  };

  @property({type: Array})
  filters: EtoolsFilter[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.filters = [
      {
        filterName: 'Search partner',
        filterKey: 'q',
        type: EtoolsFilterTypes.Search,
        selectedValue: '',
        selected: true
      },
      {
        filterName: 'Partner Type',
        filterKey: 'partner_type',
        type: EtoolsFilterTypes.DropdownMulti,
        selectionOptions: this.partnerTypes,
        selectedValue: [],
        selected: true,
        minWidth: '350px',
        hideSearch: true,
        disabled: this.partnerTypes.length === 0
      },
      {
        filterName: 'Synced',
        filterKey: 'synced',
        type: EtoolsFilterTypes.Dropdown,
        selectionOptions: this.partnerSyncedOpts,
        selectedValue: null,
        selected: false,
        minWidth: '350px',
        hideSearch: true,
        disabled: this.partnerSyncedOpts.length === 0
      },
      {
        filterName: 'Show hidden',
        filterKey: 'show_hidden',
        type: EtoolsFilterTypes.Toggle,
        selectedValue: true,
        selected: true
      },
      {
        filterName: 'Created After',
        filterKey: 'created_after',
        type: EtoolsFilterTypes.Date,
        selectedValue: null,
        selected: false
      }
    ];
  }

  filtersChange(e: CustomEvent) {
    console.log('filters change event handling...', e.detail);
    this.selectedFilters = {...this.selectedFilters, ...e.detail};
    // DO filter stuff here
  }
}
