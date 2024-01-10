import {connect} from 'pwa-helpers/connect-mixin.js';
import {store, RootState} from '../../../redux/store';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {LitElement, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

// import EndpointsMixin from '../../endpoints/endpoints-mixin.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {changeCurrentUserCountry} from '../../user/user-actions';
import {ROOT_PATH} from '../../../config/config';
import {AnyObject, AvailableUserCountry, EtoolsUser} from '@unicef-polymer/etools-types';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';

/**
 * @LitElement
 * @customElement
 */
@customElement('countries-dropdown')
export class CountriesDropdown extends connect(store)(LitElement) {
  public render() {
    // main template
    // language=HTML
    return html`
      ${countriesDropdownStyles}
      <!-- shown options limit set to 280 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        id="countrySelector"
        transparent
        class="w100"
        .selected="${this.currentCountry.id}"
        placeholder="Country"
        allow-outside-scroll
        no-label-float
        .options="${this.countries}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this.countrySelected}"
        .shownOptionsLimit="${280}"
        hide-search
        .autoWidth="${true}"
      ></etools-dropdown>
    `;
  }

  @property({type: Object})
  currentCountry: AnyObject = {};

  @property({type: Array})
  countries: AvailableUserCountry[] = [];

  @property({type: Object})
  userData!: EtoolsUser;

  @query('#countrySelector') private countryDropdown!: EtoolsDropdownEl;

  public connectedCallback() {
    super.connectedCallback();
  }

  public stateChanged(state: RootState) {
    if (!state.user || !state.user.data || JSON.stringify(this.userData) === JSON.stringify(state.user.data)) {
      return;
    }
    this.userData = state.user.data;
    this.userDataChanged(this.userData);
  }

  userDataChanged(userData: EtoolsUser) {
    if (userData) {
      this.countries = userData.countries_available;
      this.currentCountry = userData.country;
    }
  }

  protected countrySelected(e: CustomEvent) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedCountryId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedCountryId !== this.currentCountry.id) {
      // send post request to change_country endpoint
      this.triggerCountryChangeRequest(selectedCountryId);
    }
  }

  protected triggerCountryChangeRequest(selectedCountryId: number) {
    fireEvent(this, 'global-loading', {
      message: 'Please wait while country data is changing...',
      active: true,
      loadingSource: 'country-change'
    });
    changeCurrentUserCountry(selectedCountryId)
      .then(() => {
        // country change req returns 204
        // redirect to default page
        // TODO: clear all cached data related to old country
        EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
        // force page reload to load all data specific to the new country
        document.location.assign(window.location.origin + ROOT_PATH);
      })
      .catch((error: any) => {
        this.handleCountryChangeError(error);
      })
      .then(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: 'country-change'
        });
      });
  }

  protected handleCountryChangeError(error: any) {
    EtoolsLogger.warn('Country change failed!', 'countries-dropdown', error);
    this.countryDropdown.selected = this.currentCountry.id;
    fireEvent(this, 'toast', {text: 'Something went wrong changing your workspace. Please try again'});
  }
}
