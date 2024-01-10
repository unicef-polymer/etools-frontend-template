import {Reducer} from 'redux';
import {SET_ALL_STATIC_DATA, UPDATE_STATIC_DATA} from '../actions/common-data';
import {RootAction} from '../store';

export interface CommonDataState {
  unicefUsers: [];
  partners: [];
  loadedTimestamp: number;
}

const INITIAL_COMMON_DATA: CommonDataState = {
  unicefUsers: [],
  partners: [],
  loadedTimestamp: 0
};

const commonData: Reducer<CommonDataState, RootAction> = (state = INITIAL_COMMON_DATA, action) => {
  switch (action.type) {
    case SET_ALL_STATIC_DATA:
      return {
        ...state,
        unicefUsers: action.staticData.unicefUsers,
        partners: action.staticData.partners,
        loadedTimestamp: new Date().getTime()
      };
    case UPDATE_STATIC_DATA:
      return {
        ...state,
        ...action.staticData,
        loadedTimestamp: new Date().getTime()
      };
    default:
      return state;
  }
};

export default commonData;
