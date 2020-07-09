import {RouteDetails} from './router';

export interface RoutesLazyLoadComponentsPath {
  [key: string]: string[];
}
// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: RoutesLazyLoadComponentsPath = {
  'page-one_list': ['components/pages/page-one/page-one-list.js'],
  'page-one_details': [
    'components/pages/page-one/page-one-tabs.js',
    'components/pages/page-one/page-one-tab-pages/page-one-details.js'
  ],
  'page-one_questionnaires': [
    'components/pages/page-one/page-one-tabs.js',
    'components/pages/page-one/page-one-tab-pages/page-one-questionnaires.js'
  ],
  'page-not-found': ['components/pages/page-not-found.js'],
  'page-two': ['components/pages/page-two.js']
};

export const getFilePathsToImport = (routeDetails: RouteDetails): string[] => {
  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }

  const filesToImport: string[] = componentsLazyLoadConfig[routeImportsPathsKey];
  if (!filesToImport || filesToImport.length === 0) {
    throw new Error('No file imports configuration found (componentsLazyLoadConfig)!');
  }
  return filesToImport;
};
