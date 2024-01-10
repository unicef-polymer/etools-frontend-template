import {connect} from 'pwa-helpers/connect-mixin.js';
import {store, RootState} from '../../../redux/store';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {LitElement, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsUser} from '@unicef-polymer/etools-types';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {get as getTranslation, translate} from 'lit-translate';
import {ROOT_PATH} from '../../../config/config';
import {changeCurrentOrganization} from '../../user/user-actions';
import {isEmptyObject} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';

/**
 * @LitElement
 * @customElement
 */
@customElement('organizations-dropdown')
export class organizationsDropdown extends connect(store)(LitElement) {
  public render() {
    return html`
      ${countriesDropdownStyles}
      <etools-dropdown
        transparent
        ?hidden=${isEmptyObject(this.organizations)}
        id="organizationSelector"
        placeholder="${translate('GENERAL.SELECT_ORGANIZATION')}"
        class="w100 ${this.checkMustSelectOrganization(this.user)}"
        .selected="${this.currentOrganizationId}"
        allow-outside-scroll
        no-label-float
        .options="${this.organizations}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this.onOrganizationChange}"
        hide-search
      ></etools-dropdown>
    `;
  }

  @property({type: Number})
  currentOrganizationId!: number | null;

  @property({type: Array})
  organizations: any[] = [];

  @property({type: Object})
  user!: EtoolsUser;

  @query('#organizationSelector') private organizationSelectorDropdown!: EtoolsDropdownEl;

  public connectedCallback() {
    super.connectedCallback();

    // setTimeout(() => {
    //   const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
    //   this.organizationSelectorDropdown.fitInto = fitInto;
    // }, 0);
  }

  public stateChanged(state: RootState) {
    if (!state.user || !state.user.data || JSON.stringify(this.user) === JSON.stringify(state.user.data)) {
      return;
    }

    this.user = state.user.data;
    this.organizations = this.user.organizations_available;
    this.currentOrganizationId = this.user.organization?.id || null;
  }

  checkMustSelectOrganization(user: EtoolsUser) {
    if (user && !user.organization) {
      setTimeout(() => {
        fireEvent(this, 'toast', {text: getTranslation('GENERAL.SELECT_ORGANIZATION')});
      }, 2000);
      return 'warning';
    }
    return '';
  }

  protected onOrganizationChange(e: CustomEvent) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedOrganizationId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedOrganizationId !== this.currentOrganizationId) {
      // send post request to change_organization endpoint
      this.triggerOrganizationChangeRequest(selectedOrganizationId);
    }
  }

  protected triggerOrganizationChangeRequest(selectedOrganizationId: number) {
    fireEvent(this, 'global-loading', {
      message: 'Please wait while organization data is changing...',
      active: true,
      loadingSource: 'organization-change'
    });
    changeCurrentOrganization(selectedOrganizationId)
      .then(() => {
        // redirect to default page
        // TODO: clear all cached data related to old country
        EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
        // force page reload to load all data specific to the new country
        document.location.assign(window.location.origin + ROOT_PATH);
      })
      .catch((error: any) => {
        this.handleOrganizationChangeError(error);
      })
      .then(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: 'organization-change'
        });
      });
  }

  protected handleOrganizationChangeError(error: any) {
    EtoolsLogger.error('organization change failed!', 'organization-dropdown', error);
    this.organizationSelectorDropdown.selected = this.currentOrganizationId;
    fireEvent(this, 'toast', {text: 'Something went wrong changing your organization. Please try again'});
  }
}
