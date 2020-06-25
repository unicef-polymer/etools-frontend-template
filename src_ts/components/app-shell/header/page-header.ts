import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown';
import {customElement, LitElement, html, property} from 'lit-element';

import '../../common/layout/support-btn';
import './countries-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {RootState, store} from '../../../redux/store';
import {isProductionServer, ROOT_PATH} from '../../../config/config';
import {updateDrawerState} from '../../../redux/actions/app';
import {EtoolsUserModel, dummyUserData} from '../../user/user-model';
import {fireEvent} from '../../utils/fire-custom-event';
import isEmpty from 'lodash-es/isEmpty';
import {updateCurrentUserData} from '../../user/user-actions';
import {AnyObject} from '../../../types/globals';
import {pageHeaderStyles} from './page-header-styles';

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
      <style>
        app-toolbar {
          background-color: ${this.headerColor};
        }
        support-btn {
          color: var(--header-icon-color);
        }

        @media (max-width: 576px) {
          etools-app-selector {
            --app-selector-button-padding: 18px 8px;
          }
          #app-logo {
            display: none;
          }
          .envWarning {
            font-size: 10px;
            margin-left: 2px;
          }
          #refresh {
            width: 24px;
            padding: 0px;
          }
          app-toolbar {
            padding-right: 4px;
          }
        }
      </style>

      <app-toolbar sticky class="content-align">
        <paper-icon-button id="menuButton" icon="menu" @tap="${() => this.menuBtnClicked()}"></paper-icon-button>
        <div class="titlebar content-align">
          <etools-app-selector id="selector"></etools-app-selector>
          <img id="app-logo" src="images/etools-logo-color-white.svg" alt="eTools" />
          ${this.isStaging
            ? html`<div class="envWarning">
           <span class='envLong'> - </span>${this.environment} <span class='envLong'>  TESTING ENVIRONMENT</div>`
            : ''}
        </div>
        <div class="content-align">
          <support-btn></support-btn>

          <etools-profile-dropdown
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .profile="${this.profile ? {...this.profile} : {}}"
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
  profile!: EtoolsUserModel;

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

  public connectedCallback() {
    super.connectedCallback();
    this.setBgColor();
    this.checkEnvironment();
  }

  public stateChanged(state: RootState) {
    if (state) {
      this.profile = state.user!.data as EtoolsUserModel;
      this.profile = dummyUserData;
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
    updateCurrentUserData(modifiedFields)
      .then(() => {
        this.showSaveNotification();
      })
      .catch(() => {
        this.showSaveNotification('Profile data not saved. Save profile error!');
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
      text: msg ? msg : 'All changes are saved.',
      showCloseBtn: false
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

  public menuBtnClicked() {
    store.dispatch(updateDrawerState(true));
    // fireEvent(this, 'drawer');
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
    window.location.href = window.location.origin + '/logout';
  }

  // TODO
  // protected _clearDexieDbs() {
  //   window.EtoolsPmpApp.DexieDb.delete();
  // }

  protected clearLocalStorage() {
    localStorage.clear();
  }

  protected checkEnvironment() {
    this.isStaging = !isProductionServer();
    this.environment = isProductionServer() ? 'DEMO' : 'LOCAL';
  }
}
