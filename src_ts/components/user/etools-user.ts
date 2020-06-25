import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {sendRequest} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {property} from '@polymer/decorators/lib/decorators';
import {EtoolsUserModel} from './user-model';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../redux/store';
import {getEndpoint} from '../../endpoints/endpoints';
import {AnyObject} from '../../types/globals';
import {updateUserData} from '../../redux/actions/user';

const PROFILE_ENDPOINT = 'userProfile';
const CHANGE_COUNTRY_ENDPOINT = 'changeCountry';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsUser extends connect(store)(PolymerElement) {
  @property({type: Object, notify: true})
  userData: EtoolsUserModel | null = null;

  private profileEndpoint = getEndpoint(PROFILE_ENDPOINT);
  private changeCountryEndpoint = getEndpoint(CHANGE_COUNTRY_ENDPOINT);

  public stateChanged(state: RootState) {
    this.userData = state.user!.data;
    console.log('[EtoolsUser]: store user data received', state.user!.data);
  }

  public getUserData() {
    return sendRequest({
      endpoint: {url: this.profileEndpoint.url}
    })
      .then((response: AnyObject) => {
        // console.log('response', response);
        store.dispatch(updateUserData(response));
      })
      .catch((error: AnyObject) => {
        console.error('[EtoolsUser]: getUserData req error...', error);
        throw error;
      });
  }

  public updateUserData(profile: AnyObject) {
    return sendRequest({
      method: 'PATCH',
      endpoint: {url: this.profileEndpoint.url},
      body: profile
    })
      .then((response: AnyObject) => {
        store.dispatch(updateUserData(response));
      })
      .catch((error: AnyObject) => {
        console.error('[EtoolsUser]: updateUserData req error ', error);
        throw error;
      });
  }

  public changeCountry(countryId: number) {
    return sendRequest({
      method: 'POST',
      endpoint: {url: this.changeCountryEndpoint.url},
      body: {country: countryId}
    }).catch((error: AnyObject) => {
      console.error('[EtoolsUser]: changeCountry req error ', error);
      throw error;
    });
  }
}

window.customElements.define('etools-user', EtoolsUser);
