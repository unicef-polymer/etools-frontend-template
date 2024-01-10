/**
@license
Copyright (c) 2019 The eTools Project Authors. All rights reserved.
*/

import {connect} from 'pwa-helpers/connect-mixin.js';
import {installMediaQueryWatcher} from 'pwa-helpers/media-query.js';
import {installRouter} from 'pwa-helpers/router.js';

// This element is connected to the Redux store.
import {store, RootState} from './redux/store';

// These are the actions needed by this element.
import {navigate} from './redux/actions/app';

// Routes
import './routing/routes';

// These are the elements needed by this element.
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer-layout.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header-layout.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header.js';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar.js';
import '@unicef-polymer/etools-piwik-analytics/etools-piwik-analytics';
import {createDynamicDialog} from '@unicef-polymer/etools-unicef/src/etools-dialog/dynamic-dialog';

import {LoadingMixin} from '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading-mixin';
import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {AppShellStyles} from './components/app-shell/app-shell-styles';

import './components/app-shell/menu/app-menu.js';
import './components/app-shell/header/page-header.js';
import './components/app-shell/footer/page-footer.js';

import user from './redux/reducers/user';
import commonData, {CommonDataState} from './redux/reducers/common-data';
import uploadStatus from './redux/reducers/upload-status.js';
import {getCurrentUser} from './components/user/user-actions';
import {getUnicefUsers, SET_ALL_STATIC_DATA, UPDATE_STATIC_DATA} from './redux/actions/common-data';
import get from 'lodash-es/get';
import '@unicef-polymer/etools-unicef/src/etools-toasts/etools-toasts';
import {registerTranslateConfig, use, translate} from 'lit-translate';
import {EtoolsUser, RouteDetails} from '@unicef-polymer/etools-types';
import {setStore} from '@unicef-polymer/etools-utils/dist/store.util';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from './config/config';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {ROOT_PATH} from '@unicef-polymer/etools-modules-common/dist/config/config';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {RESET_CURRENT_ITEM, RESET_UNSAVED_UPLOADS, RESET_UPLOADS_IN_PROGRESS} from './redux/actions/upload-status';
import UploadsMixin from '@unicef-polymer/etools-modules-common/dist/mixins/uploads-mixin';
import '@unicef-polymer/etools-modules-common/dist/layout/are-you-sure';
import {getTranslatedValue} from '@unicef-polymer/etools-modules-common/dist/utils/language';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import {EtoolsIconSet, initializeIcons} from '@unicef-polymer/etools-unicef/src/etools-icons/etools-icons';
import {getPartnersDummyData} from './components/pages/page-one/list/list-dummy-data';

declare const dayjs: any;
declare const dayjs_plugin_utc: any;

dayjs.extend(dayjs_plugin_utc);

function fetchLangFiles(lang: string) {
  return fetch(`assets/i18n/${lang}.json`).then((res: any) => res.json());
}
registerTranslateConfig({
  empty: (key) => `${key && key[0].toUpperCase() + key.slice(1).toLowerCase()}`,
  loader: (lang: string) => fetchLangFiles(lang)
});

// set store
setStore(store as any);

store.addReducers({
  user,
  commonData,
  uploadStatus
});

setBasePath('/template/');
initializeIcons([
  EtoolsIconSet.communication,
  EtoolsIconSet.device,
  EtoolsIconSet.social,
  EtoolsIconSet.av,
  EtoolsIconSet.image,
  EtoolsIconSet.maps
]);

/**
 * @customElement
 * @LitElement
 */
@customElement('app-shell')
export class AppShell extends connect(store)(UploadsMixin(LoadingMixin(LitElement))) {
  static get styles() {
    return [AppShellStyles];
  }

