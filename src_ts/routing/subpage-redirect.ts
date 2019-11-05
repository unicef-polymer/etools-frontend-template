// define here main routes that need redirect to list subRoute
import {ROOT_PATH} from '../config/config';
import {Router} from './router';

/**
 * List of modules that have a main list subpage and if the current route path is the root path of this module,
 * redirect to module main list is needed.
 */
export const modulesRootPathsThatRequireListSubpageRedirect = [
  'assessments'
];

export const getRedirectToListPath = (path: string): undefined | string => {
  path = path.replace(ROOT_PATH, '');
  const route: string = Router.clearSlashes(path);
  const redirectTo: string | undefined = modulesRootPathsThatRequireListSubpageRedirect.find(
    (r: string) => r === route);
  return redirectTo ? `${ROOT_PATH}${redirectTo}/list` : undefined;
};
