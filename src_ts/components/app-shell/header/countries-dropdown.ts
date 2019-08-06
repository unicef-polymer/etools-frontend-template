import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store, RootState} from '../../../redux/store';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';

import EtoolsPageRefreshMixin from '@unicef-polymer/etools-behaviors/etools-page-refresh-mixin.js';
// import EndpointsMixin from '../../endpoints/endpoints-mixin.js';
import {fireEvent} from '../../utils/fire-custom-event.js';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';
import {property} from '@polymer/decorators';
import {GenericObject} from '../../../types/globals';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import {EtoolsUserModel} from "../../user/user-model";

import {CountriesDropdownStyles} from './countries-dropdown-styles';

/**
 * @polymer
 * @customElement
 * @mixinFunction
 * @appliesMixin EndpointsMixin
 * @appliesMixin EtoolsPageRefreshMixin
 */
class CountriesDropdown extends connect(store)(EtoolsPageRefreshMixin(PolymerElement)) {

    public static get template() {
        // main template
        // language=HTML
        return html`
            ${CountriesDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown id="countrySelector"
                       selected="[[currentCountry.id]]"
                       placeholder="Country"
                       allow-outside-scroll
                       no-label-float
                       options="[[countries]]"
                       option-label="name"
                       option-value="id"
                       trigger-value-change-event
                       on-etools-selected-item-changed="_countrySelected"
                       shown-options-limit="250"
                       hide-search></etools-dropdown>

    `;
    }

    @property({type: Object})
    currentCountry: GenericObject = {};

    @property({type: Array, observer: '_countrySelectorUpdate'})
    countries: any[] = [];

    @property({type: Boolean})
    countrySelectorVisible: boolean = false;

    @property({type: Object, observer: 'userDataChanged'})
    userData!: EtoolsUserModel;

    public connectedCallback() {

        super.connectedCallback();

        setTimeout(() => {
            const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
            (this.$.countrySelector as EtoolsDropdownEl).set('fitInto', fitInto);
        }, 0);
    }

    public stateChanged(state: RootState) {
        // TODO: polymer 3 do what?
        if (!state) {
            return;
        }
        this.userData = state.user!.data;
    }

    userDataChanged(userData) {
        if (userData) {
            this.countries = userData.countries_available;
            this.currentCountry = userData.country;
        }

    }

    protected _countrySelected(e: any) {
        if (!e.detail.selectedItem) {
            return;
        }

        const selectedCountryId = parseInt(e.detail.selectedItem.id, 10);
        const selectedCountry = e.detail.selectedItem;


        if (selectedCountryId !== this.currentCountry.id) {
            // send post request to change_coutry endpoint
            // this._triggerCountryChangeRequest(selectedCountryId);
            this._triggerCountryChangeRequest(selectedCountry);
        }
    }

    protected _triggerCountryChangeRequest(selectedCountry: any) {
        const self = this;
        fireEvent(this, 'global-loading', {
            message: 'Please wait while country data is changing...',
            active: true,
            loadingSource: 'country-change'
        });

        this.currentCountry = selectedCountry;

        // this.sendRequest({
        //     endpoint: this.getEndpoint('changeCountry'),
        //     method: 'POST',
        //     body: {country: countryId}
        // }).then(function() {
        //     self._handleResponse();
        // }).catch(function(error: any) {
        //     self._handleError(error);
        // });
    }

    // protected _handleResponse() {
    //     fireEvent(this, 'update-main-path', {path: 'partners'});
    //     this.refresh();
    // }

    protected _countrySelectorUpdate(countries: any) {
        if (Array.isArray(countries) && (countries.length > 1)) {
            this.countrySelectorVisible = true;
        }
    }

    protected _handleError(error: any) {
        logError('Country change failed!', 'countries-dropdown', error);
        (this.$.countrySelector as EtoolsDropdownEl).set('selected', this.currentCountry.id);
        fireEvent(this, 'toast', {text: 'Something went wrong changing your workspace. Please try again'});
        fireEvent(this, 'global-loading', {active: false, loadingSource: 'country-change'});
    }

}

window.customElements.define('countries-dropdown', CountriesDropdown);
