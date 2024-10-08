import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';

import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-accesibility/etools-accesibility';

import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/languages-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/countries-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/dropdowns/organizations-dropdown';
import '@unicef-polymer/etools-modules-common/dist/components/buttons/support-button';

import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {RootState, store} from '../../../redux/store';
import {isProductionServer} from '../../../config/config';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import isEmpty from 'lodash-es/isEmpty';
import {updateCurrentUser} from '../../user/user-actions';
import {translate, get as getTranslation} from 'lit-translate';
import {setActiveLanguage} from '../../../redux/actions/active-language';
import {activeLanguage} from '../../../redux/reducers/active-language';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {updateUserData} from '../../../redux/actions/user';

import {appLanguages} from '../../../config/app-constants';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';

store.addReducers({
  activeLanguage
});
/**
 * page header element
 * @LitElement
 * @customElement
 */
@customElement('page-header')
export class PageHeader extends connect(store)(LitElement) {
  static get styles() {
    return [];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <style>
        etools-accesibility {
          display: none;
        }
      </style>

      <app-toolbar
        @menu-button-clicked="${this.menuBtnClicked}"
        .profile=${this.profile}
        sticky
        class="content-align header"
      >
        <etools-icon-button
          id="menuButton"
          name="menu"
          class="nav-menu-button"
          @click="${() => this.menuBtnClicked()}"
        ></etools-icon-button>
        <div slot="dropdowns">
          <languages-dropdown
            .profile="${this.profile}"
            .availableLanguages="${appLanguages}"
            .activeLanguage="${this.selectedLanguage}"
            .changeLanguageEndpoint="${etoolsEndpoints.userProfile}"
            @user-language-changed="${this.languageChanged}"
          ></languages-dropdown>

          <countries-dropdown
            id="countrySelector"
            .profile="${this.profile}"
            dir="${this.dir}"
            .changeCountryEndpoint="${etoolsEndpoints.changeCountry}"
            @country-changed="${this.triggerCountryChangeRequest}"
          ></countries-dropdown>
          <organizations-dropdown
            id="organizationSelector"
            .profile="${this.profile}"
            .changeOrganizationEndpoint="${etoolsEndpoints.changeOrganization}"
            @organization-changed="${this.triggerCountryChangeRequest}"
          ></organizations-dropdown>
        </div>
        <div slot="icons">
          <support-btn></support-btn>

          <etools-profile-dropdown
            title=${translate('GENERAL.PROFILEANDSIGNOUT')}
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .profile="${this.profile ? {...this.profile} : {}}"
            language="${this.selectedLanguage}"
            @save-profile="${this.handleSaveProfile}"
            @sign-out="${this._signOut}"
          >
          </etools-profile-dropdown>
        </div>
      </app-toolbar>
    `;
  }

  @property({type: Boolean})
  public isStaging = false;

  @property({type: String})
  public headerColor = 'var(--header-bg-color)';

  @property({type: Object})
  profile!: EtoolsUser | null;

  @property({type: Object})
  profileDropdownData: any | null = null;

  @property({type: Array})
  offices: any[] = [];

  @property({type: Array})
  sections: any[] = [];

  @property({type: Array})
  users: any[] = [];

  @property({type: Array})
  profileDrOffices: any[] = [];

  @property({type: Array})
  profileDrSections: any[] = [];

  @property({type: Array})
  profileDrUsers: any[] = [];

  @property({type: Array})
  editableFields: string[] = ['office', 'section', 'job_title', 'phone_number', 'oic', 'supervisor'];

  @property({type: String})
  environment = 'LOCAL';

  @property({type: String})
  dir = '';

  @property() selectedLanguage!: string;

  // @query('#languageSelector') private languageDropdown!: EtoolsDropdownEl;

  public connectedCallback() {
    super.connectedCallback();
    this.checkEnvironment();

    // setTimeout(() => {
    //   const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
    //   this.languageDropdown.fitInto = fitInto;
    // }, 0);
  }

  public stateChanged(state: RootState) {
    if (state.user?.data) {
      this.profile = state.user!.data;
    }
    if (state.activeLanguage!.activeLanguage && state.activeLanguage!.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage!.activeLanguage;
    }
  }

  public handleSaveProfile(e: any) {
    const modifiedFields = this._getModifiedFields(this.profile, e.detail.profile);
    if (isEmpty(modifiedFields)) {
      // empty profile means no changes found
      this.showSaveNotification();
      return;
    }
    this.profileSaveLoadingMsgDisplay();
    updateCurrentUser(modifiedFields)
      .then(() => {
        this.showSaveNotification();
      })
      .catch(() => {
        this.showSaveNotification(getTranslation('PROFILE_DATA_NOT_SAVED'));
      })
      .then(() => {
        this.profileSaveLoadingMsgDisplay(false);
      });
  }

  protected profileSaveLoadingMsgDisplay(show = true) {
    fireEvent(this, 'global-loading', {
      active: show,
      loadingSource: 'profile-save'
    });
  }

  protected showSaveNotification(msg?: string) {
    fireEvent(this, 'toast', {
      text: msg ? msg : getTranslation('ALL_DATA_SAVED')
    });
  }

  protected _getModifiedFields(originalData: any, newData: any) {
    const modifiedFields: AnyObject = {};
    this.editableFields.forEach(function (field: any) {
      if (originalData[field] !== newData[field]) {
        modifiedFields[field] = newData[field];
      }
    });

    return modifiedFields;
  }

  public languageChanged(e: any) {
    store.dispatch(updateUserData(e.detail.user));
    store.dispatch(setActiveLanguage(e.detail.language));
  }

  public menuBtnClicked() {
    fireEvent(this, 'change-drawer-state');
  }

  protected _signOut() {
    // this._clearDexieDbs();
    this.clearLocalStorage();
    window.location.href = window.location.origin + '/social/unicef-logout/';
  }

  protected clearLocalStorage() {
    localStorage.clear();
  }

  protected checkEnvironment() {
    this.isStaging = !isProductionServer();
    this.environment = isProductionServer() ? 'DEMO' : 'LOCAL';
  }

  protected triggerCountryChangeRequest() {
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    // force page reload to load all data specific to the new country
    document.location.assign(Environment.baseUrl);
  }
}
