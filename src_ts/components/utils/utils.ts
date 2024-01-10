import {appLanguages} from '../../config/app-constants';

export const languageIsAvailableInApp = (lngCode: string) => {
  return appLanguages.some((lng) => lng.value === lngCode);
};