  public render() {
    // main template
    // language=HTML
    return html`
      <etools-piwik-analytics
        .page="${ROOT_PATH + this.mainPage}"
        .user="${this.user}"
        .toast="${this.currentToastMessage}"
      >
      </etools-piwik-analytics>

      <etools-toasts></etools-toasts>

      <app-drawer-layout
        id="layout"
        responsive-width="850px"
        fullbleed
        ?narrow="${this.narrow}"
        ?small-menu="${this.smallMenu}"
      >
        <!-- Drawer content -->
        <app-drawer
          id="drawer"
          slot="drawer"
          transition-duration="350"
          @app-drawer-transitioned="${this.onDrawerToggle}"
          ?opened="${this.drawerOpened}"
          ?swipe-open="${this.narrow}"
          ?small-menu="${this.smallMenu}"
        >
          <!-- App main menu(left sidebar) -->
          <app-menu .selectedOption="${this.mainPage}" ?small-menu="${this.smallMenu}"></app-menu>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header slot="header" fixed shadow>
            <page-header id="pageheader"></page-header>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <page-one-list
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-one', this.subPage, 'list')}"
            ></page-one-list>
            <page-one-tabs
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-one', this.subPage, 'details|questionnaires')}"
            >
            </page-one-tabs>
            <page-two class="page" ?active="${this.isActivePage(this.mainPage, 'page-two')}"></page-two>
            <page-not-found
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-not-found')}"
            ></page-not-found>
          </main>

          <page-footer></page-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  @property({type: Boolean})
  public narrow = true;

  @property({type: Boolean})
  public drawerOpened = false;

  @property({type: Object})
  public routeDetails!: RouteDetails;

  @property({type: String})
  public mainPage = ''; // routeName

  @property({type: String})
  public subPage: string | null = null; // subRouteName

  @property({type: Boolean})
  public smallMenu = false;

  @property({type: String})
  selectedLanguage!: string;

  @property({type: Object})
  user!: EtoolsUser;

  @property({type: String})
  currentToastMessage!: string;

  @property({type: Boolean})
  private translationFilesAreLoaded = false;

  @query('#drawer') private drawer!: LitElement;
  @query('#appHeadLayout') private appHeaderLayout!: LitElement;

  constructor() {
    super();

    const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
    if (!menuTypeStoredVal) {
      this.smallMenu = false;
    } else {
      this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    this.checkAppVersion();
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname + location.search))));
    this.addEventListener('scroll-up', () => {
      if (this.appHeaderLayout) {
        const contentContainer = this.appHeaderLayout.shadowRoot!.querySelector('#contentContainer');
        if (contentContainer) {
          contentContainer.scrollTop = 0;
        }
      }
    });
    this.addEventListener('change-drawer-state', this.changeDrawerState);
    this.addEventListener('app-drawer-transitioned', this.syncWithDrawerState);
    this.addEventListener('toggle-small-menu', this.toggleMenu as any);
    installMediaQueryWatcher(`(min-width: 460px)`, () => fireEvent(this, 'change-drawer-state'));

    getCurrentUser().then((user?: EtoolsUser) => {
      if (user) {
        this.user = user;
        // @ts-ignore
        Promise.allSettled([getUnicefUsers(), getPartnersDummyData()]).then((response: any[]) => {
          store.dispatch({
            type: SET_ALL_STATIC_DATA,
            staticData: this.formatResponse(response)
          });
        });
      }
    });

    this.waitForComponentRender().then(() => {
      window.EtoolsEsmmFitIntoEl = this.appHeaderLayout!.shadowRoot!.querySelector('#contentContainer');
      this.etoolsLoadingContainer = window.EtoolsEsmmFitIntoEl;
      // Override ajax error parser inside @unicef-polymer/etools-utils/dist/etools-ajax
      // for string translation using lit-translate
      window.ajaxErrorParserTranslateFunction = (key: string) => {
        return getTranslatedValue(key);
      };
    });
  }

  public changeDrawerState() {
    this.drawerOpened = !this.drawerOpened;
  }

  public syncWithDrawerState() {
    this.drawerOpened = Boolean((this.shadowRoot?.querySelector('#drawer') as any).opened);
  }

  checkAppVersion() {
    fetch('version.json')
      .then((res) => res.json())
      .then((version) => {
        if (version.revision != document.getElementById('buildRevNo')!.innerText) {
          console.log('version.json', version.revision);
          console.log('buildRevNo ', document.getElementById('buildRevNo')!.innerText);
          this._showConfirmNewVersionDialog();
        }
      });
  }

  private _showConfirmNewVersionDialog() {
    const msg = document.createElement('span');
    msg.innerText = 'A new version of the app is available. Refresh page?';
    const conf: any = {
      size: 'md',
      closeCallback: this._onConfirmNewVersion.bind(this),
      content: msg
    };
    const confirmNewVersionDialog = createDynamicDialog(conf);
    confirmNewVersionDialog.opened = true;
  }

  private _onConfirmNewVersion(e: CustomEvent) {
    if (e.detail.confirmed) {
      if (navigator.serviceWorker) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
          location.reload();
        });
      }
    }
  }

  private formatResponse(response: any[]) {
    const data: Partial<CommonDataState> = {};
    data.unicefUsers = this.getValue(response[0]);
    data.partners = this.getValue(response[1]);
    return data;
  }

  private formatResponseOnLanguageChange(response: any[]) {
    const data: Partial<CommonDataState> = {};
    this.setStaticDataFromResponse(data, this.getValue(response[0], {}));
    return data;
  }

  private setStaticDataFromResponse(data: Partial<CommonDataState>, staticData: any) {
    console.log(data, staticData);
    // TODO
  }

  getValue(response: {status: string; value?: any; reason?: any}, defaultValue: any = []) {
    return response.status === 'fulfilled' ? response.value : defaultValue;
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change-drawer-state', this.changeDrawerState);
    this.removeEventListener('app-drawer-transitioned', this.syncWithDrawerState);
    this.removeEventListener('toggle-small-menu', this.toggleMenu as any);
  }

  protected shouldUpdate(changedProperties: Map<PropertyKey, unknown>): boolean {
    return this.translationFilesAreLoaded && super.shouldUpdate(changedProperties);
  }

  public async stateChanged(state: RootState) {
    this.uploadsStateChanged(state);

    this.routeDetails = state.app!.routeDetails;
    this.mainPage = state.app!.routeDetails!.routeName;
    this.subPage = state.app!.routeDetails!.subRouteName;

    if (get(state, 'app.toastNotification.active')) {
      fireEvent(this, 'toast', {
        text: state.app!.toastNotification.message,
        hideCloseBtn: !state.app!.toastNotification.showCloseBtn
      });
    }
    if (state.activeLanguage?.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      if (this.selectedLanguage) {
        // on language change, reload parts of commonData in order to use BE localized text
        this.loadDataOnLanguageChange();
      }
      this.selectedLanguage = state.activeLanguage!.activeLanguage;
      this.loadLocalization();
    }
  }

  async loadLocalization() {
    await use(this.selectedLanguage);
    this.translationFilesAreLoaded = true;
  }

  loadDataOnLanguageChange() {
    Promise.allSettled([]).then((response: any[]) => {
      store.dispatch({
        type: UPDATE_STATIC_DATA,
        staticData: this.formatResponseOnLanguageChange(response)
      });
    });
  }

  waitForComponentRender() {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.appHeaderLayout) {
          clearInterval(check);
          resolve(true);
        }
      }, 100);
    });
  }

  // TODO: just for testing...
  public getState() {
    console.log(store.getState());
  }

  // Testing router (from console)
  public getRouter() {
    return EtoolsRouter;
  }

  public onDrawerToggle() {
    if (this.drawerOpened !== (this.drawer as any).opened) {
      this.drawerOpened = Boolean((this.drawer as any).opened);
    }
  }

  public toggleMenu(e: CustomEvent) {
    this.smallMenu = e.detail.value;
  }

  protected isActiveMainPage(currentPageName: string, expectedPageName: string): boolean {
    return currentPageName === expectedPageName;
  }

  protected isActiveSubPage(currentSubPageName: string, expectedSubPageNames: string): boolean {
    const subPages: string[] = expectedSubPageNames.split('|');
    return subPages.indexOf(currentSubPageName) > -1;
  }

  protected isActivePage(
    pageName: string,
    expectedPageName: string,
    currentSubPageName?: string | null,
    expectedSubPageNames?: string
  ): boolean {
    if (!this.isActiveMainPage(pageName, expectedPageName)) {
      return false;
    }
    if (currentSubPageName && expectedSubPageNames) {
      return this.isActiveSubPage(currentSubPageName, expectedSubPageNames);
    }
    return true;
  }

  existsUnsavedUploads() {
    return Number(this.uploadsInProgress) > 0 || Number(this.unsavedUploads) > 0;
  }

  async confirmLeaveUploadsUnsavedDialog(prevPath: string, pathToRedirect: string) {
    // stay in the page where change was made
    EtoolsRouter.replaceAppLocation(prevPath);

    const confirmed = await openDialog({
      dialog: 'are-you-sure',
      dialogData: {
        content: translate('GENERAL.LEAVE_UPLOADS_UNSAVED'),
        confirmBtnText: translate('GENERAL.LEAVE'),
        cancelBtnText: translate('GENERAL.STAY')
      }
    }).then(({confirmed}) => {
      return confirmed;
    });
    if (confirmed) {
      // confirmed to leave page and loose changes, reset uploads and redirect
      store.dispatch({type: RESET_UNSAVED_UPLOADS});
      store.dispatch({type: RESET_UPLOADS_IN_PROGRESS});
      store.dispatch(this.resetCurrentItem());
      EtoolsRouter.replaceAppLocation(pathToRedirect);
    }
  }

  resetCurrentItem = () => {
    return {
      type: RESET_CURRENT_ITEM
    };
  };
}
