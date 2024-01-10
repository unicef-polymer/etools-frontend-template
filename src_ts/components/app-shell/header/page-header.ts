import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar.js';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button.js';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import './countries-dropdown';
import './organizations-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {RootState, store} from '../../../redux/store';
import {isProductionServer, ROOT_PATH} from '../../../config/config';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import isEmpty from 'lodash-es/isEmpty';
import {updateCurrentUser} from '../../user/user-actions';
import {pageHeaderStyles} from './page-header-styles';
import {translate, use, get as getTranslation} from 'lit-translate';
import {setActiveLanguage} from '../../../redux/actions/active-language';
import {activeLanguage} from '../../../redux/reducers/active-language';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {updateUserData} from '../../../redux/actions/user';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import 'dayjs/locale/fr.js';
import 'dayjs/locale/ru.js';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/ar.js';
import 'dayjs/locale/ro.js';
import 'dayjs/locale/es.js';
import {appLanguages} from '../../../config/app-constants';
import '../../common/layout/support-btn';

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
    return [pageHeaderStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      ${countriesDropdownStyles}
      <style>
        app-toolbar {
          background-color: ${this.headerColor};
        }
        support-btn {
          color: var(--header-icon-color);
        }
        .dropdowns {
          display: flex;
          margin-right: 5px;
        }
        .header {
          flex-wrap: wrap;
          height: 100%;
          justify-content: space-between;
        }
        .nav-menu-button {
          min-width: 70px;
        }
        .header__item {
          display: flex;
          align-items: center;
        }
        .header__right-group {
          justify-content: space-evenly;
        }
        .logo {
          margin-left: 20px;
        }
        @media (max-width: 380px) {
          .header__item {
            flex-grow: 1;
          }
        }
        @media (max-width: 576px) {
          #app-logo {
            display: none;
          }
          .envWarning {
            font-size: 10px;
            margin-left: 2px;
          }
        }
      </style>

      <app-toolbar sticky class="content-align">
        <etools-icon-button
          id="menuButton"
          name="menu"
          class="nav-menu-button"
          @click="${() => this.menuBtnClicked()}"
        ></etools-icon-button>
        <div class="titlebar content-align">
          <img id="app-logo" class="logo" src="images/etools-logo-color-white.svg" alt="eTools" />
          ${this.isStaging
            ? html`<div class="envWarning">
           <span class='envLong'> - </span>${this.environment} <span class='envLong'>  TESTING ENVIRONMENT</div>`
            : ''}
        </div>
        <div class="header__item header__right-group">
          <div class="dropdowns">
            <etools-dropdown
              id="languageSelector"
              transparent
              .selected="${this.selectedLanguage}"
              .options="${appLanguages}"
              option-label="display_name"
              option-value="value"
              @etools-selected-item-changed="${({detail}: CustomEvent) => this.languageChanged(detail.selectedItem)}"
              trigger-value-change-event
              hide-search
              allow-outside-scroll
              no-label-float
              .autoWidth="${true}"
            ></etools-dropdown>

            <countries-dropdown dir="${this.dir}"></countries-dropdown>
            <organizations-dropdown></organizations-dropdown>
          </div>

          <support-btn title="${translate('SUPPORT')}"></support-btn>

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
  rootPath: string = ROOT_PATH;

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
    this.setBgColor();
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
      window.EtoolsLanguage = this.selectedLanguage;
      this.setLanguageDirection();
    }
  }

  private setLanguageDirection() {
    setTimeout(() => {
      const htmlTag = document.querySelector('html');
      if (this.selectedLanguage === 'ar') {
        htmlTag!.setAttribute('dir', 'rtl');
        this.setAttribute('dir', 'rtl');
        this.dir = 'rtl';
      } else if (htmlTag!.getAttribute('dir')) {
        htmlTag!.removeAttribute('dir');
        this.removeAttribute('dir');
        this.dir = '';
      }
    });
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

  languageChanged(selectedItem: any): void {
    if (!selectedItem || !selectedItem.value) {
      return;
    }
    const newLanguage = selectedItem.value;
    if (newLanguage) {
      window.dayjs.locale(newLanguage);
      // Event caught by self translating npm packages
      fireEvent(this, 'language-changed', {language: newLanguage});
    }
    if (this.selectedLanguage !== newLanguage) {
      window.EtoolsLanguage = newLanguage;
      use(newLanguage).then(() => {
        if (this.profile && this.profile.preferences?.language != newLanguage) {
          this.updateUserPreference(newLanguage);
        }
      });
    }
  }

  private updateUserPreference(language: string) {
    // @ts-ignore
    sendRequest({endpoint: etoolsEndpoints.userProfile, method: 'PATCH', body: {preferences: {language: language}}})
      .then((response) => {
        store.dispatch(updateUserData(response));
        store.dispatch(setActiveLanguage(language));
      })
      .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this));
  }

  public menuBtnClicked() {
    fireEvent(this, 'change-drawer-state');
  }

  private setBgColor() {
    // If not production environment, changing header color to red
    if (!isProductionServer()) {
      this.headerColor = 'var(--nonprod-header-color)';
    }
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
}
