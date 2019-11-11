import {PolymerElement} from '@polymer/polymer/polymer-element';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../redux/store';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import {property} from '@polymer/decorators/lib/decorators';
import {GenericObject, UnicefUser} from '../../types/globals';
import {getEndpoint} from '../../endpoints/endpoints';
import {setUnicefUsers} from '../../redux/actions/common-data';


const UNICEF_USERS = 'unicefUsers';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsCommonData extends connect(store)(EtoolsAjaxRequestMixin(PolymerElement)) {

  @property({type: Object, notify: true})
  unicefUsers!: UnicefUser[];

  private unicefUsersEndpoint = getEndpoint(UNICEF_USERS);

  public stateChanged(state: RootState) {
    this.unicefUsers = state.commonData!.unicefUsers;
    console.log('[EtoolsUsersData]: store unicef user data received', state.commonData!.unicefUsers);
  }

  public getUnicefUserData() {
    return this.sendRequest({endpoint: this.unicefUsersEndpoint}).then((response: GenericObject) => {
      store.dispatch(setUnicefUsers(response));
    }).catch((error: GenericObject) => {
      console.error('[EtoolsUnicefUser]: getUnicefUserData req error...', error);
      throw error;
    });
  }

}

window.customElements.define('etools-common-data', EtoolsCommonData);
