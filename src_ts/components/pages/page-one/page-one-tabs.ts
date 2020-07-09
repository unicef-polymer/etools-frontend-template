import '@polymer/paper-button/paper-button';

import {SharedStylesLit} from '../../styles/shared-styles-lit';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
// eslint-disable-next-line max-len
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../common/layout/status/etools-status';

import {AnyObject} from '../../../types/globals';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';
import {updateAppLocation} from '../../../routing/routes';
import {customElement, LitElement, html, property} from 'lit-element';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import {RouteDetails} from '../../../routing/router';

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
      ${SharedStylesLit}
      <style>
        etools-status {
          justify-content: center;
        }
      </style>
      <etools-status></etools-status>

      <page-content-header with-tabs-visible>
        <h1 slot="page-title">Title here</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Action 1</paper-button>
          <paper-button raised>Action 2</paper-button>
        </div>

        <etools-tabs
          slot="tabs"
          .tabs="${this.pageTabs}"
          .activeTab="${this.activeTab}"
          @iron-select="${this.handleTabChange}"
        ></etools-tabs>
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
  activeTab = 'details';

  @property({type: Object})
  record: AnyObject = {
    id: 23,
    title: 'Page One title'
  };

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
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
      const newPath = `page-one/${this.record.id}/${newTabName}`;
      if (this.routeDetails.path === newPath) {
        return;
      }
      // go to new tab
      updateAppLocation(newPath, true);
    }
  }
}
