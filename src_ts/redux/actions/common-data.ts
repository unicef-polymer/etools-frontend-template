import {Action} from 'redux';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
import {etoolsEndpoints} from '../../endpoints/endpoints-list';

export const SET_ALL_STATIC_DATA = 'SET_ALL_STATIC_DATA';
export const UPDATE_STATIC_DATA = 'UPDATE_STATIC_DATA';

export interface CommonDataActionSetAllStaticData extends Action<'SET_ALL_STATIC_DATA'> {}

export interface CommonDataActionUpdateStaticData extends Action<'UPDATE_STATIC_DATA'> {}

export type CommonDataAction = CommonDataActionSetAllStaticData | CommonDataActionUpdateStaticData;

export const getUnicefUsers = () => {
  return sendRequest({
    endpoint: {url: etoolsEndpoints.unicefUsers.url!}
  });
};
