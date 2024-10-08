import {Action, ActionCreator} from 'redux';
import {AnyObject, EtoolsUser} from '@unicef-polymer/etools-types';

export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const UPDATE_USER_PERMISSIONS = 'UPDATE_USER_PERMISSIONS';

export interface UserActionUpdate extends Action<'UPDATE_USER_DATA'> {
  data: EtoolsUser;
}
export interface UserActionUpdatePermissions extends Action<'UPDATE_USER_PERMISSIONS'> {
  permissions: AnyObject;
}

export type UserAction = UserActionUpdate | UserActionUpdatePermissions;
// @ts-ignore - for now
// type ThunkResult = ThunkAction<void, RootState, undefined, UserAction>;

export const updateUserData: ActionCreator<UserActionUpdate> = (data: EtoolsUser) => {
  return {
    type: UPDATE_USER_DATA,
    data
  };
};

export const updateUserPermissions: ActionCreator<UserActionUpdatePermissions> = (permissions: AnyObject) => {
  return {
    type: UPDATE_USER_PERMISSIONS,
    permissions
  };
};
