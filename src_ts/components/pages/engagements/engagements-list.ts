import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import {property} from '@polymer/decorators';
import {pageContentHeaderSlottedStyles} from
  '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';

import '../../common/layout/filters/etools-filters';
import {EtoolsFilter, EtoolsFilterTypes} from '../../common/layout/filters/etools-filters';

/**
 * @polymer
 * @customElement
 */
class EngagementsList extends PolymerElement {

  public static get template() {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
      <style include="paper-material-styles"></style>

      <page-content-header>
        <h1 slot="page-title">Engagements list</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Export</paper-button>
        </div>
      </page-content-header>
      
      <section class="paper-material page-content" elevation="1">
        <etools-filters selected-filters="[[selectedFilters]]" filters="[[filters]]"></etools-filters>
      </section>
      
      <section class="paper-material page-content" elevation="1">
        Engagements list will go here.... TODO<br>
        <a href$="[[rootPath]]engagements/23/details">Go to engagement details pages :)</a>
      </section>
    `;
  }

  @property({type: Array})
  listData: GenericObject[] = [];

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
        type: EtoolsFilterTypes.Search,
        selectedValue: this.selectedFilters.q,
        path: 'q',
        selected: true
      },
      {
        filterName: 'Partner Type',
        type: EtoolsFilterTypes.DropdownMulti,
        selectionOptions: this.partnerTypes,
        selectedValue: this.selectedFilters.partner_type,
        path: 'partner_type',
        selected: true,
        minWidth: '350px',
        hideSearch: true,
        disabled: this.partnerTypes.length === 0
      },
      {
        filterName: 'Synced',
        type: EtoolsFilterTypes.Dropdown,
        selectionOptions: this.partnerSyncedOpts,
        selectedValue: this.selectedFilters.synced,
        path: 'synced',
        selected: true,
        minWidth: '350px',
        hideSearch: true,
        disabled: this.partnerSyncedOpts.length === 0
      },
      {
        filterName: 'Show hidden',
        type: EtoolsFilterTypes.Toggle,
        selectedValue: this.selectedFilters.show_hidden,
        path: 'show_hidden',
        selected: true
      },
      {
        filterName: 'Created After',
        type: EtoolsFilterTypes.Date,
        path: 'created_after',
        selectedValue: this.selectedFilters.created_after,
        selected: true
      }
    ];
  }
}

window.customElements.define('engagements-list', EngagementsList);
