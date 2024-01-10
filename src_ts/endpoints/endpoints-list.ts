import {EtoolsEndpoint} from '@unicef-polymer/etools-types';

export interface EtoolsEndpoints {
  userProfile: EtoolsEndpoint;
  changeCountry: EtoolsEndpoint;
  unicefUsers: EtoolsEndpoint;
  changeOrganization: EtoolsEndpoint;
  attachmentsUpload: EtoolsEndpoint;
}

export const etoolsEndpoints: EtoolsEndpoints = {
  userProfile: {
    url: '/api/v3/users/profile/'
  },
  changeCountry: {
    url: '/api/v3/users/changecountry/'
  },
  unicefUsers: {
    url: '/api/v3/users/?verbosity=minimal',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'unicefUsers'
  },
  changeOrganization: {
    url: '/api/v3/users/changeorganization/'
  },
  attachmentsUpload: {
    url: '/api/v2/attachments/upload/'
  }
};
