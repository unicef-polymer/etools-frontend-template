import {html, PolymerElement} from '@polymer/polymer/polymer-element';
import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import {property} from '@polymer/decorators';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import '../../common/layout/etools-table/etools-table';
import {
  EtoolsTableColumn,
  EtoolsTableColumnSort,
  EtoolsTableColumnType
} from "../../common/layout/etools-table/etools-table";

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
        <a style="margin-bottom: 24px;" href$="[[rootPath]]engagements/23/details">Go to engagement details pages :)</a>
        
        <etools-table caption="Engagements list - optional table title" 
                      columns="[[listColumns]]" 
                      items="[[listData]]"></etools-table>
      </section>
    `;
  }

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

}

window.customElements.define('engagements-list', EngagementsList);
