import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import {property} from '@polymer/decorators/lib/decorators';
import {EtoolsUserModel} from './user-model';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../redux/store';
import {getEndpoint} from '../../endpoints/endpoints';
import {GenericObject} from '../../types/globals';
import {updateUserData} from '../../redux/actions/user';
import {fireEvent} from "../utils/fire-custom-event";


const PROFILE_ENDPOINT = 'userProfile';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsUser extends connect(store)(EtoolsAjaxRequestMixin(PolymerElement)) {

  @property({type: Object, notify: true})
  userData: EtoolsUserModel | null = null;

  @property({type: Boolean})
  _saveActionInProgress: boolean = false;

  @property({type: String})
  profileSaveLoadingMsgSource: string = 'profile-modal';

  private profileEndpoint = getEndpoint(PROFILE_ENDPOINT);

  public stateChanged(state: RootState) {
    this.userData = state.user!.data;
    console.log('[EtoolsUser]: store user data', state.user!.data);
  }

  public getUserData() {
    this.sendRequest({endpoint: this.profileEndpoint}).then((response: GenericObject) => {
      // console.log(response);
      store.dispatch(updateUserData(response));
    }).catch((error: GenericObject) => {
      console.error(error);
    });
  }

  public updateUserData(profile: GenericObject) {

    this.sendRequest({endpoint: this.profileEndpoint, data: profile}).then((response: GenericObject) => {
      // console.log('response', response);
      this._handleResponse(response);

    }).catch((error: GenericObject) => {
      console.error('error', error);
    });
  }

  protected _handleResponse(response: any) {
    store.dispatch(updateUserData(response));
    this._hideProfileSaveLoadingMsg();
  }

  protected _hideProfileSaveLoadingMsg() {
    if (this._saveActionInProgress) {
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: this.profileSaveLoadingMsgSource
      });
      this.set('_saveActionInProgress', false);
    }
  }

}

window.customElements.define('etools-user', EtoolsUser);
