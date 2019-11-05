import {RouteDetails} from './router';

export interface RoutesLazyLoadComponentsPath {
  [key: string]: string[];
}
// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: RoutesLazyLoadComponentsPath = {

  'assessments_list': [
    'components/pages/assessments/assessments-list.js'
  ],
  'assessments_details': [
    'components/pages/assessments/assessment-tabs.js',
    'components/pages/assessments/assessment-tab-pages/assessment-details.js'
  ],
  'assessments_questionnaire': [
    'components/pages/assessments/assessment-tabs.js',
    'components/pages/assessments/assessment-tab-pages/assessment-questionnaire.js'
  ],
  'page-not-found': [
    'components/pages/page-not-found.js'
  ],
  'page-two': [
    'components/pages/page-two.js'
  ]

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
