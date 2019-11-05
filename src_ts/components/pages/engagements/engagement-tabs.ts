import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import {pageContentHeaderSlottedStyles}
  from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../common/layout/status/etools-status';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';
import {updateAppLocation} from '../../../routing/routes';
import {customElement, LitElement, html, property} from 'lit-element';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import {RouteDetails} from '../../../routing/router';
import {buttonsStyles} from "../../styles/button-styles";

/**
 * @LitElement
 * @customElement
 */
@customElement('engagement-tabs')
export class EngagementTabs extends connect(store)(LitElement) {

  static get styles() {
    return [elevationStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles} ${buttonsStyles}
      <etools-status></etools-status>

      <page-content-header with-tabs-visible>
      
        <h1 slot="page-title">${this.engagement.title}</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button class="primary" raised>Action 1</paper-button>
          <paper-button class="error" raised>Action 2</paper-button>
        </div>

        <etools-tabs slot="tabs"
                     .tabs="${this.pageTabs}"
                     .activeTab="${this.activeTab}"
                     @iron-select="${this.handleTabChange}"></etools-tabs>
      </page-content-header>
      
      <section class="elevation page-content" elevation="1">
        ${this.isActiveTab(this.activeTab, 'details') ? html`<engagement-details></engagement-details>` : ''}
        ${this.isActiveTab(this.activeTab, 'questionnaires') ? html`<engagement-questionnaires>
          </engagement-questionnaires>` : ''}
      </section>
    `;
  }

  @property({type: Object})
  routeDetails!: RouteDetails;

  @property({type: Array})
  pageTabs = [
    {
      tab: 'details',
      tabLabel: 'Details',
      hidden: false
    },
    {
      tab: 'questionnaires',
      tabLabel: 'Questionnaires‎',
      hidden: false
    }
  ];

  @property({type: String})
  activeTab: string = 'details';

  @property({type: Object})
  engagement: GenericObject = {
    id: 23,
    title: 'Engagement title'
  };

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  public stateChanged(state: RootState) {
    // update page route data
    if (state.app!.routeDetails.routeName === 'engagements' &&
      state.app!.routeDetails.subRouteName !== 'list') {
      this.routeDetails = state.app!.routeDetails;
      const stateActiveTab = state.app!.routeDetails.subRouteName as string;
      if (stateActiveTab !== this.activeTab) {
        const oldActiveTabValue = this.activeTab;
        this.activeTab = state.app!.routeDetails.subRouteName as string;
        this.tabChanged(this.activeTab, oldActiveTabValue);
      }
      const engagementId = state.app!.routeDetails.params!.engagementId;
      if (engagementId) {
        this.engagement.id = engagementId;
      }
    }
  }

  handleTabChange(e: CustomEvent) {
    const newTabName: string = e.detail.item.getAttribute('name');
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
      const newPath = `engagements/${this.engagement.id}/${newTabName}`;
      if (this.routeDetails.path === newPath) {
        return;
      }
      // go to new tab
      updateAppLocation(newPath, true);
    }
  }

}
