/* eslint-disable max-len */
import {Action, ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../store';
import {ROOT_PATH} from '../../config/config';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {UPDATE_ROUTE} from '../actionsContants';

export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {
  opened: boolean;
}

export type AppAction = AppActionUpdateDrawerState | any;

const updateRouteDetails = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE,
    routeDetails
  };
};

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const loadPageComponents = (routeDetails: EtoolsRouteDetails) => (dispatch: any, _getState: any) => {
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
    return;
  }

  const appShell = document.body.querySelector('app-shell');
  let imported: Promise<any> | undefined;

  fireEvent(appShell as any, 'global-loading', {
    active: true,
    loadingSource: 'initialisation'
  });

  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }

  switch (routeImportsPathsKey) {
    case 'page-one_list':
      imported = import(`../../components/pages/page-one/page-one-list.js`);
      break;
    case 'page-one_details':
      imported = Promise.all([
        import(`../../components/pages/page-one/page-one-tabs.js`),
        import(`../../components/pages/page-one/page-one-tab-pages/page-one-details.js`)
      ]);
      break;
    case 'page-one_questionnaires':
      imported = Promise.all([
        import(`../../components/pages/page-one/page-one-tabs.js`),
        import(`../../components/pages/page-one/page-one-tab-pages/page-one-questionnaires.js`)
      ]);
      break;
    case 'page-two':
      imported = import(`../../components/pages/page-two.js`);
      break;
    case 'page-not-found':
    default:
      imported = import(`../../components/pages/page-not-found.js`);
      break;
  }

  if (imported) {
    imported
      .then()
      .catch((err) => {
        console.log(err);
        EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
      })
      .finally(() => {
        dispatch(updateRouteDetails(routeDetails));
        fireEvent(appShell as any, 'global-loading', {
          active: false,
          loadingSource: 'initialisation'
        });
      });
  }
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  // @ts-ignore
  if (path === ROOT_PATH && ROOT_PATH !== EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT)) {
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined = EtoolsRouter.getRedirectToListPath(path);
  if (redirectPath) {
    EtoolsRouter.updateAppLocation(redirectPath);
    return;
  }

  const routeDetails: EtoolsRouteDetails = EtoolsRouter.getRouteDetails(path)!;

  dispatch(loadPageComponents(routeDetails!));
};
