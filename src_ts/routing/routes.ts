import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ROOT_PATH} from '../config/config';
import {
  EtoolsRouteCallbackParams,
  EtoolsRouteDetails
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter.init({
  baseUrl: ROOT_PATH,
  redirectPaths: {
    notFound: '/page-not-found',
    default: '/page-one/list'
  },
  redirectedPathsToSubpageLists: ['page-one']
});

EtoolsRouter.addRoute(new RegExp('^page-one/list$'), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
  return {
    routeName: 'page-one',
    subRouteName: 'list',
    path: params.matchDetails[0],
    queryParams: params.queryParams,
    params: null
  };
})
  .addRoute(
    new RegExp(`^page-one\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'page-one',
        subRouteName: params.matchDetails[2], // tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: {
          recordId: params.matchDetails[1]
        }
      };
    }
  )
  .addRoute(new RegExp(`^page-not-found$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'page-not-found',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      params: null
    };
  })
  .addRoute(new RegExp(`^page-two$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'page-two',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      params: null
    };
  });
