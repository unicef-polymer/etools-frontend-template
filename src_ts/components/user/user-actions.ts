import {updateUserData} from '../../redux/actions/user';
import {setActiveLanguage} from '../../redux/actions/active-language';
import {getEndpoint} from '../../endpoints/endpoints';
import {store} from '../../redux/store';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';
import {languageIsAvailableInApp} from '../utils/utils';

export function getCurrentUser() {
  return sendRequest({
    endpoint: {url: getEndpoint(etoolsEndpoints.userProfile).url}
  })
    .then((response: EtoolsUser) => {
      store.dispatch(updateUserData(response));

      setCurrentLanguage(response.preferences?.language);

      return response;
    })
    .catch((error: AnyObject) => {
      if ([403, 401].includes(error.status)) {
        window.location.href = window.location.origin + '/login';
      }
      throw error;
    });
}

function setCurrentLanguage(lngCode: string) {
  let currentLanguage = '';
  if (lngCode) {
    lngCode = lngCode.substring(0, 2);
    if (languageIsAvailableInApp(lngCode)) {
      currentLanguage = lngCode;
    } else {
      console.log(`User profile language ${lngCode} missing`);
    }
  }
  if (!currentLanguage) {
    const storageLang = window.EtoolsLanguage;
    if (storageLang && languageIsAvailableInApp(storageLang)) {
      currentLanguage = storageLang;
    }
  }
  if (!currentLanguage) {
    currentLanguage = 'en';
  }
  store.dispatch(setActiveLanguage(currentLanguage));
}

export function updateCurrentUser(profile: AnyObject) {
  return sendRequest({
    method: 'PATCH',
    endpoint: {url: getEndpoint(etoolsEndpoints.userProfile).url},
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

export function changeCurrentUserCountry(countryId: number) {
  return sendRequest({
    method: 'POST',
    endpoint: {url: getEndpoint(etoolsEndpoints.changeCountry).url},
    body: {country: countryId}
  }).catch((error: AnyObject) => {
    console.error('[EtoolsUser]: changeCountry req error ', error);
    throw error;
  });
}

export function changeCurrentOrganization(organizationId: number) {
  return sendRequest({
    method: 'POST',
    endpoint: {url: getEndpoint(etoolsEndpoints.changeOrganization).url},
    body: {organization: organizationId}
  }).catch((error: AnyObject) => {
    console.error('[EtoolsUser]: changeOrganization req error ', error);
    throw error;
  });
}
