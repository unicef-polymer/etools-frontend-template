import '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header';
import {pageContentHeaderSlottedStyles} from '@unicef-polymer/etools-modules-common/dist/layout/page-content-header/page-content-header-slotted-styles';

import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';
import '@unicef-polymer/etools-modules-common/dist/layout/status/etools-status';
// eslint-disable-next-line max-len
import './actions/page-one-actions';
import {AnyObject} from '@unicef-polymer/etools-types';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {sharedStyles} from '../../styles/shared-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

/**
 * @LitElement
 * @customElement
 */
@customElement('page-one-tabs')
export class PageOneTabs extends connect(store)(LitElement) {
  static get styles() {
    return [elevationStyles, pageLayoutStyles, pageContentHeaderSlottedStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        etools-status-lit {
          justify-content: center;
        }
      </style>
      <etools-status-lit .statuses="${this.statuses}" .activeStatus="${'submitted-accepted'}"></etools-status-lit>

      <page-content-header with-tabs-visible>
        <h1 slot="page-title">Title here</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <page-one-actions
            .entityId="${this.record?.id}"
            .actions="${this.record?.actions_available || []}"
          ></page-one-actions>
        </div>

        <etools-tabs-lit
          slot="tabs"
          .tabs="${this.pageTabs}"
          .activeTab="${this.activeTab}"
          @sl-tab-show="${this.handleTabChange}"
        ></etools-tabs-lit>
      </page-content-header>

      <section class="elevation page-content" elevation="1">
        ${this.isActiveTab(this.activeTab, 'details') ? html`<page-one-details></page-one-details>` : ''}
        ${this.isActiveTab(this.activeTab, 'questionnaires')
          ? html`<page-one-questionnaires> </page-one-questionnaires>`
          : ''}
      </section>
    `;
  }

  @property({type: Object})
  routeDetails!: EtoolsRouteDetails;

  @property({type: Object})
  statuses: any[] = [
    ['draft', 'Draft'],
    ['submitted-accepted', 'Submitted/Accepted'],
    ['report-submitted', 'Report submitted'],
    ['rejected', 'Rejected'],
    ['completed', 'Completed']
  ];

  @property({type: Array})
  pageTabs = [
    {
      tab: 'details',
      tabLabel: 'Details',
      hidden: false
    },
    {
      tab: 'questionnaires',
      tabLabel: 'Questionnaires',
      hidden: false
    }
  ];

  @property({type: String})
  activeTab = 'details';

  @property({type: Object})
  record: AnyObject = {
    id: 23,
    title: 'Page One title',
    actions_available: ['back', 'review', 'accept', 'cancel', 'download_comments', 'export']
  };

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  connectedCallback() {
    super.connectedCallback();

    this.showLoadingMessage();
  }

  public stateChanged(state: RootState) {
    // update page route data
    if (state.app!.routeDetails.routeName === 'page-one' && state.app!.routeDetails.subRouteName !== 'list') {
      this.routeDetails = state.app!.routeDetails;
      const stateActiveTab = state.app!.routeDetails.subRouteName as string;
      if (stateActiveTab !== this.activeTab) {
        const oldActiveTabValue = this.activeTab;
        this.activeTab = state.app!.routeDetails.subRouteName as string;
        this.tabChanged(this.activeTab, oldActiveTabValue);
      }
      const recordId = state.app!.routeDetails.params!.recordId;
      if (recordId) {
        this.record.id = recordId;
      }
    }
  }

  handleTabChange(e: CustomEvent) {
    const newTabName: string = e.detail.name;
    if (newTabName === this.activeTab) {
      return;
    }
    this.tabChanged(newTabName, this.activeTab);
  }

  tabChanged(newTabName: string, oldTabName: string | undefined) {
    if (oldTabName === undefined) {
      // page load, tab init, component is gonna be imported in loadPageComponents action
      return;
    }
    if (newTabName !== oldTabName) {
      const newPath = `page-one/${this.record.id}/${newTabName}`;
      if (this.routeDetails.path === newPath) {
        return;
      }
      this.showLoadingMessage();
      // go to new tab
      EtoolsRouter.updateAppLocation(newPath);
    }
  }

  showLoadingMessage() {
    fireEvent(this, 'global-loading', {
      message: `Loading...`,
      active: true,
      loadingSource: 'demo-page'
    });
  }
}
