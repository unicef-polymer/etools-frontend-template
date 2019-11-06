import '@polymer/paper-button/paper-button';

import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import {pageContentHeaderSlottedStyles}
  from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../common/layout/status/etools-status';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';
import {updateAppLocation} from '../../../routing/routes';
import {customElement, LitElement, html, property} from 'lit-element';
import {elevationStyles} from '../../styles/lit-styles/elevation-styles';
import {RouteDetails} from '../../../routing/router';
import './status-transitions/assessment-status-transition-actions';
import '../../common/layout/etools-error-warn-box';
import '../../common/layout/export-data';
import {GenericObject} from '../../../types/globals';

/**
 * @LitElement
 * @customElement
 */
@customElement('assessment-tabs')
export class AssessmentTabs extends connect(store)(LitElement) {

  static get styles() {
    return [elevationStyles, pageLayoutStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${pageContentHeaderSlottedStyles}
      <style>
        etools-status {
          justify-content: center;
        }
      </style>
      <page-content-header with-tabs-visible>

        <h1 slot="page-title">Page Title</h1>

        <etools-tabs slot="tabs"
                     .tabs="${this.pageTabs}"
                     .activeTab="${this.activeTab}"
                     @iron-select="${this.handleTabChange}"></etools-tabs>
      </page-content-header>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-error-warn-box .messages="['Warn message']">
        </etools-error-warn-box>
      </section>

      <div class="page-content">
        <assessment-details ?hidden="${!this.isActiveTab(this.activeTab, 'details')}">
            <etools-loading loading-text="Loading..." active></etools-loading>
        </assessment-details>
        <assessment-questionnaire ?hidden="${!this.isActiveTab(this.activeTab, 'questionnaire')}">
            <etools-loading loading-text="Loading..." active></etools-loading>
        </assessment-questionnaire>
      </div>
    `;
  }

  @property({type: Object})
  routeDetails!: RouteDetails;

  @property({type: Array})
  pageTabs = [
    {
      tab: 'details',
      tabLabel: 'Details',
      hidden: false,
      disabled: false
    },
    {
      tab: 'questionnaire',
      tabLabel: 'Questionnaire‎',
      hidden: false,
      disabled: true
    },
  ];

  @property({type: String})
  activeTab: string = 'details';

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  public stateChanged(state: RootState) {

    if (state.user && state.user.data && !state.user.data.is_unicef_user) {
      const followupTab = this.pageTabs.find((elem: GenericObject) => elem.tab === 'followup');
      if (followupTab) {
        followupTab.hidden = true;
        this.pageTabs = [...this.pageTabs];
      }
    }

    // update page route data
    if (state.app!.routeDetails.routeName === 'assessments' &&
      state.app!.routeDetails.subRouteName !== 'list') {

    }
  }

  setActiveTabs(assessmentId: string | number) {
    if (assessmentId !== 'new') {
      this.enableTabs();
    } else {
      this.resetTabs();
    }
  }

  enableTabs() {
    this.pageTabs.forEach((tab) => {
      tab.disabled = false;
    });
    this.pageTabs = [...this.pageTabs];
  }

  resetTabs() {
    this.pageTabs.forEach((tab) => {
      tab.tab == 'details' ? tab.disabled = false : tab.disabled = true;
    });
    this.pageTabs = [...this.pageTabs];
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
      const newPath =
        `assessments/${this.routeDetails!.params ? this.routeDetails!.params.assessmentId : 'new'}/${newTabName}`;
      if (this.routeDetails.path === newPath) {
        return;
      }
      // go to new tab
      updateAppLocation(newPath, true);
    }
  }

}
