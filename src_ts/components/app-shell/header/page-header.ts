import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '../../common/layout/support-btn';
import './countries-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {RootState, store} from '../../../redux/store';

import {isProductionServer, isStagingServer} from '../../../config/config';
import {updateDrawerState} from '../../../redux/actions/app';
import {property} from '@polymer/decorators/lib/decorators';
import {EtoolsUserModel} from '../../user/user-model';
import {fireEvent} from '../../utils/fire-custom-event';
import {isEmptyObject} from '../../utils/utils';
import {GenericObject} from '../../../types/globals';
import {updateCurrentUserData} from '../../user/user-actions';

/**
 * page header element
 * @polymer
 * @customElement
 * @appliesMixin GestureEventListeners
 */
class PageHeader extends connect(store)(GestureEventListeners(PolymerElement)) {

  public static get template() {
    // main template
    // language=HTML
    return html`        
      <style>
        app-toolbar {
          padding: 0 16px 0 0;
          height: 60px;
          background-color: var(--header-bg-color);
        }

        .titlebar {
          color: var(--header-color);
        }

        #menuButton {
          display: block;
          color: var(--header-color);
        }

        support-btn{
          color: var(--header-color);
        }

        .titlebar {
          @apply --layout-flex;
          font-size: 28px;
          font-weight: 300;
        }

        .titlebar img {
          width: 34px;
          margin: 0 8px 0 24px;
        }

        .content-align {
          @apply --layout-horizontal;
          @apply --layout-center;
        }

        #app-logo {
          height: 32px;
          width: auto;
        }

        .envWarning {
          color: var(--nonprod-text-warn-color);
          font-weight: 700;
          font-size: 18px;
        }

        @media (min-width: 850px) {
          #menuButton {
            display: none;
          }
        }
      </style>
      
      <app-toolbar sticky class="content-align">
        <paper-icon-button id="menuButton" icon="menu" on-tap="menuBtnClicked"></paper-icon-button>
        <div class="titlebar content-align">
          <etools-app-selector id="selector"></etools-app-selector>
          <img id="app-logo" src$="[[rootPath]]images/etools-logo-color-white.svg">
          <dom-if if="[[_isStaging]]">
            <template>
              <div class="envWarning"> - STAGING TESTING ENVIRONMENT</div>
            </template>
          </dom-if>
        </div>
        <div class="content-align">
          <countries-dropdown id="countries" countries="[[countries]]"
                              current-country="[[profile.country]]"></countries-dropdown>

          <support-btn></support-btn> 

          <etools-profile-dropdown
              sections="[[allSections]]"
              offices="[[allOffices]]"
              users="[[allUsers]]"
              profile="{{profile}}"
              on-save-profile="_saveProfile"
              on-sign-out="_signOut"></etools-profile-dropdown>

          <!--<paper-icon-button id="refresh" icon="refresh" on-tap="_openDataRefreshDialog"></paper-icon-button>-->
        </div>
      </app-toolbar>
    `;
  }

  @property({type: Boolean})
  _isStaging: boolean = false;

  @property({type: Object})
  profile: any | null = null;

  @property({type: Object})
  profileDropdownData: any | null = null;

  @property({type: Array})
  offices: any[] = [];

  @property({type: Array})
  sections: any[] = [];

  @property({type: Array})
  users: EtoolsUserModel[] = [];

  @property({type: Array})
  editableFields: string[] = ['office', 'section', 'job_title', 'phone_number', 'oic', 'supervisor'];

  public connectedCallback() {
    super.connectedCallback();
    this._setBgColor();
    this._isStaging = isStagingServer();
  }

  // @ts-ignore
  public stateChanged(state: RootState) {
    // TODO
    console.log(state);
    if (state) {
      this.profile = state.user!.data;
    }
  }

  public _saveProfile(e: any) {
    const modifiedFields = this._getModifiedFields(this.profile, e.detail.profile);
    this.saveProfile(modifiedFields);
  }

  public saveProfile(profile: any) {
    if (isEmptyObject(profile)) {
      // empty profile means no changes found
      fireEvent(this, 'toast', {
        text: 'All changes are saved.',
        showCloseBtn: false
      });
      return;
    }

    updateCurrentUserData(profile);
  }

  protected _getModifiedFields(originalData: any, newData: any) {
    const modifiedFields: GenericObject = {};
    this.editableFields.forEach(function(field: any) {
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

  public _setBgColor() {
    // If not production environment, changing header color to red
    if (!isProductionServer()) {
      this.updateStyles({'--header-bg-color': 'var(--nonprod-header-color)'});
    }
  }
}

window.customElements.define('page-header', PageHeader);
