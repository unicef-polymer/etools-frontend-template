import {Reducer} from 'redux';
import {RootAction} from '../store';
import {SHOW_TOAST, CLOSE_TOAST, UPDATE_ROUTE} from '../actionsContants';
import {RouteDetails} from '@unicef-polymer/etools-types';
// eslint-disable-next-line max-len

export interface AppState {
  routeDetails: RouteDetails;
  toastNotification: {
    active: boolean;
    message: string;
    showCloseBtn: boolean;
  };
}

const INITIAL_STATE: AppState = {
  routeDetails: {} as RouteDetails,
  toastNotification: {
    active: false,
    message: '',
    showCloseBtn: true
  }
};

const app: Reducer<AppState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_ROUTE:
      return {
        ...state,
        routeDetails: action.routeDetails
      };
    case SHOW_TOAST:
      return {
        ...state,
        toastNotification: {
          active: true,
          message: action.message,
          showCloseBtn: action.showCloseBtn
        }
      };
    case CLOSE_TOAST:
      return {
        ...state,
        toastNotification: {
          active: false,
          message: '',
          showCloseBtn: false
        }
      };
    default:
      return state;
  }
};

export default app;
