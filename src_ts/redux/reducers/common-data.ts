import {Reducer} from 'redux';
import {UPDATE_UNICEF_USERS_DATA} from '../actions/common-data';
import {RootAction} from '../store';
import {UnicefUser} from '../../types/globals';

export interface CommonDataState {
  unicefUsers: UnicefUser[];
}

const INITIAL_COMMON_DATA: CommonDataState = {
  unicefUsers: []
//  TODO: add more commondata subproperties
};

const commonData: Reducer<CommonDataState, RootAction> = (state = INITIAL_COMMON_DATA, action) => {
  switch (action.type) {
    case UPDATE_UNICEF_USERS_DATA:
      return {
        ...state,
        unicefUsers: action.unicefUsersData
      };
    default:
      return state;
  }
};

export default commonData;

